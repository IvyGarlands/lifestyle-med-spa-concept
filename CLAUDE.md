# CLAUDE.md — Website Engine

This file is the operating manual for every site built from this engine. Read it
before writing a line of code. When something here conflicts with a habit, this
file wins. When this file is silent, make the call a senior developer would make
and **write the decision down here.**

---

## 0. What we are

**Looking Glass Labs** — a productized website studio. We build small-business
sites in two families of vertical:

- **Hospitality & lifestyle** — restaurants, event venues, bakeries, salons,
  dance studios. The visitor is choosing an experience; atmosphere sells.
- **Professional services & trades** — home services, remodelers, med spas,
  dentists, solo attorneys, financial advisors, vets, auto repair and detailing.
  The visitor has a problem and is assessing risk; credentials, process and a
  phone number sell.

That split drives real structural differences, not just palette: the second
family needs `TrustBar`, `ProcessSteps`, `FAQ`, `ProviderBios` and
`EmergencyBanner` far more than it needs a gallery, and several of those
verticals carry advertising regulations (§11).

Both families produce sites that:

- **look custom and expensive** (the whole commercial premise)
- **ship in days, not months**
- **require zero maintenance after handoff** (no CMS to break, no server to patch,
  no plugin to update, no monthly bill we have to service)

Everything built here is permanent infrastructure. A pattern built for one client
gets generalized and merged back so the next client starts further ahead.

Two modes of work:

| Mode | What it is | Where it happens |
|---|---|---|
| **Engine mode** | Improving this starter system | this repo |
| **Ambush mode** | A redesigned homepage for a real local business, as cold outreach, live in under an hour | `../ambush-[slug]/` — see `docs/ambush-workflow.md` |

---

## 1. Stack — non-negotiable

| Concern | Decision | Never |
|---|---|---|
| Framework | **Astro**, `output: 'static'` | SSR, a database, a CMS, React/Vue/Svelte |
| Styling | **Vanilla CSS** + design tokens | Tailwind, CSS-in-JS, a component library |
| Fonts | **Fontsource, self-hosted, subset at build** | Any runtime font CDN call |
| Animation | **CSS transitions** for micro-interactions, **GSAP + ScrollTrigger** for scroll/hero | Bounce, spin, >15% parallax, autoplaying carousels |
| Images | **`astro:assets` `<Image>` / `<Picture>`**, AVIF+WebP, explicit dimensions | `<img>` with a raw src, unsized images, lazy-loading the LCP image |
| Forms | **Formspree or Web3Forms** via one `FORM_ENDPOINT` | A custom backend, a serverless function, ever |
| SEO | Shared `SEOHead` + per-vertical JSON-LD (§10a) | Hand-rolled meta tags in a page |
| Hosting | **GitHub → Cloudflare Pages**, auto-deploy on push | Anything the client has to log into |
| Interactivity | Vanilla TS islands, `client:visible` / `client:idle` | Shipping a framework runtime for a dropdown |

### Client JS budget: **48 KB gzipped**, total, on the homepage

Measured on the reference build: **44.7 KB gz**, essentially all of it GSAP +
ScrollTrigger. Our own islands — mobile nav, lightbox, map facade, announcement
bar, form, hero video — come to under 4 KB combined.

> This budget was originally written as 40 KB and that number was wrong: the
> mandated animation stack does not fit in it. Raised to 48 KB after measuring,
> which leaves ~3 KB of headroom and no more. **If a feature needs a library, it
> does not need that feature.**

The bundle is `type="module"`, therefore deferred and never render-blocking,
which is why 45 KB does not cost us the performance score. What *would* cost us
is main-thread work, so GSAP does nothing until `requestAnimationFrame` fires
and scroll reveals are `once: true`.

If a future project needs the headroom back, the lever is: drop GSAP for
IntersectionObserver + CSS transitions on reveals (about 1 KB, and the reveal
contract in `base.css` §8 already expresses everything declaratively), keeping
GSAP only where scrub-linked parallax genuinely needs it. That is a deliberate
change to §1's stack rules, not something to do quietly.

---

## 2. The tokens contract

`src/styles/tokens.css` is **the only file that defines brand personality.**

> If you have to edit a component to change how a site *looks*, the token system
> has a gap. Fix the gap, not the component.

### Two layers

- **Primitives** (`--n-*`, `--b-*`, `--a-*`) — the raw palette. Reskinning starts here.
- **Semantics** (`--color-ink`, `--space-l`, `--step-4`) — primitives mapped to jobs.

**Components consume semantics only.** A component that references `--b-700` or
`#fff` is a bug. There is no exception for "just this once".

### Full token reference

