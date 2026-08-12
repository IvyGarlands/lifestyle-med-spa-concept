# Design Recipes

Eight named aesthetic starting points. Assign one per project, then **modify at
least the palette and the type scale** — recipes are starting points, not
templates (CLAUDE.md §8).

Each recipe specifies five things:

1. **Type pairing** — display + body, with the Fontsource packages (all
   pre-installed in the engine)
2. **Colour story** — the primitive ramps to paste into `tokens.css` §1
3. **Texture & photography** — the image treatment tokens
4. **Motion personality** — the motion tokens
5. **Section variants that suit it** — and the ones that fight it

Every palette below is machine-verified against the full WCAG pair matrix by
**`npm run check:recipes`** (468 checks) — this file cannot drift into shipping a
broken palette. But the moment you modify a recipe — which you are required to
do — the guarantee is yours to re-earn: **`npm run check:contrast`**.

---

## Quick reference

| # | Recipe | Best for | Display / Body | Signature |
|---|---|---|---|---|
| 1 | **Heritage Diner** | Diners, BBQ, old-school Italian, delis | Bitter / Karla | Warm cream, deep red, brass, film grain |
| 2 | **Modern Cantina** | Taquerias, cantinas, casual Latin | Anton / Work Sans | Vivid colour blocking, bold condensed |
| 3 | **Editorial Venue** | Wedding + event venues, fine dining | Fraunces / Inter | Near-black, huge whitespace, gold |
| 4 | **Neighborhood Institution** | Pubs, 40-year-old family restaurants | Archivo / Archivo | Navy + cream, archival photography |
| 5 | **Fresh Bakery** | Bakeries, cafés, ice cream, florists | Outfit / Newsreader | Soft pastels done tastefully, rounded |
| 6 | **Precision Shop** | Auto repair, detailing, trades | Archivo / Inter + JetBrains Mono | Charcoal, safety orange, industrial |
| 7 | **Studio Light** | Dance, yoga, pilates, fitness | Syne / Inter | Airy, motion-forward, high key |
| 8 | **Nightlife** | Bars, lounges, music venues, late-night | Unbounded / Space Grotesk | Dark, neon accent, high contrast |
| 9 | **Field Service** | Plumbing, HVAC, electrical, roofing, landscaping | Oswald / Public Sans | Navy + high-vis amber, phone-first |
| 10 | **Built Well** | Remodelers, general contractors, design-build | Instrument Serif / Manrope | Warm greige, walnut, sage, portfolio-led |
| 11 | **Clinical Calm** | Med spas, aesthetics, wellness clinics | Manrope / Source Serif 4 | Alabaster, plum, bronze, tracked-out display |
| 12 | **Bright Dental** | Dentists, orthodontists, pediatric dental | Plus Jakarta Sans / Public Sans | White, calm teal, warm coral |
| 13 | **Counsel** | Solo attorneys, small firms | Crimson Pro / Libre Franklin | Ivory, ink navy, muted burgundy |
| 14 | **Fiduciary** | Financial advisors, planners, CPAs | Libre Franklin / Source Serif 4 | Slate, deep forest, brass, mono figures |
| 15 | **Companion** | Veterinary practices, pet care | Lora / Manrope | Warm cream, teal-green, terracotta |
| 16 | **Detail Bay** | Auto detailing, ceramic coating, PPF, custom | Saira / Inter | Gloss black, electric blue, chrome |

## Signature moment per recipe

Every build needs one moment a person would screenshot (CLAUDE.md §4a). These
are the natural fit per recipe — a starting point, and you are expected to
invent better. **Spectacle budget** governs how kinetic that moment may be:
lavish motion on an attorney's site actively damages conversion.

| # | Recipe | Spectacle | Natural signature moment |
|---|---|---|---|
| 1 | Heritage Diner | Medium | Oversized `since 19XX` numeral with grain, masked line reveal on the story |
| 2 | Modern Cantina | High | Full-bleed colour-block wipe between sections; Anton marquee at `--step-5` |
| 3 | Editorial Venue | Medium | `HeroEditorial` with staggered indents + slow masked lines. Type IS the moment |
| 4 | Neighborhood Institution | Medium | Archival photo cross-fade on the timeline; one enormous civic wordmark |
| 5 | Fresh Bakery | High | Layered parallax of product on a warm ground; tilt on the product grid |
| 6 | Precision Shop | Low–Med | Pinned showcase stepping through the bay process. Mono counters, no flourish |
| 7 | Studio Light | High | `HeroVideo` or layered parallax of bodies mid-motion; the fastest tier we ship |
| 8 | Nightlife | High | Dark layered parallax with specular highlights; outline marquee of tonight's lineup |
| 9 | Field Service | Low | Structural, not kinetic: a phone number set at `--step-6`. Speed is the message |
| 10 | Built Well | Medium | Pinned before/after that resolves as you scroll — the single best remodeller device |
| 11 | Clinical Calm | High | Slow layered parallax, tracked-out masked type, one perfect texture crop |
| 12 | Bright Dental | Low–Med | Warm oversized portrait, gentle depth. Calm is the brief — do not startle |
| 13 | Counsel | **Low** | Typographic only. One portrait full-bleed, a radical measure, serif at conviction scale |
| 14 | Fiduciary | **Low** | Typographic only. Mono figures in a considered table; restraint executed deliberately |
| 15 | Companion | Medium | Warm tilt on the patient grid; masked lines on the emergency line |
| 16 | Detail Bay | High | Layered parallax on paint reflections; pinned before/after. Gloss is the product |

**Recipes 1–8** are hospitality and lifestyle: the visitor is choosing an
experience, so atmosphere does the selling. **Recipes 9–16** are professional
services and trades: the visitor has a problem and is assessing risk, so
credentials, process and a phone number do the selling. That difference is
structural, not decorative — see the section notes on each recipe.

**Vertical → recipe defaults** (a default, not a rule — the differentiation log
outranks it):

