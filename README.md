# Website Engine — Looking Glass Labs

The master starter system every client site is stamped from. Small-business
websites that look custom and expensive, ship in days, and need zero maintenance
after handoff.

**[CLAUDE.md](./CLAUDE.md) is the operating manual.** Read it before writing
code. This file is just the map.

---

## Quick start

```bash
npm install
```

```bash
npm run dev
```

The reference build ("Rosalia's", a fictional Federal Hill restaurant) is at
`/`, with the Spanish route at `/es/`. It exists so you can see every section
working together.

Scaffold a real project:

```bash
./scripts/new-client.sh --name "Business Name" --vertical restaurant
```

Or a cold-outreach demo:

```bash
./scripts/new-client.sh --ambush --name "Business Name" --vertical auto
```

---

## Commands

| Command | What it does |
|---|---|
| `npm run dev` | Dev server |
| `npm run build` | Production build to `dist/` |
| `npm run preview` | Serve the built output locally |
| `npm run check` | `astro check` — types and template errors |
| `npm run check:contrast` | WCAG AA gate on the live palette (81 checks) |
| `npm run check:recipes` | WCAG AA gate on all 16 design recipes (982 checks) |
| `npm run verify` | All of the above, in order. **The gate before shipping** |
| `npm run placeholders` | Regenerate the FPO image set |
| `./scripts/new-client.sh` | Scaffold a new project |

---

## Stack

Astro (static) · vanilla CSS with design tokens · GSAP + ScrollTrigger ·
self-hosted Fontsource · Formspree/Web3Forms · GitHub → Cloudflare Pages.

No Tailwind, no React, no CMS, no database, no backend. The reasoning for each
is in CLAUDE.md §1.

---

## Where things are

```
engine/
├── CLAUDE.md                    the brain — rules, budgets, differentiation log
├── DEPLOY.md                    click-by-click hosting setup
├── docs/
│   ├── design-recipes.md        16 aesthetic starting points
│   ├── ambush-workflow.md       the under-one-hour cold-outreach process
│   ├── qa-checklist.md          definition of done
│   └── handoff-packet-template.md
├── scripts/
│   ├── new-client.sh            scaffold a project from the engine
│   ├── check-contrast.mjs       parses tokens.css, asserts WCAG AA
│   ├── check-recipes.mjs        same matrix, every recipe
│   └── make-placeholders.mjs    FPO image generation
└── src/
    ├── config/site.ts           EVERY site-wide fact, one file
    ├── styles/tokens.css        THE ONLY FILE THAT DEFINES BRAND PERSONALITY
    ├── styles/base.css          reset, type, layout primitives, motion contract
    ├── content.config.ts        Zod schemas — missing content is a build error
    ├── content/                 the client's actual words
    ├── i18n/ui.ts               structural microcopy only (en/es)
    ├── lib/                     motion, schema, content helpers
    ├── layouts/BaseLayout.astro the only layout
    ├── components/core/         nav, footer, form, map, gallery, lightbox…
    └── components/sections/     the section library
```

---

## The two files you edit per project

1. **`src/styles/tokens.css`** — the palette, type, spacing, motion and
   photography treatment. Paste a recipe's primitives in, then modify them.
2. **`src/config/site.ts`** — name, phone, address, hours, form endpoint,
   vertical, locales.

Everything else should be composition. If you find yourself editing a component
to change how a site *looks*, the token system has a gap — fix the gap
(CLAUDE.md §2).

---

## Section library

**Heroes** — FullBleed (A), Split (B), Editorial (C), Video (D), Centered (E)
**Menu** — Classic two-column (A), Cards with photos (B), Editorial dot-leaders (C)
**About** — Alternating rows, Heritage with timeline
**Gallery** — masonry / uniform / horizontal scroll, all with lightbox
**Testimonials** — pull quote, grid
**Trades & professional** — ServicesGrid, ProcessSteps, TrustBar, FAQ,
ProviderBios, BeforeAfter, PackageTiers, EmergencyBanner
**Everything else** — EventsFeature, LocationContact, CTABand, AnnouncementBar,
ConceptBadge, 404

All menu variants read one content collection, so switching layout is a one-line
change in the page.

---

## Non-negotiables

- **Lighthouse ≥95** on all four categories, mobile. A gate, not a target.
- **WCAG AA**, enforced mechanically by `check:contrast`.
- **All content in content collections** — never hardcoded in a component.
- **No two projects share** hero variant + type pairing + colour story
  (CLAUDE.md §8, logged in §9).
- **Never invent** a review, credential, licence, statistic or award
  (CLAUDE.md §11).

---

## Bilingual

English and Spanish are wired via Astro's i18n routing. Adding a language is a
**content task**: add the locale to `SITE.locales`, add a block to
`src/i18n/ui.ts`, and write content entries with `lang: 'xx'`. `/es/index.astro`
is the working proof — it shares every component with the English page and
differs only in copy.