| Group | Tokens | Controls |
|---|---|---|
| **Palette (§1)** | `--n-000…900`, `--b-050…900`, `--a-100…900`, `--ok/warn/err-500` | Raw ramps. Neutral carries 90% of the page; brand is the memorable colour; accent stays under ~5% coverage. |
| **Faces (§2)** | `--face-display`, `--face-body`, `--face-mono` | The three typeface stacks. Fallbacks must be metrically close or the swap is a layout shift. |
| **Surfaces (§3)** | `--color-canvas`, `--color-surface`, `--color-surface-sunken`, `--color-surface-inverse` | Page bg; cards/panels; wells and alternating bands; dark sections. |
| **Ink (§3)** | `--color-ink`, `-strong`, `-muted`, `-inverse`, `-inverse-muted` | Body; headings; captions and meta; copy on dark; meta on dark. |
| **Brand/accent (§3)** | `--color-brand`, `-strong`, `-contrast`, `--color-accent`, `--color-accent-contrast` | Links and brand marks; hover/pressed; ink that sits *on* a filled area. |
| **Lines (§3)** | `--color-line`, `--color-line-strong`, `--color-focus` | `--color-line` is **decorative only**. Any border that carries meaning — inputs, buttons, focusable edges, selected states — **must** use `--color-line-strong` (≥3:1). |
| **Type scale (§4)** | `--step--1 … --step-7` | Fluid `clamp()` scale. `--step-0` is body and never shrinks below 16px. `--step-7` is once per page, maximum. |
| **Type detail (§4)** | `--weight-*`, `--leading-*`, `--tracking-*` | Tracking is the fastest tell of designed vs. amateur type. Display is always tighter than body. |
| **Space (§5)** | `--space-3xs … --space-4xl`, `--section-y`, `--section-y-tight/loose`, `--stack-gap` | One scale for gaps, padding and rhythm. **`--section-y` is the single biggest lever on "does this feel expensive." Generous = expensive.** |
| **Layout (§6)** | `--container-xs…xl`, `--gutter`, `--measure`, `--measure-narrow`, `--header-h` | Widths, page edge padding, prose line length (65ch target). |
| **Shape (§7)** | `--radius-*`, `--border-*`, `--shadow-s/m/l`, `--z-*` | Radius is a strong personality signal: Heritage/Editorial 0–2px, Bakery/Studio 12–20px. Shadows are **large and low-contrast** — tight dark shadows read as Bootstrap. |
| **Motion (§8)** | `--duration-*`, `--ease-*`, `--motion-distance`, `--motion-stagger`, `--motion-parallax` | See §4 below. Retune a whole site's motion personality by changing `--duration-reveal` and `--motion-distance`. |
| **Image (§9)** | `--image-filter`, `--image-filter-hero`, `--image-hover-scale`, `--scrim-*`, `--grain-*`, `--ratio-*` | Photo mood for the whole site in one edit. Scrims guarantee contrast over photography. Ratios are locked to prevent layout shift. |
| **Contexts (§10)** | `.on-dark`, `.on-brand` | Re-point ink/line/focus for dark and brand-filled sections. This is how one component serves a cream section and a near-black footer with **zero variant props and zero contrast bugs.** Wrap the section, don't fork the component. |

### Enforcement

```bash
npm run check:contrast
```

Parses `tokens.css`, resolves the `var()` chains in `:root`, `.on-dark` and
`.on-brand`, and asserts every ink/surface pair the system can produce — plus
hero type over the scrim on a worst-case bright photo. **Run it after every
reskin.** It exits non-zero on failure, so it can gate a build. That script is
what makes "WCAG AA is enforced through the token system" a fact rather than an
aspiration.

When a component introduces a genuinely new pairing, add it to the matrix in
`scripts/check-contrast.mjs`.

---

## 3. Architecture rules

### Content lives in content collections. Always.

**No copy, no prices, no hours, no phone numbers, no testimonials hardcoded in a
component.** Ever. Components take props and render; content comes from
`src/content/`. This is what makes a menu-layout swap a one-line change, makes
bilingual a content task, and makes handoff possible.

The one exception: structural microcopy that is part of the component's
mechanics, not the business's voice — "Skip to content", "Open menu", "Previous".
Those belong in `src/i18n/ui.ts`.

### Site-wide facts live in `src/config/site.ts`

Business name, phone, address, `FORM_ENDPOINT`, map coordinates, social links,
default OG image, locale list. One import, one source of truth.

### Component naming

```
src/components/
  core/        SiteNav, MobileNav, Footer, SEOHead, ContactForm, GoogleMap,
               HoursTable, Gallery, Lightbox, CTABand, AnnouncementBar,
               ConceptBadge
  sections/    <Name><Variant>.astro   →  HeroSplit.astro, MenuLeaders.astro
  verticals/   restaurant/ venue/ bakery/ auto/ salon/ studio/
               homeservices/ contractor/ medspa/ dental/ legal/ financial/ vet/
```

- **PascalCase** files, one component per file.
- Section variants are **separate files with a shared prop contract**, not a
  `variant="a"` prop with a giant conditional inside. Variants differ
  structurally; props differ in name only where they must.
- A `sections/` component owns its `<section>` element, its padding, and its
  container. A page composes sections; it does not lay them out.
- `verticals/` holds anything genuinely specific to one trade (a service-bay
  table, a class schedule). If two verticals want it, promote it to `sections/`.

### Props contract for sections

Every section accepts, at minimum:

```ts
interface SectionProps {
  id?: string;            // anchor target
  eyebrow?: string;
  heading: string;
  body?: string;
  tone?: 'default' | 'sunken' | 'dark' | 'brand';  // maps to the context classes
  spacing?: 'tight' | 'default' | 'loose';
}
```

`tone` sets the wrapper class (`.on-dark` / `.on-brand` / `.surface--sunken`).
That is the *only* mechanism for changing a section's colour context.

### The generalize-back rule

When a client project needs a pattern the engine does not have:

1. Build it in the client project, shaped for that client.
2. Before handoff, ask: *would a second client want this?* If yes —
3. Generalize it (tokens instead of values, props instead of hardcoded copy),
   move it into the engine, and note it in §9.

An engine that does not grow after each project is a template, and templates
lose to custom work.

---

## 4. Motion rules

Motion is most of why a site reads as expensive. It is also the fastest way to
make one look cheap.

**Do**

- Reveal durations **0.5–0.8s**; micro-interactions **0.15–0.25s**.
- **ease-out only** for entrances (`--ease-out`, `cubic-bezier(0.22, 1, 0.36, 1)`).
- Reveal travel **≤24px** (`--motion-distance`). Subtle beats dramatic.
- Stagger **0.06–0.12s**. Generous. Never machine-gun.
- Parallax **≤15%** (`--motion-parallax`, capped at 0.15).
- Animate `transform` and `opacity` only. Anything else janks.
- Reveal **once**. Elements that re-animate on scroll-up are exhausting.