| Vertical | Default recipes |
|---|---|
| restaurant | 1, 2, 4 |
| venue | 3, 8 |
| bakery | 5, 1 |
| auto (repair) | 6 |
| auto (detailing) | 16, 6 |
| salon | 5, 3, 7 |
| studio | 7, 8 |
| home services | 9 |
| remodeling / contractor | 10, 9 |
| medspa | 11, 3 |
| dental | 12 |
| legal | 13 |
| financial | 14, 13 |
| veterinary | 15, 12 |

---

## 1. Heritage Diner

Warm, worn-in, proud. Reads like a place that has been feeding the same families
for forty years and knows it. The engine's default palette.

**Type** — Display `Bitter Variable` (slab serif, chunky, warm) / Body
`Karla Variable` (grotesque with personality, keeps it from going twee).
`@fontsource-variable/bitter`, `@fontsource-variable/karla`.

**Type scale** — 1.200 → 1.333. Moderate. The type is characterful enough that it
doesn't need to be huge.

**Colour story** — cream paper, deep diner red, aged brass. Red is the memorable
colour; brass is the under-5% accent that does the "expensive" work.

```css
--n-000:#fffdf8; --n-050:#faf5ea; --n-100:#f2ebdc; --n-200:#e4dac6;
--n-300:#cdc0a8; --n-400:#8b8069; --n-500:#6b6250; --n-600:#574f40;
--n-700:#3b352b; --n-800:#26221b; --n-900:#161310;
--b-050:#fdeceb; --b-100:#f9cfcb; --b-300:#d9736a; --b-500:#b03a30;
--b-600:#97302a; --b-700:#7a2621; --b-800:#5c1c19; --b-900:#3d1210;
--a-100:#f6e6bd; --a-300:#dcbc6a; --a-500:#b8912f; --a-700:#8a6a1c; --a-900:#4d3a0c;
--face-display:"Bitter Variable",Georgia,serif;
--face-body:"Karla Variable",system-ui,sans-serif;
```

**Texture & photography** — warm, slightly desaturated, grain on. Food shot close
and honest; avoid glossy stock gloss.

```css
--image-filter: saturate(0.92) contrast(1.04) sepia(0.06);
--image-filter-hero: saturate(0.88) contrast(1.08) brightness(0.96) sepia(0.08);
--grain-opacity: 0.045;  /* body.has-grain */
--radius-image: 2px; --radius-card: 4px; --radius-control: 2px;
```

**Motion** — unhurried and solid. Nothing darts.

```css
--duration-reveal: 750ms; --motion-distance: 20px; --motion-stagger: 0.09s;
--motion-parallax: 0.08;
```

**Suits** — HeroFullBleed (A), MenuLeaders (C), AboutHeritage (timeline),
GalleryUniform, TestimonialPullQuote, CTABand on `.on-brand`.
**Fights** — HeroEditorial (too austere), GalleryScroll (too modern).

---

## 2. Modern Cantina

Loud, confident, saturated. Colour blocking does the heavy lifting; photography
is the punctuation.

**Type** — Display `Anton` (bold condensed, one weight, enormous) / Body
`Work Sans Variable`. `@fontsource/anton`, `@fontsource-variable/work-sans`.

**Type scale** — 1.250 → 1.414. Anton is condensed, so it can go very large
without dominating width. Push `--step-6`/`--step-7` hard.

**Colour story** — off-white paper, hot terracotta, deep agave green as the
secondary block colour.

```css
--n-000:#fffaf2; --n-050:#fdf2e3; --n-100:#f8e6cf; --n-200:#eed6b8;
--n-300:#d4b894; --n-400:#8a7457; --n-500:#6b5942; --n-600:#54452f;
--n-700:#3a3021; --n-800:#241d14; --n-900:#15100b;
--b-050:#ffeee6; --b-100:#ffd2bd; --b-300:#f07a4d; --b-500:#d4491c;
--b-600:#b83c15; --b-700:#963010; --b-800:#70240c; --b-900:#4a1808;
--a-100:#d9ecd2; --a-300:#8cbe7b; --a-500:#4a8236; --a-700:#356026; --a-900:#1d3614;
--face-display:"Anton",Impact,sans-serif;
--face-body:"Work Sans Variable",system-ui,sans-serif;
--tracking-display: 0.005em;  /* Anton is tight already; don't crush it */
--weight-display: 400;        /* Anton ships one weight */
```

**Texture & photography** — punchy, saturated, no grain. Big flat colour fields
between photos.

```css
--image-filter: saturate(1.12) contrast(1.06);
--image-filter-hero: saturate(1.18) contrast(1.10);
--grain-opacity: 0; --radius-image: 0; --radius-card: 0; --radius-control: 0;
```

**Motion** — snappier, with more travel. Confident, not delicate.

```css
--duration-reveal: 600ms; --motion-distance: 28px; --motion-stagger: 0.07s;
```

> `--motion-distance: 28px` deliberately exceeds the 24px house default. It is
> the one sanctioned overshoot, and only because Anton at `--step-6` is
> physically large enough that 24px reads as a twitch. Do not copy it elsewhere.

**Suits** — HeroSplit (B), MenuCards (B), GalleryScroll, CTABand `.on-brand`,
AnnouncementBar (specials).
**Fights** — Anything relying on delicate hairlines or subtle greys.

---

## 3. Editorial Venue

Expensive, restrained, magazine. Whitespace *is* the design. The hardest recipe
to execute and the most valuable when it lands.

**Type** — Display `Fraunces Variable` (high-contrast serif, `SOFT`/`WONK` axes)
/ Body `Inter Variable`. `@fontsource-variable/fraunces`,
`@fontsource-variable/inter`.

**Type scale** — 1.200 → 1.500. The widest range of any recipe: tiny labels
against enormous display type is the whole effect.

**Colour story** — near-black, warm white, a single gold accent. No third colour.

