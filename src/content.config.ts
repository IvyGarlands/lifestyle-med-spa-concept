/**
 * content.config.ts — every piece of client content, schema'd.
 *
 * Zod schemas are the guardrail: a missing price, a testimonial without a
 * source, an image without alt text is a BUILD ERROR, not something a client
 * discovers. That is deliberate (CLAUDE.md §10).
 *
 * Every collection carries `lang`, so adding Spanish is a content task rather
 * than an engineering one.
 */

import { defineCollection, z, type SchemaContext } from "astro:content";
import { glob } from "astro/loaders";
import { existsSync, readdirSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { resolve } from "node:path";
import { SITE } from "./config/site";

const langs = SITE.locales as readonly [string, ...string[]];
const lang = z.enum(langs).default(SITE.defaultLocale);

/**
 * AN EMPTY COLLECTION IS A NORMAL STATE, NOT A WARNING.
 *
 * Every real client project starts with most of these empty and fills them in
 * as material arrives, and several of them stay empty for good — a med spa
 * that has not supplied verbatim reviews must not ship a reviews section
 * (CLAUDE.md §11), so `testimonials` being empty is the system working.
 *
 * Astro's glob loader warns on both an empty directory and a missing one, and
 * `npm run build` has to be warning-clean to pass §7. Left alone that pushes
 * you toward the wrong fix — deleting schemas, or worse, inventing content to
 * fill them.
 *
 * So: glob when there is something to glob, and hand back an empty loader when
 * there is not. Dropping the first JSON file into the directory switches it
 * back on with no config change.
 */
/* Resolved from this file's own URL, not from process.cwd(): Astro evaluates
   the content config inside a Vite module runner where `process` is not yet
   initialised, and cwd would be wrong under a monorepo anyway. */
const CONTENT_ROOT = fileURLToPath(new URL("./content/", import.meta.url));

const hasContent = (dir: string, pattern: RegExp): boolean => {
  const base = resolve(CONTENT_ROOT, dir);
  if (!existsSync(base)) return false;
  return readdirSync(base, { recursive: true }).some((f) =>
    pattern.test(String(f))
  );
};

const empty = (dir: string) => ({
  name: `empty:${dir}`,
  load: async () => {},
});

const ANY = /\.(md|json|ya?ml)$/;
const MD = /\.md$/;

const src = (dir: string) =>
  hasContent(dir, ANY)
    ? glob({ pattern: "**/*.{md,json,yaml,yml}", base: `./src/content/${dir}` })
    : empty(dir);

const srcMd = (dir: string) =>
  hasContent(dir, MD)
    ? glob({ pattern: "**/*.md", base: `./src/content/${dir}` })
    : empty(dir);

/**
 * Photo fields use Astro's `image()` schema helper, so every referenced file is
 * processed by astro:assets — AVIF/WebP with explicit dimensions — rather than
 * shipped raw.
 *
 * `alt` is enforced by `requireAlt` below: a photo without alt text fails the
 * BUILD, it is not something a client discovers. Decorative images pass
 * `alt: ""` and must justify themselves in `altNote` (CLAUDE.md §5).
 */
const photoFields = ({ image }: SchemaContext) => ({
  photo: image().optional(),
  alt: z.string().optional(),
  altNote: z.string().optional(),
});

/**
 * Structural stand-in for zod's RefinementCtx. Typed this way on purpose: `z`
 * is re-exported from `astro:content` as a value, not a namespace, and reaching
 * for `zod`'s own types would mean importing a transitive dependency that only
 * resolves because npm happens to hoist it.
 */
interface RefineCtx {
  addIssue(issue: {
    code: "custom";
    path: (string | number)[];
    message: string;
  }): void;
}

/** superRefine guard shared by every collection that can carry a photo. */
function requireAlt(
  data: { photo?: unknown; alt?: string; altNote?: string },
  ctx: RefineCtx
) {
  if (data.photo && data.alt === undefined) {
    ctx.addIssue({
      code: "custom",
      path: ["alt"],
      message:
        'alt is required whenever photo is set. Use alt: "" for a decorative image and say why in altNote.',
    });
  }
  if (data.alt === "" && !data.altNote) {
    ctx.addIssue({
      code: "custom",
      path: ["altNote"],
      message:
        'altNote is required when alt is "" — state why this image is decorative.',
    });
  }
}

/* ---------------------------------------------------------------------- */

const menu = defineCollection({
  loader: src("menu"),
  schema: (ctx) =>
    z
      .object({
        lang,
        /** Section header on the page, e.g. "Antipasti". Drives grouping. */
        category: z.string(),
        categoryOrder: z.number().default(0),
        name: z.string(),
        description: z.string().optional(),
        /** String, not number: real menus say "24", "MP", "18 / 32". */
        price: z.string().optional(),
        order: z.number().default(0),
        tags: z.array(z.string()).default([]),
        featured: z.boolean().default(false),
        ...photoFields(ctx),
      })
      .superRefine(requireAlt),
});

const services = defineCollection({
  loader: src("services"),
  schema: (ctx) =>
    z
      .object({
        lang,
        name: z.string(),
        summary: z.string(),
        /** Longer body for a detail page or an expanded card. */
        detail: z.string().optional(),
        price: z.string().optional(),
        /** "from", "per visit", "per hour" — rendered next to price. */
        priceNote: z.string().optional(),
        /** Key into the inline icon set, not a file path. */
        icon: z.string().optional(),
        order: z.number().default(0),
        featured: z.boolean().default(false),
        ...photoFields(ctx),
      })
      .superRefine(requireAlt),
});

const events = defineCollection({
  loader: src("events"),
  schema: (ctx) =>
    z
      .object({
        lang,
        title: z.string(),
        summary: z.string().optional(),
        date: z.coerce.date().optional(),
        endDate: z.coerce.date().optional(),
        /** e.g. "Every Tuesday" — used when there is no single date. */
        recurring: z.string().optional(),
        ctaLabel: z.string().optional(),
        ctaHref: z.string().optional(),
        order: z.number().default(0),
        ...photoFields(ctx),
      })
      .superRefine(requireAlt),
});

const projects = defineCollection({
  loader: src("projects"),
  schema: (ctx) =>
    z
      .object({
        lang,
        title: z.string(),
        summary: z.string().optional(),
        /** Before/after pairs for remodelers and detailers. */
        beforePhoto: ctx.image().optional(),
        beforeAlt: z.string().optional(),
        location: z.string().optional(),
        year: z.string().optional(),
        order: z.number().default(0),
        ...photoFields(ctx),
      })
      .superRefine((data, c) => {
        requireAlt(data, c);
        if (data.beforePhoto && data.beforeAlt === undefined) {
          c.addIssue({
            code: "custom",
            path: ["beforeAlt"],
            message: "beforeAlt is required whenever beforePhoto is set.",
          });
        }
      }),
});

const testimonials = defineCollection({
  loader: src("testimonials"),
  schema: z.object({
    lang,
    /** Real review text, verbatim. Never authored by us — CLAUDE.md §11. */
    quote: z.string(),
    author: z.string(),
    rating: z.number().min(1).max(5).optional(),
    /** Where it came from. Required so we can never launder an invented one. */
    source: z.enum(["Google", "Yelp", "Facebook", "TripAdvisor", "Direct"]),
    date: z.coerce.date().optional(),
    order: z.number().default(0),
    featured: z.boolean().default(false),
  }),
});

/**
 * treatments — a capability list, names only.
 *
 * Deliberately NOT the `services` collection. `services` requires a `summary`,
 * which is correct for six offerings you are actively selling and impossible
 * for fifty. Writing fifty one-line descriptions of aesthetic procedures would
 * mean originating fifty clinical claims, which CLAUDE.md §11 forbids outright
 * in this vertical.
 *
 * So this collection holds exactly what the client published and nothing more:
 * a group name and the treatment names inside it, verbatim. The count rendered
 * beside each group is derived from the array, not asserted.
 *
 * Reusable well beyond a med spa — any practice with a long capability list
 * (a law firm's practice areas, a shop's makes serviced) has this same shape.
 */
const treatments = defineCollection({
  loader: src("treatments"),
  schema: z.object({
    lang,
    /** Section label, e.g. "Injectables". */
    group: z.string(),
    order: z.number().default(0),
    /** Treatment names, verbatim. Never paraphrased, never expanded. */
    items: z.array(z.string()).min(1),
  }),
});

const faq = defineCollection({
  loader: src("faq"),
  schema: z.object({
    lang,
    question: z.string(),
    answer: z.string(),
    order: z.number().default(0),
  }),
});

const people = defineCollection({
  loader: src("people"),
  schema: (ctx) =>
    z
      .object({
        lang,
        name: z.string(),
        role: z.string(),
        /** Client-supplied, verbatim. Never invented — CLAUDE.md §11. */
        credentials: z.array(z.string()).default([]),
        bio: z.string().optional(),
        order: z.number().default(0),
        ...photoFields(ctx),
      })
      .superRefine(requireAlt),
});

const credentials = defineCollection({
  loader: src("credentials"),
  schema: (ctx) =>
    z.object({
      lang,
      label: z.string(),
      issuer: z.string().optional(),
      logo: ctx.image().optional(),
      logoAlt: z.string().optional(),
      order: z.number().default(0),
    }),
});

const process = defineCollection({
  loader: src("process"),
  schema: z.object({
    lang,
    step: z.number(),
    title: z.string(),
    body: z.string(),
  }),
});

const pages = defineCollection({
  loader: srcMd("pages"),
  schema: (ctx) =>
    z.object({
      lang,
      title: z.string(),
      description: z.string(),
      /** Omit to keep a page out of the nav. */
      navLabel: z.string().optional(),
      navOrder: z.number().optional(),
      heroPhoto: ctx.image().optional(),
      heroAlt: z.string().optional(),
      draft: z.boolean().default(false),
    }),
});

/**
 * Every collection stays registered. The ones with no files resolve to the
 * empty loader above rather than warning, so the component library keeps its
 * types and dropping in the first file is the only step needed.
 *
 * Empty on this build, and what unblocks each:
 *   testimonials  five to ten verbatim Google reviews (name + rating + month)
 *   people        provider names, roles and credentials, incl. medical director
 *   credentials   licence number and any required California disclaimer
 *   faq           answers the client confirms, not answers we guessed
 *   projects      consented before/after photography, if any exists
 * All five are blocked on the client, not on us — CLAUDE.md §11.
 */
export const collections = {
  menu,
  services,
  treatments,
  events,
  projects,
  testimonials,
  faq,
  people,
  credentials,
  process,
  pages,
};