**Never**

- Bounce, elastic, spin, flip, typewriter, counting numbers.
- Animating `width`, `height`, `top`, `left`, `margin`, or `filter`.
- Motion that delays the LCP element. **The hero's largest text and image must be
  visible at first paint** — animate them from a *visible* state (a small fade-up
  that starts at opacity 1 is fine; starting at 0 is not, it destroys LCP).
- More than one element in the viewport competing for the eye at once.

**The reveal contract** — components opt in declaratively, `src/lib/motion.ts`
does the work:

```html
<div data-reveal-stagger>
  <h2 data-reveal>…</h2>              <!-- default: up -->
  <p data-reveal="fade">…</p>
  <img data-reveal="left" data-reveal-delay="0.2" />
</div>
```

**Fail-safe:** the hidden start state is scoped to `.js-motion`, a class
`motion.ts` puts on `<html>` only once it is alive. If JS fails, errors, or is
blocked, **all content is visible**. Never hide content in a stylesheet and rely
on JS to reveal it.

**Reduced motion** is handled at the token layer — `prefers-reduced-motion`
zeroes the durations and distances, so CSS transitions, GSAP (which reads the
tokens) and scroll behaviour all fall in line at once. Still verify it manually;
the checklist requires it.

---

## 4a. THE STANDARD

Every build — client or ambush — is held to this. It outranks tastefulness.

**Spectacular, not safe.** Every page must have at least one moment a person
would screenshot and send to a friend. A hero that does something unexpected, a
typographic decision with real conviction, a transition that lands, a section
that breaks the grid on purpose. **If the page could be fairly described as
"clean and modern," it has failed.**

**Unique to this business, not to the category.** Not "a restaurant site" or "a
med spa site." *This* business's site. There must be a one-sentence idea about
what makes this place different from every competitor within ten miles, and that
idea must be the organizing principle of layout, type, colour, imagery and
motion — not a paragraph in an about section.

**The recipe is a starting point, not a destination.** Push past it. Change the
palette, alter the type scale, mix recipes, invent what the list does not cover.
**If two demos could be mistaken for each other, that is a defect.**

**Honour good branding, create missing branding.** Retrieve and complement any
existing logo, wordmark, colours or type identity. But if the branding is weak,
absent or clip-art, do not inherit it out of politeness. Design a real identity
from what is known — history, signature product, neighbourhood, room, the
language their customers speak, the words that recur in their reviews. A
wordmark or logotype, a full colour system, a type pairing and any supporting
mark, all built into `tokens.css` and used consistently. A real identity, not a
placeholder.

### The two-tier motion doctrine

§4's rules produce *tasteful*. Tasteful alone cannot produce a screenshot
moment. So motion is split, and the tiers are not interchangeable:

| | **Ambient** (§4) | **Signature** (§4a) |
|---|---|---|
| Where | Everywhere | **Exactly one moment per page** |
| Job | Must never be noticed | Must be remembered |
| Duration | 0.5–0.8s | up to 1.6s (`--sig-duration-long`) |
| Travel | ≤24px | Whatever the composition needs |
| Parallax | ≤0.15 | ≤0.45, and only as *layered depth* |
| Tokens | `--duration-*`, `--motion-*` | `--sig-*` |

The ambient ceiling is unchanged and still enforced in code. The signature tier
is a deliberate, budgeted exception.

**Scarcity is the mechanism.** One signature moment per page. A second one does
not double the impact — it halves the first. If everything moves, nothing is
remembered.

### The signature toolkit

| Tool | Markup | Use for |
|---|---|---|
| Layered parallax | `[data-parallax-scene]` + `[data-depth="0…1"]` | Depth heroes. `HeroLayered.astro` |
| Masked type reveal | `[data-split="lines"\|"words"]` | Headlines with conviction |
| Pinned showcase | `[data-pin-scene]`, `[data-pin-sticky]`, `[data-pin-step]` | Process, treatment journeys, before/after |
| Kinetic marquee | `MarqueeBand.astro` | Cheap pulse; CSS-only |
| Magnetic | `[data-magnetic]` | The one primary CTA |
| Tilt | `[data-tilt]` | Card grids that need life |

### Three rules that constrain all of it

1. **The static composition must stand alone.** Turn JS off. If the section is
   worthless, the composition was never good enough and motion is hiding it.
   Every signature component here has a composed fallback — that is the test.
2. **Reduced motion collapses the whole tier to zero.** All `--sig-*` tokens go
   to `0` under `prefers-reduced-motion`. A screenshot moment that ignores a
   vestibular-disorder setting is a liability, not a moment.
3. **The performance budget does not move.** If a signature moment breaches
   §6, redesign the implementation — not the budget. Every tool above is
   transform/opacity-only, pointer-gated, and pinning is skipped on phones.

### Spectacle by vertical

"Where applicable" is doing real work in this rule. Lavish motion on a solo
attorney's site actively damages conversion — it reads as a firm with time to
spare and money to burn.

| Spectacle budget | Verticals | Signature moment should be |
|---|---|---|
| **High** | medspa, salon, studio, nightlife, venue, autodetail, bakery | Motion. Go for it. |
| **Medium** | restaurant, contractor, vet, dental | Composition or type; motion supports |
| **Low** | legal, financial, homeservices (emergency) | **Typographic or structural, not kinetic** |

A low-spectacle vertical still needs its screenshot moment. It is just made of
type, scale, colour and restraint rather than movement — an enormous confident
wordmark, a radical measure, one perfect portrait full-bleed. Restraint executed
with conviction is itself a moment; restraint executed by default is just bland.

---

## 5. Accessibility budget

Non-negotiable, verified per project:

- **Landmarks**: one `<header>`, one `<main>`, one `<footer>`, `<nav>` labelled
  when there is more than one. One `<h1>` per page; heading levels never skip.
- **Focus** is never removed. `:focus-visible` ring, 3px, 3px offset, ≥3:1
  against both adjacent surfaces.
- **Contrast**: AA everywhere, enforced by `npm run check:contrast`.
- **Alt text is required on every image.** Decorative images get `alt=""` *and* a
  comment saying why. A missing `alt` prop is a build-time type error, and it
  should stay that way.
- **Keyboard**: mobile menu opens, traps focus, closes on `Escape`, returns focus
  to the trigger. Lightbox does the same. Everything interactive is reachable and
  operable without a mouse.
- **Touch targets** ≥44×44px (the engine uses 48px).
- **Motion**: `prefers-reduced-motion` respected everywhere.
- **Forms**: every input has a visible `<label>` (not just a placeholder), errors
  are text (not colour alone) and announced via `aria-live`.
- **Language**: `<html lang>` correct per locale, `hreflang` on alternates.

---

## 6. Performance budget

**Lighthouse ≥95 on all four categories, mobile preset.** Not a target — a gate.

> If a design choice conflicts with the budget, **redesign the implementation,
> not the ambition.** The answer to "this hero is too heavy" is a better hero,
> never a worse budget.

Practical rules that keep us there:

- LCP is almost always the hero image or hero heading. The hero image gets
  `loading="eager"` + `fetchpriority="high"`; everything below the fold is lazy.
- Explicit `width`/`height` or a locked `aspect-ratio` on **every** image. CLS
  target: **0**.
- Self-hosted fonts, `font-display: swap`, preload the display face used in the
  hero, and nothing else. Two families maximum, three only with a reason.
- No third-party embeds above the fold. Google Maps loads as a **static,
  click-to-activate** facade — a live iframe map costs ~1.5MB and half the
  performance score. See `core/GoogleMap.astro`.
- GSAP loads on `client:idle`. It is never render-blocking.
- Astro ships zero JS by default. Keep it that way except where an island earns it.

---

## 7. Definition of done

A project ships only when **all** of these are true:

1. `docs/qa-checklist.md` passes, every line.
2. Lighthouse **≥95** in all four categories, mobile preset, on the deployed URL
   (not localhost).
3. `npm run check:contrast` passes.
4. `npm run build` is clean — no warnings, no type errors.
5. **Checked on a real phone**, not just a devtools viewport. Thumb-reachability,
   tap targets, the sticky header, the mobile menu.
6. **Every form actually submitted** end-to-end, with the real endpoint, and the
   response confirmed in the destination inbox.
7. JSON-LD validates in Google's Rich Results Test with **zero errors**.
8. All `FPO` placeholders removed or explicitly accepted by the client.
9. `prefers-reduced-motion: reduce` checked with the OS setting on.
10. Keyboard-only pass: tab the entire page, open and close the menu and lightbox.
11. The differentiation log (§9) is updated **before** the invoice goes out.

---

## 8. Design differentiation rule

> **No two projects may share the same combination of hero variant + type pairing
> + colour story.**

This is a commercial rule, not an aesthetic one. Our whole pitch is "custom and
expensive." Two clients in the same town recognising each other's layout ends
that pitch permanently.

Before building, check the log below. If the combination is taken, change at
least one axis — and prefer changing two.

Every project must also modify **at least the palette and the type scale** from
its starting recipe. Recipes are starting points, not templates.

---

## 9. Differentiation log

Append a row on every project, **before invoicing**. Never edit a past row.

| # | Date | Project | Vertical | Recipe | Hero variant | Display / Body | Colour story | Signature moment | One-sentence idea | Notes |
|---|---|---|---|---|---|---|---|---|---|---|
| 001 | 2026-08-09 | _Demo: Rosalia's_ (engine reference build, not a client) | restaurant | Heritage Diner | HeroFullBleed (A) | Bitter / Karla | warm cream + deep red + brass | — (predates §4a) | — | Reference implementation. **This combination is spent — do not reuse for a paying client.** |
| 002 | 2026-08-09 | Setiba Medical Spa, Westlake Village CA (ambush concept) | medspa | Clinical Calm as the *starting point only* — palette, scale, radius, tracking and ground all replaced. Filed as **"The Measure"** | **HeroMeasure (G)** — new. Type + a full-bleed calibrated scale. **No photography anywhere on the page.** | Instrument Serif / Libre Franklin, + JetBrains Mono carrying every measurement | **Oak & Bone** — dark-first: oak-black ground, bone paper, cypress brand, clay accent. `:root` is the DARK context and a new `.on-light` holds the light one | The measure: a viewport-wide calibrated rule under the headline whose marker travels in from zero and settles at 29% — conspicuously short of "Overdone" | Setiba is the clinic in the Conejo Valley whose work you are not supposed to be able to spot, so the site is a measuring instrument that stops short | No photos, no verbatim reviews, no named providers or medical director supplied → ProviderBios, testimonials, TrustBar, FAQ and Gallery all deliberately **not shipped** (§11). Type scale 1.125→~1.50: nearly flat through reading sizes, then breaks away hard. Radius 0 throughout. |
| 003 | 2026-08-09 | Approved Contractor, Inc., Canoga Park CA (ambush concept) | contractor | Built Well as the *starting point only* — palette, ground, type pairing, scale, texture and signature all replaced; Field Service's trust architecture mixed in. Filed as **"The Elevation"** | **HeroElevation (H)** — new. A drawn architectural front elevation, six trades called out on leaders, dimensioned across the bottom. **No photography anywhere on the page.** | Archivo Variable **expanded to wdth 106** / Manrope, + JetBrains Mono carrying every dimension, licence and index number | **Plan Paper & Stamp** — light and COLD: plan-paper neutral, graphite ink, Valley slate brand (their own blue, desaturated to an eave shadow), plan-check red accent under 5% | The overall dimension: a hairline with 45° architect ticks spanning the whole facade, annotated **"THE PART EVERYONE ELSE SEES"**. The leaders extend to their callouts, then the drawing gets measured | Approved Contractor only builds the one part of a house its owner never looks at and every neighbour does — so the page is that part, drawn as an elevation, and their own name is the approval stamp on it | Zero photos and zero verbatim reviews supplied → BeforeAfter and TestimonialGrid wired but **not shipped** (§11); no owner named, no hours published, so `geo` is null and no `openingHoursSpecification` is emitted. Scale 1.235→1.355, **evenly stepped** — a scale rule is evenly divided. Display tracking near-neutral because the width axis carries it. Radius 0. Blueprint grid scoped to the hero only. |