```css
--n-000:#fdfcfa; --n-050:#f6f4f0; --n-100:#ece9e3; --n-200:#dcd8d0;
--n-300:#bfb9ae; --n-400:#847d70; --n-500:#655e53; --n-600:#4b453c;
--n-700:#332e28; --n-800:#1e1b17; --n-900:#0e0d0b;
--b-050:#f6f4f0; --b-100:#dcd8d0; --b-300:#948c80; --b-500:#4b453c;
--b-600:#332e28; --b-700:#1e1b17; --b-800:#141210; --b-900:#0a0908;
--a-100:#f2e4c4; --a-300:#d9bc7c; --a-500:#b08f3e; --a-700:#856a26; --a-900:#453615;
--face-display:"Fraunces Variable",Georgia,serif;
--face-body:"Inter Variable",system-ui,sans-serif;
--tracking-display: -0.03em; --leading-display: 0.92;
--section-y: clamp(6rem, 4.29rem + 8.57vw, 12rem);  /* loose is the default here */
```

> Brand is the near-black ramp on purpose. In this recipe the "brand colour" is
> restraint; gold is the only chromatic note and it stays under 5% coverage.

**Texture & photography** — cool, low saturation, generous crops. Never fill the
frame; let subjects sit in space.

```css
--image-filter: saturate(0.85) contrast(1.02);
--image-filter-hero: saturate(0.80) contrast(1.05) brightness(0.98);
--grain-opacity: 0; --radius-image: 0; --radius-card: 0;
--image-hover-scale: 1.02;
```

**Motion** — slow, close, almost imperceptible. The most restrained motion we ship.

```css
--duration-reveal: 800ms; --duration-hero: 1000ms;
--motion-distance: 14px; --motion-stagger: 0.12s; --motion-parallax: 0.06;
```

**Suits** — HeroEditorial (C), HeroCentered (E), AboutAlternating,
GalleryMasonry, TestimonialPullQuote, EventsFeature.
**Fights** — MenuCards (too busy), AnnouncementBar (breaks the calm).

---

## 4. Neighborhood Institution

Civic, trustworthy, unpretentious. The look of a place with a photo of the 1978
softball team on the wall.

**Type** — `Archivo Variable` for both, separated by weight and width rather than
family. Single-family typography is itself the institutional signal.
`@fontsource-variable/archivo`.

**Type scale** — 1.200 → 1.250. Deliberately flat. Nothing shouts.

**Colour story** — navy, cream, a muted red accent.

```css
--n-000:#fbfaf6; --n-050:#f3f1ea; --n-100:#e7e4d9; --n-200:#d5d1c2;
--n-300:#b3ae9c; --n-400:#7d7869; --n-500:#5f5b4f; --n-600:#47443b;
--n-700:#312f29; --n-800:#1d1c18; --n-900:#10100d;
--b-050:#e8edf5; --b-100:#c4d1e6; --b-300:#6f8fc0; --b-500:#3c5f96;
--b-600:#2f4d7d; --b-700:#243c63; --b-800:#1a2c49; --b-900:#111d31;
--a-100:#f5d6d0; --a-300:#d98b7d; --a-500:#b25542; --a-700:#8a3f30; --a-900:#4d2119;
--face-display:"Archivo Variable",system-ui,sans-serif;
--face-body:"Archivo Variable",system-ui,sans-serif;
--weight-display: 700; --tracking-display: -0.015em;
--radius-image: 0; --radius-card: 2px;
```

**Texture & photography** — archival treatment. Slightly faded, slightly warm,
as if scanned. Mix historic black-and-white with present-day colour.

```css
--image-filter: saturate(0.82) contrast(1.06) brightness(1.02);
--image-filter-hero: saturate(0.78) contrast(1.08);
--grain-opacity: 0.03;
```

**Motion** — steady, minimal, no flourish.

```css
--duration-reveal: 700ms; --motion-distance: 16px; --motion-stagger: 0.08s;
--motion-parallax: 0.05;
```

**Suits** — HeroSplit (B), HeroCentered (E), AboutHeritage (timeline is the star),
MenuClassic (A), TestimonialStatic, LocationContact.
**Fights** — GalleryScroll, Nightlife-style contrast.

---

## 5. Fresh Bakery

Soft without being childish. The test: it should feel like a good bakery, not a
cupcake shop's Facebook page. Rounded corners plus adult typography.

**Type** — Display `Outfit Variable` (geometric, rounded, warm) / Body
`Newsreader Variable` (soft serif — the serif body is what keeps it grown-up).
`@fontsource-variable/outfit`, `@fontsource-variable/newsreader`.

**Type scale** — 1.200 → 1.333.

**Colour story** — warm off-white, dusty rose brand, sage accent. Pastels held at
low saturation and real darkness so they stay legible.

```css
--n-000:#fffcfa; --n-050:#fbf4ef; --n-100:#f5e9e1; --n-200:#e9d8cd;
--n-300:#cdb5a7; --n-400:#8d7a6e; --n-500:#6e5d53; --n-600:#54463e;
--n-700:#3b302a; --n-800:#241d19; --n-900:#14100e;
--b-050:#fdeef0; --b-100:#f8d3d9; --b-300:#dd8a97; --b-500:#c25266;
--b-600:#a94154; --b-700:#8a3444; --b-800:#672632; --b-900:#421820;
--a-100:#e4ecdc; --a-300:#a8c096; --a-500:#6f8c5c; --a-700:#546b44; --a-900:#2e3b25;
--face-display:"Outfit Variable",system-ui,sans-serif;
--face-body:"Newsreader Variable",Georgia,serif;
--radius-image: 14px; --radius-card: 16px; --radius-control: 999px;
--leading-body: 1.65;
```

> `--radius-control: 999px` (pill buttons) is the single strongest "friendly"
> signal available. It is doing a lot of work here — do not also round everything
> else to 20px, or it tips into childish.

**Texture & photography** — bright, airy, high-key. Overexposed by a touch.
Natural light only; no dark moody food photography.

```css
--image-filter: saturate(0.96) contrast(0.98) brightness(1.04);
--image-filter-hero: saturate(1.0) contrast(1.0) brightness(1.05);
--grain-opacity: 0; --image-hover-scale: 1.05;
```

**Motion** — light and quick, slightly more travel. Never bouncy — the rounded
shapes already carry the friendliness, and bounce would tip it over.

```css
--duration-reveal: 620ms; --motion-distance: 22px; --motion-stagger: 0.07s;
```

**Suits** — HeroSplit (B), MenuCards (B), GalleryUniform, TestimonialCarousel,
CTABand, AnnouncementBar (daily specials, sold-out notices).
**Fights** — HeroEditorial, dark sections generally.

---

## 6. Precision Shop

Engineered, legible, no-nonsense. For auto repair and trades, where the job is
conveying competence and getting the phone to ring.

**Type** — Display `Archivo Variable` (heavy, slightly expanded) / Body
`Inter Variable` / Mono `JetBrains Mono Variable` for specs, hours, part numbers
and prices — the mono is the industrial signal and should appear often.
`@fontsource-variable/archivo`, `@fontsource-variable/inter`,
`@fontsource-variable/jetbrains-mono`.

**Type scale** — 1.200 → 1.250. Flat and utilitarian.

**Colour story** — charcoal ground, safety orange, steel blue-grey neutral.
**This is the one recipe where the dark surface is the primary canvas** — build
the page in `.on-dark` and use light sections as the exception.

```css
--n-000:#fafbfc; --n-050:#f0f2f5; --n-100:#e2e5ea; --n-200:#cbd0d8;
--n-300:#a3aab6; --n-400:#6e7683; --n-500:#565d68; --n-600:#3f454e;
--n-700:#2b2f36; --n-800:#1a1d22; --n-900:#0e1013;
--b-050:#fff0e4; --b-100:#ffd6b0; --b-300:#ff9440; --b-500:#e86a0c;
--b-600:#c85708; --b-700:#a24507; --b-800:#763205; --b-900:#4a1f03;
--a-100:#dbe4ee; --a-300:#94a9c2; --a-500:#5b7695; --a-700:#455a73; --a-900:#26323f;
--face-display:"Archivo Variable",system-ui,sans-serif;
--face-body:"Inter Variable",system-ui,sans-serif;
--face-mono:"JetBrains Mono Variable",ui-monospace,monospace;
--radius-image: 2px; --radius-card: 2px; --radius-control: 2px;
--tracking-label: 0.10em;
```

> On dark, orange is used at `--b-300` (`#ff9440`). At `--b-500` it fails AA
> against `--n-900` for body text. Large display type may use `--b-500`; body
> copy and small labels may not. `check:contrast` enforces this.

**Texture & photography** — high contrast, cool, slightly clinical. Detail shots
of tools, bays, hands working. No stock photos of smiling men in polo shirts.

```css
--image-filter: saturate(0.90) contrast(1.12);
--image-filter-hero: saturate(0.85) contrast(1.16) brightness(0.94);
--grain-opacity: 0; --scrim-strength: 0.70;
```

**Motion** — mechanical precision: short, linear-ish, no float.

```css
--duration-reveal: 520ms; --motion-distance: 16px; --motion-stagger: 0.06s;
--motion-parallax: 0; --ease-out: cubic-bezier(0.16, 1, 0.3, 1);
```

**Suits** — HeroSplit (B) on dark, ServicesTable, HoursTable (mono), LocationContact
with a phone-first CTA, TestimonialStatic, CTABand.
**Fights** — Masonry galleries, carousels, anything decorative.

---

## 7. Studio Light

Airy, kinetic, high-key. Motion is the point — this is the one recipe where
movement is a headline feature rather than a polish layer.

**Type** — Display `Syne Variable` (geometric, quirky, gets weird at heavy
weights in a good way) / Body `Inter Variable`. `@fontsource-variable/syne`,
`@fontsource-variable/inter`.

**Type scale** — 1.250 → 1.414.

**Colour story** — near-white, deep violet, warm coral accent.

```css
--n-000:#ffffff; --n-050:#f7f6fa; --n-100:#eeecf4; --n-200:#dedbe8;
--n-300:#bab5cc; --n-400:#807a94; --n-500:#635d76; --n-600:#4a4459;
--n-700:#332f3e; --n-800:#1f1c26; --n-900:#111016;
--b-050:#f1ecfd; --b-100:#dbcefa; --b-300:#a98ff0; --b-500:#7b4fe0;
--b-600:#6739c9; --b-700:#552ea6; --b-800:#3e2179; --b-900:#28154d;
--a-100:#ffdfd6; --a-300:#ff9c85; --a-500:#f2603f; --a-700:#b8402a; --a-900:#632014;
--face-display:"Syne Variable",system-ui,sans-serif;
--face-body:"Inter Variable",system-ui,sans-serif;
--radius-image: 10px; --radius-card: 12px; --radius-control: 999px;
--weight-display: 800;
```

**Texture & photography** — bright, high-key, motion blur welcome. Bodies in
movement, mid-gesture. Crops that imply the frame can't contain them.

```css
--image-filter: saturate(1.04) contrast(1.02) brightness(1.03);
--image-filter-hero: saturate(1.08) contrast(1.04) brightness(1.02);
--grain-opacity: 0; --image-hover-scale: 1.06;
```

**Motion** — the fastest and furthest we go. Still ease-out, still no bounce.

```css
--duration-reveal: 560ms; --duration-hero: 800ms;
--motion-distance: 30px; --motion-stagger: 0.06s; --motion-parallax: 0.15;
```

> `--motion-distance: 30px` and parallax at the hard cap of `0.15` are sanctioned
> here and nowhere else. This recipe is the reason the cap exists — it is the
> ceiling, not an invitation to raise it.