| 004 | 2026-08-09 | Lifestyle Health Services (t/a Lifestyle Med Spa), Agoura Hills CA (ambush concept) | medspa | Clinical Calm was burned by 002 and is the *starting point in name only* — palette, ground, type pairing, scale, radius, controls, depth mechanism and signature all replaced. Filed as **"Plain Terms"** | **HeroSheet (I)** — new. Not a drawing: a single true-white sheet of paper lying on a toned page, holding the practice's standing terms. **No photography anywhere on the page.** | Fraunces Variable (imported from its **`opsz` subset**, so optical sizing is live and display type gains real stroke contrast purely from being large) / Public Sans. **NO MONO — deliberately** | **Manila, Ink & Signal** — light-first but on a genuinely MID-TONE toned canvas (manila) with true-white sheets ON it; ink-blue brand; one signal yellow at <5%, never a button. First build whose depth comes from **large soft shadows** rather than hairlines | **The zero ledger**: the cost of becoming a patient, itemised as a bill, and one pass of a highlighter sweeps across each of the four `$0.00` figures in turn | In a category built entirely on lock-in, this is the physician-led weight-loss practice you can walk away from at any point — so the page is a single visit rather than a funnel, and its centrepiece is a bill on which every line is zero | No photos, no verbatim reviews, no named provider, and LegitScript/HIPAA badges unverified → ProviderBios, testimonials, TrustBar, FAQ and Gallery all deliberately **not shipped** (§11); **no board certification claimed anywhere**. Scale is **shifted, not stretched**: body anchors at 17→19px on a modest 1.18→1.30, because this page is read by people over forty deciding about a prescription. `--measure` cut to 58ch as a consequence. Form collects name/phone/email/preferred-time and nothing else, with a PHI notice **inside** the `<form>` — Formspree has no BAA and this practice advertises HIPAA compliance. |

**Axes now spent** (check before the next build): warm-cream + red + brass (001); oak-black + bone + cypress + clay (002); cold plan-paper + graphite + slate + plan-check red (003); manila + ink-blue + signal yellow (004). Bitter/Karla (001); Instrument Serif/Libre Franklin (002); Archivo-expanded/Manrope (003); Fraunces/Public Sans (004). HeroFullBleed (001); HeroMeasure (002); HeroElevation (003); HeroSheet (004). 002 is still the only dark-ground build — the next dark-first project must move on palette **and** hero.

**Two studio-level tics to watch, both now overdue:**

1. **The technical-document register.** 002 (a measuring instrument) and 003 (a plan sheet) are different costumes on one idea: hairline rules, tick marks, mono annotation, radius 0. Two is coincidence, three is a signature, and a signature is the thing we sell against. 004 was built to break it on purpose — no mono at all, no ticks, no leaders, no callouts, shadow instead of rule, and its mark is a highlighter, which is a human gesture rather than a drafting one. **The next build does not get to reach for a mono and a hairline either.**
2. **Photography.** 004 is the THIRD consecutive photography-free page, and the warning written here after 003 did not prevent it because it was never in the build's gift: zero images were supplied at intake, again. This is a Phase 0 failure, not a design decision, and it is now a pattern. 004 at least answers it differently (paper as a physical object rather than a drawn diagram), but the next intake that arrives with no photographs should be pushed back to the operator before the build starts.

Patterns merged back into the engine:

| Date | Pattern | From | Now lives at |
|---|---|---|---|
| 2026-08-09 | **Rule ticks** — a calibrated hairline leader drawn as a repeating-linear-gradient. Zero requests, reflows to any width. Retunable per recipe. | 002 Setiba | `tokens.css` §8b (`--tick-*`), with `.on-dark` / `.on-brand` overrides |
| 2026-08-09 | **`ServiceIndex`** — a long capability list set as a ruled index instead of a card grid. Solves both the readability problem (43 items) and the honesty problem (a card needs a description; 43 invented descriptions in a regulated vertical is a §11 breach). | 002 Setiba | `sections/ServiceIndex.astro` + the `treatments` collection |
| 2026-08-09 | **Empty collections resolve to an empty loader** rather than warning. An empty `testimonials` is the honesty system working, not a defect, and the old behaviour pushed you toward deleting schemas or inventing content to silence it. | 002 Setiba | `content.config.ts` (`hasContent` / `empty`) |
| 2026-08-09 | **`check:recipes` measures against `.on-light`** when a project defines one. The gate was silently coupled to whatever the host project did with `:root`, so a dark-first build reported 14 false failures in the recipe book. | 002 Setiba | `scripts/check-recipes.mjs` |

Bug fixes found during 002 and merged back — **all four shipped wrong output on every project built before this date:**

| Date | Bug | Symptom | Fixed in |
|---|---|---|---|
| 2026-08-09 | `HoursTable` formatters rendered in the **build machine's** timezone | Every weekday label shifted back a day and every time was re-expressed locally. From Los Angeles, `10:00–18:00` rendered as **"2:00 AM – 10:00 AM"** against the wrong day. The reference build was wrong too. One wrong digit kills an ambush. | `core/HoursTable.astro` — both `Intl.DateTimeFormat`s pinned to `timeZone: "UTC"` |
| 2026-08-09 | `.hours__today-tag` styles never applied | Astro scoped CSS compiles to `[data-astro-cid-…]` selectors; the tag is built with `document.createElement` and never carries the attribute. The "Today" pill rendered as unstyled text jammed against the weekday. | `core/HoursTable.astro` — `:global(.hours__today-tag)` |
| 2026-08-09 | `LocationContact` address ran region and postcode together | `"Westlake Village, CA91362"` — Astro collapses the newline between two adjacent expressions. | `sections/LocationContact.astro` — explicit `{" "}` |
| 2026-08-09 | `ConceptBadge` covered the mobile sticky call bar | Under 30em the badge goes full-width at the bottom and has the higher z-index, so the disclosure notice sat directly on top of the primary CTA. | `core/ConceptBadge.astro` — lifted clear of the bar's reserved height |

Generalisation candidates from 002, **deliberately not merged yet:**

| Pattern | Why it is being held |
|---|---|
| `core/Wordmark.astro` | Every client wants a real logotype component, but this one's supporting mark (the tick rule with a marker at `--measure-rest`) is Setiba's identity, not a generic one. Merging it means designing the generic version first. |
| A `brand` slot on `SiteNav` | `SiteNav` still hardcodes `SITE.name` in a `<span>`, which is what forced a component edit in 002. A named slot with a text fallback is the right fix and is additive — but it is an API change to shared infrastructure and has been exercised on exactly one build. |
| `sections/Creed.astro`, `verticals/medspa/MembershipLadder.astro` | Both are good and both are one build old. Revisit after a second project wants them. |

Bugs found during 004 and **fixed in that project only** — every one of them is in shared
infrastructure and is therefore wrong on 001, 002 and 003 as well. **Merge these into the
engine before the next build:**

| Date | Bug | Symptom | Fixed in 004 at |
|---|---|---|---|
| 2026-08-09 | `SEOHead` links `/site.webmanifest` and `/apple-touch-icon.png`; the engine's `public/` contains neither | **Two 404s on every page load of every build**, logged as console errors. Costs 4 Lighthouse Best Practices points (96 → 100 once fixed) and the comment above the link tags — "generated into /public by the client scaffold" — describes a step `new-client.sh` does not actually perform. 003 papered over it locally without merging back; 001, 002 and the engine still ship it. | `public/site.webmanifest`, `public/apple-touch-icon.png` |
| 2026-08-09 | Four shared components fall below the engine's own ≥44px touch-target rule (§5) | Measured at 390px: `.site-header__brand` 39px, `.loc__call-number` 36px, `.loc__link` 20px, `.site-footer__link` 20–28px. The last is a stack of six links a thumb has to pick between, and `.loc__call-number` is the primary call CTA on the section people scroll to in order to tap it. Fixed with `inline-flex` + `min-height`, which grows the hit area without moving the type. | `core/SiteNav.astro`, `core/Footer.astro`, `sections/LocationContact.astro` |
| 2026-08-09 | `LocationContact` puts the map in the aside, stacked on the form | Only balances when the details column also carries an hours table. With `showHours={false}` the left column ran out after the email and left ~600px of dead canvas beside a very tall form. The map also simply belongs next to the address it depicts. | `sections/LocationContact.astro` — map moved into `.loc__details` |

Generalisation candidates from 004, **deliberately not merged yet:**

| Pattern | Why it is being held / why it is nearly ready |
|---|---|
| A `brand` slot on `SiteNav` **and** `Footer` | Now exercised on two builds, which is the §3 trigger. Both are additive named slots with the existing `SITE.name` text as the fallback, and the host sizes them by setting `--wordmark-size` on an ancestor — no prop, no `:global()`. **This one is ready; merge it.** |
| `notice` prop on `ContactForm` | A visible "do not send clinical details" line rendered *inside* the `<form>`. Every regulated vertical needs it — medspa, dental, vet, legal — and it has to live in the component rather than in the calling page, or a page author will eventually forget to render it. Ready, but it wants the default copy to come from `i18n/ui.ts` rather than the page. |
| `note` field on the `treatments` collection | Per-group fine print that is not a description of the items — here, the third-party trademark line. Any regulated capability list needs it. Additive and safe. |
| `sections/ZeroLedger.astro`, `sections/HeroSheet.astro`, `sections/ServiceSheets.astro` | All three are good and all three are one build old. `ZeroLedger` in particular is *specifically* Lifestyle's argument — generalising it means deciding what a "ledger" is for a business that does not sell on terms. |
| `--mark-*` tokens (the highlighter) | Cheap, useful and entirely token-driven, but it is this brand's supporting mark. Merging it makes the next build's designer reach for a highlighter, which is the exact failure mode described in "studio-level tics" above. **Hold.** |
| A local Lighthouse gate | §7 mandates Lighthouse ≥95 ×4 and no project can currently run it — the score is only obtainable after deploy. Running it on 004 took a transient `npm i -D lighthouse` (removed again afterwards). An engine devDependency plus `npm run lighthouse` against `npm run preview` would make the gate checkable before the site is public. Held only because it is a ~100MB dependency on every scaffolded project. |

---

## 10. Content collections

Defined in `src/content.config.ts`. Schemas are Zod — a missing required field is
a **build error**, which is exactly what we want before a client sees a page.