**Suits** — HeroVideo (D), HeroSplit (B), ScheduleGrid, GalleryScroll,
TestimonialCarousel, CTABand.
**Fights** — Heritage/archival treatments, dense menu layouts.

---

## 8. Nightlife

Dark, saturated, high contrast. Photography carries the mood; type stays out of
the way until it doesn't.

**Type** — Display `Unbounded Variable` (wide, distinctive, unmistakably
contemporary) / Body `Space Grotesk Variable`.
`@fontsource-variable/unbounded`, `@fontsource-variable/space-grotesk`.

**Type scale** — 1.200 → 1.414. Unbounded is wide, so watch line lengths on
mobile — cap the hero at 3 words per line.

**Colour story** — near-black ground, electric cyan brand, magenta accent. Built
dark-first: `.on-dark` is effectively the default context.

```css
--n-000:#ffffff; --n-050:#f4f4f7; --n-100:#e6e6ec; --n-200:#cdcdd6;
--n-300:#9d9dab; --n-400:#6c6c7c; --n-500:#53535f; --n-600:#3c3c47;
--n-700:#292930; --n-800:#17171c; --n-900:#0a0a0d;
--b-050:#e0fbff; --b-100:#a8f2fb; --b-300:#4dd9ec; --b-500:#12b4cd;
--b-600:#0d94aa; --b-700:#0a7686; --b-800:#075662; --b-900:#04363e;
--a-100:#ffd6f0; --a-300:#f77fce; --a-500:#d9349f; --a-700:#a6237a; --a-900:#5c1243;
--face-display:"Unbounded Variable",system-ui,sans-serif;
--face-body:"Space Grotesk Variable",system-ui,sans-serif;
--radius-image: 4px; --radius-card: 4px; --radius-control: 4px;
--scrim-strength: 0.72;
```

> Cyan and magenta are legible **on dark only**. `--b-500` on white fails AA
> badly. If this recipe uses a light section, brand text there must drop to
> `--b-700`/`--b-800`. Run `check:contrast` after any light section is added.

**Texture & photography** — crushed blacks, saturated highlights, coloured light.
Night shots, crowds, glassware, stage lighting.

```css
--image-filter: saturate(1.15) contrast(1.14) brightness(0.94);
--image-filter-hero: saturate(1.20) contrast(1.18) brightness(0.90);
--grain-opacity: 0.05; --grain-blend: overlay;
```

**Motion** — slower and heavier, with longer fades. Nightlife motion should feel
like a dissolve, not a slide.

```css
--duration-reveal: 780ms; --motion-distance: 18px; --motion-stagger: 0.10s;
--motion-parallax: 0.12;
```