| Collection | Drives | Notes |
|---|---|---|
| `menu` | Menu/offerings sections | One entry per item: `category`, `name`, `description`, `price`, `order`, `tags`, `photo?`. All three menu variants read this collection — swapping layouts is a one-line change. |
| `services` | Auto/salon/studio offerings | Same shape, `price` optional, supports "from $X". |
| `events` | Events / private dining | `date`, `endDate?`, `recurring?`, `cta`. |
| `projects` | Galleries, portfolios, past events | Images + captions. |
| `testimonials` | Reviews sections | **Real Google review text only.** `author`, `rating`, `source`, `date`, `quote`. Never invent a review — see §11. |
| `pages` | Long-form inner-page prose | Rendered through `.prose`. |

Locale is a field on the entry (`lang: 'en' | 'es'`), not a separate collection.

Professional-services verticals lean on a different set:

| Collection | Drives | Notes |
|---|---|---|
| `services` | ServicesGrid, PracticeAreas, PackageTiers | `name`, `summary`, `detail?`, `price?`, `priceNote?` ("from", "per visit"), `icon?`, `order`. |
| `faq` | FAQ sections | `question`, `answer`, `order`, `lang`. Emits `FAQPage` JSON-LD automatically. |
| `people` | ProviderBios, AttorneyBio, AdvisorBio | `name`, `role`, `credentials[]`, `bio`, `photo`, `order`. Credentials render as a list, never as prose we invented. |
| `credentials` | TrustBar, CredentialsBar | `label`, `issuer?`, `logo?`. **Client-supplied only** — see §11. |
| `process` | ProcessSteps | `step`, `title`, `body`. "What happens when you call." |

### 10a. JSON-LD type per vertical

`SEOHead` picks the schema type from `SITE.vertical`. One page emits exactly one
primary business entity, plus `FAQPage` when a FAQ section is present.

| Vertical | `@type` |
|---|---|
| restaurant | `Restaurant` |
| bakery | `Bakery` |
| venue | `EventVenue` |
| auto (repair) | `AutoRepair` |
| auto (detailing) | `AutoWash` |
| salon | `HealthAndBeautyBusiness` |
| studio | `SportsActivityLocation` |
| homeservices | `HomeAndConstructionBusiness` (narrow to `Plumber` / `Electrician` / `HVACBusiness` / `RoofingContractor` when it fits) |
| contractor | `GeneralContractor` |
| medspa | `MedicalBusiness` |
| dental | `Dentist` |
| legal | `Attorney` |
| financial | `FinancialService` |
| vet | `VeterinaryCare` |

All of these inherit from `LocalBusiness`, so `address`, `geo`, `telephone`,
`openingHoursSpecification` and `priceRange` are always emitted from
`src/config/site.ts`. The page and the schema read the same source, so they
cannot disagree.

---

## 11. Honesty rules

These protect the business, and they are not negotiable.

- **Never invent a testimonial, a review, a rating, an award, or a statistic.**
  Reviews come from the client or from what the operator supplies. If we have
  none, the section does not ship.
- **Never fabricate a health-and-safety, certification, or licensing claim**
  ("ASE certified", "family owned since 1962") unless the operator supplied it.
- **Ambush demos always carry the concept badge** — "Concept redesign by [Studio],
  not affiliated with [Business]" — and it is never removed to make a demo look
  more real.
- **Do not scrape a target's site or photos.** The operator supplies every asset
  into `/input`. Placeholders are marked `FPO` and are visibly obvious.
- Copy written in a business's voice is a *proposal*, not a claim of authorship.
  It is replaced by the operator's own words the moment the client engages.

### Regulated verticals

Several of the professional-services verticals are advertising-regulated. We are
not their compliance counsel, and the rule that protects us is simple:

> **We never originate a regulated claim.** Every credential, result, figure and
> disclaimer is supplied by the client in writing, and it ships verbatim.

| Vertical | Never invent | Watch for |
|---|---|---|
| legal | Case results, settlement figures, win rates, "specialist"/"expert" | State bar advertising rules vary; most require a testimonial disclaimer, some require "Attorney Advertising" on the page |
| financial | Performance figures, returns, AUM, "guaranteed" | SEC Marketing Rule — testimonials are allowed but require specific disclosures; the client's ADV disclaimer goes in the footer |
| medspa | Before/after in the hero, "permanent", "FDA approved", provider titles | Several US states restrict aesthetic before/after advertising; medical direction and provider licensure must be stated accurately |
| dental | "Painless", "best", specialty titles | Specialty designations (orthodontist, endodontist) are legally restricted to those credentialed |
| vet | Emergency capability, 24/7 availability, species treated | Claiming after-hours care a practice does not provide is a genuine animal-welfare hazard, not just a marketing error |
| homeservices / contractor | License numbers, bonding, insurance, "certified" | License number must be the client's real one; many states require it displayed on advertising |

If a client has not supplied something a section needs, **the section does not
ship**. An empty credentials bar is fine; an invented one is not.

---

## 12. Commands

```bash
npm run dev              # dev server
npm run build            # production build to ./dist
npm run preview          # serve the built output locally
npm run check            # astro check — types and template errors
npm run check:contrast   # WCAG AA gate on the token palette
npm run verify           # check + check:contrast + build, in order
```

Scaffold a new client project from this engine:

```bash
./scripts/new-client.sh
```

---

## 13. Decisions log

Choices made in the absence of an explicit instruction. Append, don't rewrite.

| Date | Decision | Why |
|---|---|---|
| 2026-08-09 | Variants are **separate files**, not a `variant` prop | A prop-switched mega-component becomes unreadable at three variants and impossible at five. Separate files stay diffable and let a variant diverge structurally without risking the others. |
| 2026-08-09 | `--color-line` is exempt from 3:1 and documented as decorative | WCAG 1.4.11 applies to meaningful boundaries. Forcing every hairline to 3:1 makes the whole design read heavy and cheap. Meaningful borders use `--color-line-strong`, which is enforced. |
| 2026-08-09 | Google Maps ships as a **static click-to-activate facade** | A live embed costs ~1.5MB and roughly 15 Lighthouse points. Small-business users want the address and a directions link, not an interactive map. |
| 2026-08-09 | Reveal hidden-state is gated behind `.js-motion` on `<html>` | Hiding content in CSS and revealing with JS means a JS failure blanks the page. This inverts the failure mode: JS dying leaves everything visible. |
| 2026-08-09 | 13 Fontsource families pre-installed in the engine | Ambush mode targets under an hour. Choosing and installing fonts mid-build costs 10 minutes and breaks flow. Only imported families are bundled, so unused ones cost nothing at runtime. |
| 2026-08-09 | Contrast is enforced by a script that **parses `tokens.css`** | A hand-maintained list of ratios goes stale the first time someone reskins. Parsing the real file means the guarantee survives every future palette. |
| 2026-08-09 | Phone number is a **first-class CTA**, not a footer detail | Small businesses convert on calls. `tel:` links are in the header, the hero, the contact section and the mobile sticky bar. |
| 2026-08-09 | In `.on-brand`, cards **recede** (`surface` darker than `canvas`) | The first draft had `surface` *lighter* than its canvas, which silently cost every ink on a card 1–2 points of contrast and broke four recipes at once. Depth on a brand band comes from line and shadow. |
| 2026-08-09 | Recipe book is machine-verified (`check:recipes`, 982 checks) + hex-integrity guarded | A recipe that ships broken contrast is worse than no recipe: it looks authoritative. The guard also rejects malformed/homoglyph colour literals, which are invisible in a markdown table. |
| 2026-08-09 | Recipes 9–16 added for trades and professional services | These verticals sell on risk-reduction, not atmosphere, so they needed their own structural sections (`TrustBar`, `ProcessSteps`, `FAQ`, `ProviderBios`, `EmergencyBanner`, `PackageTiers`, `BeforeAfter`) rather than recolours of the hospitality recipes. |
| 2026-08-09 | `auto` split into `auto` (repair) and `autodetail` | Different schema type (`AutoRepair` vs `AutoWash`), different buyer, different recipe. Repair sells competence; detailing sells the finish. |
| 2026-08-09 | `inlineStylesheets: "always"` | Astro's `"auto"` left three render-blocking `<link>` tags for ~10KB of CSS. These visitors see one page on a phone, so the cross-page cache benefit never lands while the round-trips are paid every visit. Revisit above ~20KB gz of CSS. |
| 2026-08-09 | Hero settle moved from GSAP to a CSS keyframe | Above-the-fold content was being hidden by JS and only revealed on the first `requestAnimationFrame`. In a throttled or backgrounded tab that stranded it at `opacity: 0` — the exact failure the `.js-motion` fail-safe exists to prevent. CSS animations start at paint and cost no main-thread work. |
| 2026-08-09 | `Section` takes an explicit `labelledBy` instead of inferring `${id}-heading` | Inference produced a dangling `aria-labelledby` on every section whose heading is optional (pull-quote, untitled gallery), leaving the landmark unnamed while looking correct in the markup. |
| 2026-08-09 | Gallery layouts are a `layout` prop, not three files | The separate-files rule governs *sections* whose structure diverges. All three gallery layouts share identical markup, props and lightbox wiring and differ only in grid CSS — three files would be three places to fix one bug. |
| 2026-08-09 | Every `Intl.DateTimeFormat` that formats a `Date.UTC` reference date **must** pass `timeZone: "UTC"` | These components run at BUILD time, so "the host timezone" is whichever machine ran the build — the same source produces different hours in Los Angeles and London. Deterministic output is not a nicety on a page whose whole job is telling someone when to turn up. |
| 2026-08-09 | Anything a component's client script **creates** must be styled with `:global()` | Astro's scoped CSS stamps `[data-astro-cid-…]` onto elements it rendered. A node from `document.createElement` never gets it, so the rule silently does nothing and the failure looks like a CSS typo rather than a scoping rule. |
| 2026-08-09 | An empty content collection is a **normal state**, not a warning | Most collections start empty and several stay empty for good — a med spa with no supplied reviews must not ship a reviews section. The glob loader's warning made a warning-clean build (§7) conflict with the honesty rules (§11), which pushes toward deleting schemas or inventing content. |
| 2026-08-09 | `check:recipes` reads the **light** semantic mapping, preferring `.on-light` | The recipe book's palettes are all authored paper-at-000. The gate was reading whatever the host project put in `:root`, so the first dark-first build reported 14 failures in a recipe book that was fine. A doc-gate must not be coupled to the project it happens to be running inside. |
| 2026-08-09 | A dark-first project inverts `:root` and adds `.on-light`, rather than wrapping every section in `.on-dark` | The header, footer and body background all read `--color-canvas` from `:root`. Leaving `:root` light and marking sections dark leaves a light header stranded above a dark page, and "fix it in the component" is exactly what §2 forbids. Any new context block must be added to `scripts/check-contrast.mjs` in the same commit — a context outside the matrix is an unfound contrast bug. |
| 2026-08-09 | A hero headline at `--step-7` does **not** take `[data-split]` | `HeroLayered` splits its headline, and at that size the paint → hide → slide sequence is plainly visible on a slow connection. §4 is explicit that the hero's largest text must be visible at first paint, and the LCP element is the one place the signature toolkit does not get an exception. Build the moment out of something that is not the LCP element. |
| 2026-08-09 | `check:recipes` is an **engine** gate and comes out of a reskinned project's `verify` | It measures the recipe book against the host project's context blocks, and every project is required to rewrite those. It stays in the engine, where the recipe book lives and where it still passes 982/982. Removing a gate is recorded here rather than done quietly. |