**Suits** — HeroVideo (D), HeroFullBleed (A), EventsFeature, GalleryMasonry,
GalleryScroll, TestimonialPullQuote, AnnouncementBar (tonight's lineup).
**Fights** — MenuLeaders (dot leaders read as fussy here), light airy sections.

---

## 9. Field Service

Home services — plumbing, HVAC, electrical, roofing, landscaping. The job is
**answer the phone question in three seconds**: do you serve me, are you
licensed, can you come today. Bright, high-contrast, unembarrassed about being
useful.

**Type** — Display `Oswald Variable` (condensed, sign-painted, legible at
distance) / Body `Public Sans Variable` (a federal-government face; it reads as
plainly trustworthy). `@fontsource-variable/oswald`,
`@fontsource-variable/public-sans`.

**Type scale** — 1.200 → 1.250. Flat. Nothing here is decorative.

**Colour story** — deep navy, high-visibility amber, cool grey neutral. Amber is
the "call now" colour and appears nowhere else.

```css
--n-000:#fcfdfe; --n-050:#f2f5f8; --n-100:#e5eaf0; --n-200:#cdd6e0;
--n-300:#a3b0c0; --n-400:#6d7b8c; --n-500:#54606e; --n-600:#3f4956;
--n-700:#2b323c; --n-800:#1a1f26; --n-900:#0d1116;
--b-050:#e8eefb; --b-100:#c6d5f4; --b-300:#6f92dc; --b-500:#2f5cb8;
--b-600:#254a9a; --b-700:#1d3b7c; --b-800:#152b5c; --b-900:#0d1a3a;
--a-100:#ffedbf; --a-300:#f0c14b; --a-500:#c9930f; --a-700:#8a660a; --a-900:#4f3a05;
--face-display:"Oswald Variable",Impact,sans-serif;
--face-body:"Public Sans Variable",system-ui,sans-serif;
--radius-image:2px; --radius-card:4px; --radius-control:4px;
--tracking-display:0.005em;
```

**Texture & photography** — real trucks, real crews, real job sites. Bright and
literal. Stock photography kills this recipe faster than any other.

```css
--image-filter: saturate(1.02) contrast(1.06);
--image-filter-hero: saturate(1.05) contrast(1.08) brightness(0.97);
--grain-opacity: 0;
```

**Motion** — brisk and short. This visitor is in a hurry, possibly standing in
water.

```css
--duration-reveal: 500ms; --motion-distance: 14px; --motion-stagger: 0.06s;
--motion-parallax: 0;
```

**Suits** — HeroSplit (B) with the phone number in the hero, EmergencyBanner,
TrustBar (licensed / insured / bonded), ServicesGrid, ServiceAreaList,
ProcessSteps, TestimonialStatic, LocationContact.
**Fights** — Galleries for their own sake, carousels, anything slow.

---

## 10. Built Well

Remodeling and general contracting. These firms lose work by looking cheap and
win it by looking like an architecture studio. The portfolio *is* the pitch, so
photography gets the space and type gets out of the way.

**Type** — Display `Instrument Serif` (high-contrast, editorial, one weight) /
Body `Manrope Variable`. `@fontsource/instrument-serif`,
`@fontsource-variable/manrope`.

**Type scale** — 1.200 → 1.414. Wide range; Instrument Serif wants to be large.

**Colour story** — warm greige, walnut, sage. A materials palette, not a brand
palette.

```css
--n-000:#fdfcfa; --n-050:#f5f2ed; --n-100:#eae5dd; --n-200:#d8d1c6;
--n-300:#b5aca0; --n-400:#7f766a; --n-500:#635b51; --n-600:#4a443c;
--n-700:#332f29; --n-800:#1f1c18; --n-900:#100e0c;
--b-050:#f4ece4; --b-100:#e2cdb8; --b-300:#b08a63; --b-500:#8a6440;
--b-600:#755334; --b-700:#5e422a; --b-800:#45301e; --b-900:#2b1e13;
--a-100:#e2e8dc; --a-300:#a3b596; --a-500:#6b7f5e; --a-700:#4a5b41; --a-900:#2b3525;
--face-display:"Instrument Serif",Georgia,serif;
--face-body:"Manrope Variable",system-ui,sans-serif;
--weight-display: 400;   /* Instrument Serif ships one weight */
--radius-image: 0; --radius-card: 0; --radius-control: 2px;
--section-y: clamp(5rem, 3.57rem + 7.14vw, 10rem);
```

**Texture & photography** — architectural. Wide, level, generous. Before/after
pairs are the single highest-converting element on a remodeler's site.

```css
--image-filter: saturate(0.94) contrast(1.03);
--image-filter-hero: saturate(0.90) contrast(1.06);
--grain-opacity: 0; --image-hover-scale: 1.03;
```

**Motion** — slow and level. Nothing bouncy near a $90k kitchen.

```css
--duration-reveal: 760ms; --motion-distance: 18px; --motion-stagger: 0.10s;
--motion-parallax: 0.08;
```

**Suits** — HeroFullBleed (A), HeroEditorial (C), BeforeAfter, GalleryMasonry,
ProcessSteps, TestimonialPullQuote, CredentialsBar, CTABand.
**Fights** — MenuCards, AnnouncementBar, anything with a countdown.

---

## 11. Clinical Calm

Med spas. The hard part is holding two things at once: **spa luxury** and
**medical credibility**. Too soft and it reads unlicensed; too clinical and it
reads like a dermatology waiting room.

**Type** — Display `Manrope Variable` at light weight with open tracking (the
restraint is the luxury signal) / Body `Source Serif 4 Variable` (the serif is
what says "clinician", not "salon"). `@fontsource-variable/manrope`,
`@fontsource-variable/source-serif-4`.

**Type scale** — 1.200 → 1.333.

**Colour story** — alabaster, muted plum, bronze.

```css
--n-000:#fffdfc; --n-050:#f8f3f1; --n-100:#efe7e4; --n-200:#e0d4d0;
--n-300:#c0aeaa; --n-400:#8b7a76; --n-500:#6d5f5c; --n-600:#524744;
--n-700:#3a3231; --n-800:#231e1d; --n-900:#131010;
--b-050:#f7edf3; --b-100:#ecd3e2; --b-300:#c087a8; --b-500:#9c5580;
--b-600:#85446c; --b-700:#6c3757; --b-800:#4f2740; --b-900:#331926;
--a-100:#f3e3cd; --a-300:#d6b183; --a-500:#a87f47; --a-700:#7a5b32; --a-900:#43321b;
--face-display:"Manrope Variable",system-ui,sans-serif;
--face-body:"Source Serif 4 Variable",Georgia,serif;
--weight-display: 500; --tracking-display: 0.02em;  /* light + tracked = luxe */
--radius-image: 6px; --radius-card: 8px; --radius-control: 999px;
--section-y: clamp(5rem, 3.57rem + 7.14vw, 10rem);
```

> Tracking *out* on display type instead of in is the inversion that makes this
> recipe work. It is the opposite of the house default and deliberate.

**Texture & photography** — soft, warm, high-key. Skin, hands, light through
linen. Never before/after faces in the hero — it reads as a discount clinic and
in several US states carries advertising restrictions. Keep results in a clearly
labelled, consented section.

```css
--image-filter: saturate(0.90) contrast(0.98) brightness(1.03);
--image-filter-hero: saturate(0.88) contrast(1.0) brightness(1.02);
--grain-opacity: 0; --image-hover-scale: 1.03;
```

**Motion** — slow, close, calm.

```css
--duration-reveal: 780ms; --motion-distance: 14px; --motion-stagger: 0.11s;
--motion-parallax: 0.06;
```

**Suits** — HeroCentered (E), HeroSplit (B), ServicesGrid with pricing,
ProviderBios (credentials matter), FAQ, TestimonialPullQuote, BookingCTA.
**Fights** — Dense menus, loud colour, urgency banners.

---

## 12. Bright Dental

Dentists. The visitor is mildly anxious and price-uncertain. Every design choice
should lower the temperature: light, open, calm colour, obvious next step, and
insurance answered before it is asked.

**Type** — Display `Plus Jakarta Sans Variable` (friendly geometric, no
childishness) / Body `Public Sans Variable`.
`@fontsource-variable/plus-jakarta-sans`, `@fontsource-variable/public-sans`.

**Type scale** — 1.200 → 1.250. Calm and flat.

**Colour story** — white, calm teal, warm coral accent. Teal reads clinical-clean
without the cold blue of a hospital.

```css
--n-000:#ffffff; --n-050:#f3f7f8; --n-100:#e6eef0; --n-200:#d0dde0;
--n-300:#a4b8bc; --n-400:#6e8286; --n-500:#556669; --n-600:#3f4c4f;
--n-700:#2b3436; --n-800:#1a2022; --n-900:#0d1112;
--b-050:#e2f5f4; --b-100:#b8e8e5; --b-300:#57c2bb; --b-500:#159a92;
--b-600:#0f7f78; --b-700:#0c6660; --b-800:#084a46; --b-900:#052e2c;
--a-100:#ffe0d6; --a-300:#ff9d80; --a-500:#e8613c; --a-700:#a84126; --a-900:#5f2415;
--face-display:"Plus Jakarta Sans Variable",system-ui,sans-serif;
--face-body:"Public Sans Variable",system-ui,sans-serif;
--radius-image: 10px; --radius-card: 12px; --radius-control: 8px;
```

**Texture & photography** — bright, airy, real staff and real patients. Never
stock teeth close-ups; never a gloved hand holding an instrument near a face.

```css
--image-filter: saturate(0.96) contrast(1.0) brightness(1.04);
--image-filter-hero: saturate(1.0) contrast(1.02) brightness(1.03);
--grain-opacity: 0;
```

**Motion** — gentle and unhurried.

```css
--duration-reveal: 640ms; --motion-distance: 18px; --motion-stagger: 0.08s;
--motion-parallax: 0.05;
```

**Suits** — HeroSplit (B), TrustBar (insurance logos), ServicesGrid,
ProviderBios, FAQ (cost and insurance first), NewPatientCTA, LocationContact.
**Fights** — Dark sections, high contrast, urgency.

---

## 13. Counsel

Solo attorneys and small firms. Authority plus approachability. The visitor has a
problem they are embarrassed about and is deciding whether this person is both
serious and human.

**Type** — Display `Crimson Pro Variable` (a book serif — literate, not corporate)
/ Body `Libre Franklin Variable`. `@fontsource-variable/crimson-pro`,
`@fontsource-variable/libre-franklin`.

**Type scale** — 1.200 → 1.333.

**Colour story** — warm ivory, ink navy, muted burgundy.

```css
--n-000:#fdfcf8; --n-050:#f5f2ea; --n-100:#eae5da; --n-200:#d9d2c3;
--n-300:#b3ab99; --n-400:#7d7565; --n-500:#615a4d; --n-600:#48423a;
--n-700:#322e28; --n-800:#1e1b17; --n-900:#0f0d0b;
--b-050:#e9ecf2; --b-100:#c8cfdd; --b-300:#8593b0; --b-500:#3f4f72;
--b-600:#33405d; --b-700:#28334a; --b-800:#1c2434; --b-900:#111621;
--a-100:#f2dcdc; --a-300:#c98a8a; --a-500:#9e4a4a; --a-700:#7a3838; --a-900:#411d1d;
--face-display:"Crimson Pro Variable",Georgia,serif;
--face-body:"Libre Franklin Variable",system-ui,sans-serif;
--radius-image: 0; --radius-card: 2px; --radius-control: 2px;
--measure: 68ch;   /* this vertical is genuinely text-heavy */
```

**Texture & photography** — one excellent portrait beats ten stock images of
gavels, scales, columns or leather-bound books. Warm, natural light, real office.

```css
--image-filter: saturate(0.90) contrast(1.04);
--image-filter-hero: saturate(0.86) contrast(1.06);
--grain-opacity: 0.02;
```

**Motion** — minimal and sober. Motion that draws attention to itself undermines
the whole proposition.

```css
--duration-reveal: 700ms; --motion-distance: 12px; --motion-stagger: 0.09s;
--motion-parallax: 0;
```

**Suits** — HeroSplit (B) with portrait, PracticeAreas (ServicesGrid),
AttorneyBio, ProcessSteps ("what happens when you call"), FAQ,
TestimonialStatic, ConsultationCTA.
**Fights** — Galleries, carousels, anything playful.

> **Compliance:** attorney advertising is regulated state by state. Never publish
> case results, settlement figures, win rates, or "specialist"/"expert" language
> unless the client supplies it and confirms it is compliant in their
> jurisdiction. Most states require a disclaimer on testimonials. See CLAUDE.md §11.

---

## 14. Fiduciary

Financial advisors and planners. Calm competence. The differentiator is almost
never returns — it is *feeling understood*, so the design should read patient and
plain, never aspirational-stock-photo wealthy.

**Type** — Display `Libre Franklin Variable` (institutional grotesque) / Body
`Source Serif 4 Variable` / figures in `JetBrains Mono Variable` so numbers align
in tables. The inverted pairing (sans display, serif body) is what separates this
from Counsel. `@fontsource-variable/libre-franklin`,
`@fontsource-variable/source-serif-4`, `@fontsource-variable/jetbrains-mono`.

**Type scale** — 1.200 → 1.250.

**Colour story** — cool slate, deep forest, brass. Muted green reads "steady"
where a saturated green reads "crypto".

```css
--n-000:#fcfdfd; --n-050:#f1f4f4; --n-100:#e3e8e8; --n-200:#ccd4d4;
--n-300:#a1adad; --n-400:#6b7878; --n-500:#525d5d; --n-600:#3d4747;
--n-700:#2a3131; --n-800:#191e1e; --n-900:#0c1010;
--b-050:#e6f0e9; --b-100:#c2ddca; --b-300:#6ba881; --b-500:#2f7a4d;
--b-600:#26653f; --b-700:#1e5133; --b-800:#153a25; --b-900:#0d2417;
--a-100:#f4e7c8; --a-300:#d8bd7f; --a-500:#a98d45; --a-700:#786331; --a-900:#43381a;
--face-display:"Libre Franklin Variable",system-ui,sans-serif;
--face-body:"Source Serif 4 Variable",Georgia,serif;
--face-mono:"JetBrains Mono Variable",ui-monospace,monospace;
--radius-image: 2px; --radius-card: 4px; --radius-control: 2px;
```

**Texture & photography** — real people, real place, real desk. No skylines, no
handshakes, no sailboats, no couples laughing on a beach.

```css
--image-filter: saturate(0.88) contrast(1.03);
--image-filter-hero: saturate(0.85) contrast(1.05);
--grain-opacity: 0;
```

**Motion** — restrained to the point of near-invisibility.

```css
--duration-reveal: 680ms; --motion-distance: 12px; --motion-stagger: 0.09s;
--motion-parallax: 0;
```

**Suits** — HeroSplit (B), ServicesGrid (planning / investment / tax),
ProcessSteps, AdvisorBio + credentials (CFP®, fiduciary status), FAQ (fees
first), TestimonialStatic, ConsultationCTA.
**Fights** — Dark drama, big galleries, urgency.

> **Compliance:** SEC/FINRA rules govern advisor marketing. Never publish
> performance figures, and treat testimonials as regulated — since the 2021
> Marketing Rule they are permitted but require specific disclosures. The client
> supplies and approves all of it, including their ADV disclaimer. See CLAUDE.md §11.

---

## 15. Companion

Veterinary practices. Warm and calm, aimed at someone who may be frightened.
Friendly without a single cartoon paw print.

**Type** — Display `Lora Variable` (warm, slightly calligraphic serif) / Body
`Manrope Variable`. `@fontsource-variable/lora`, `@fontsource-variable/manrope`.

**Type scale** — 1.200 → 1.333.

**Colour story** — warm cream, soft teal-green, terracotta.

```css
--n-000:#fffdf9; --n-050:#f8f3ea; --n-100:#efe8db; --n-200:#ded4c2;
--n-300:#b8ad99; --n-400:#827866; --n-500:#655d4e; --n-600:#4c463b;
--n-700:#353128; --n-800:#201d18; --n-900:#11100c;
--b-050:#e3f2ee; --b-100:#bde3db; --b-300:#5fb8a6; --b-500:#1f8f79;
--b-600:#177463; --b-700:#125e50; --b-800:#0d453a; --b-900:#082b24;
--a-100:#fadfd2; --a-300:#e5a183; --a-500:#c26c45; --a-700:#8e4b31; --a-900:#50291a;
--face-display:"Lora Variable",Georgia,serif;
--face-body:"Manrope Variable",system-ui,sans-serif;
--radius-image: 12px; --radius-card: 14px; --radius-control: 999px;
--leading-body: 1.65;
```

**Texture & photography** — actual patients, warm light, staff touching animals.
Every vet site on earth uses the same three stock golden retrievers; a real
client's phone photos beat them.

```css
--image-filter: saturate(1.0) contrast(1.0) brightness(1.03);
--image-filter-hero: saturate(1.02) contrast(1.02) brightness(1.02);
--grain-opacity: 0; --image-hover-scale: 1.04;
```

**Motion** — soft and unhurried.

```css
--duration-reveal: 660ms; --motion-distance: 18px; --motion-stagger: 0.08s;
--motion-parallax: 0.06;
```

**Suits** — HeroSplit (B), EmergencyBanner (after-hours protocol — vets need this
more than anyone), ServicesGrid, ProviderBios, NewClientCTA, FAQ, HoursTable,
GalleryUniform, LocationContact.
**Fights** — Dark sections, high drama, hard geometry.

---

## 16. Detail Bay

Auto detailing, ceramic coating, PPF, custom work. Distinct from Precision Shop:
repair sells **competence**, detailing sells **the finish**. Dark-first, glossy,
photography-led — the paint is the product.

**Type** — Display `Saira Variable` (technical, slightly squared, has a width
axis) / Body `Inter Variable`. `@fontsource-variable/saira`,
`@fontsource-variable/inter`.

**Type scale** — 1.250 → 1.414.

**Colour story** — gloss black, electric blue, chrome. Built dark-first;
`.on-dark` is effectively the default context.

```css
--n-000:#ffffff; --n-050:#f2f4f7; --n-100:#e2e6ec; --n-200:#c8ced8;
--n-300:#99a2b0; --n-400:#68717f; --n-500:#4f5762; --n-600:#3a4149;
--n-700:#282d34; --n-800:#161a1f; --n-900:#08090c;
--b-050:#e4f1ff; --b-100:#b9dcff; --b-300:#57b0f5; --b-500:#0f83db;
--b-600:#0a6ab4; --b-700:#085490; --b-800:#053b66; --b-900:#032440;
--a-100:#eef1f5; --a-300:#c3ccd8; --a-500:#8b96a5; --a-700:#5c6675; --a-900:#333b45;
--face-display:"Saira Variable",system-ui,sans-serif;
--face-body:"Inter Variable",system-ui,sans-serif;
--radius-image: 4px; --radius-card: 4px; --radius-control: 2px;
--scrim-strength: 0.68; --tracking-label: 0.12em;
```

**Texture & photography** — reflections, highlights, water beading, macro paint
detail. Crushed blacks with specular highlights left intact. This is the one
recipe where a dark hero image is mandatory rather than optional.

```css
--image-filter: saturate(1.10) contrast(1.16) brightness(0.95);
--image-filter-hero: saturate(1.14) contrast(1.20) brightness(0.92);
--grain-opacity: 0; --image-hover-scale: 1.05;
```

**Motion** — smooth and gliding, a touch longer than Precision Shop.

```css
--duration-reveal: 700ms; --motion-distance: 20px; --motion-stagger: 0.08s;
--motion-parallax: 0.10;
```

**Suits** — HeroFullBleed (A), HeroVideo (D), BeforeAfter, GalleryMasonry,
GalleryScroll, PackageTiers (good/better/best converts hard here),
TestimonialPullQuote, BookingCTA.
**Fights** — Light airy sections, dense text, serif type.

---

## Using a recipe

1. Pick it — check the differentiation log in CLAUDE.md §9 first.
2. Paste its primitives into `tokens.css` §1 and its faces into §2.
3. Swap the Fontsource imports in `src/layouts/BaseLayout.astro`.
4. Apply the texture and motion overrides into their sections.
5. **Modify it.** Shift the brand hue, retune the scale ends, change one
   structural variant. A recipe used unmodified is a template, and we don't sell
   templates.
6. `npm run check:contrast`.
7. Log the final combination in CLAUDE.md §9.
