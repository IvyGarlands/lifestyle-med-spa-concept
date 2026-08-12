# Brand archaeology — Lifestyle Med Spa

Excavated 2026-08-12, before any palette, typeface or recipe was chosen.
Every observation carries its source. Hex values marked **sampled** were read
out of their actual pixels, not eyeballed.

The short version: **they already have a real identity, and the previous
concept (build 004) missed it completely.** 004's log entry describes them as
having "no distinctive palette, default sans, generic contemporary med-spa
look" and designed a manila-and-ink-blue paper system from scratch. That was
wrong. They own a gold lotus in a ring, a signature script, a deep navy, and a
high-contrast serif. This build carries all four across.

---

## 1. The mark

**Source:** `https://lifestylehealthservices.com/wp-content/uploads/2023/09/lifestyle-health-service-website-logo.png`
(481×481 PNG, downloaded and inspected directly; used in the header, the
footer and the mobile nav of every page)

What is actually in it, from the outside in:

| Element | Description |
|---|---|
| **Containing ring** | A single thin gold circle, full-bleed to the artboard, unbroken. |
| **Lotus / water lily** | Five gold petals — one upright centre petal, two mid, two outer sweeping almost horizontal. Each petal is a pointed ogive. |
| **The bindu** | A small gold disc floating free above the centre petal. Detached, not touching. |
| **Water lines** | Two long shallow crossing arcs under the flower, meeting at a point — the flower is floating on water. This is the most distinctive and least generic thing in the mark. |
| **"Lifestyle"** | A brush/signature script, single weight, with a large open initial **L** and a long exit stroke off the final **e**. |
| **"Med Spa"** | Much smaller, same script family, centred beneath, roughly 1/3 the cap height. |

**Register:** feminine, calm, botanical, spa-luxury, warm. Not clinical. Not
technical. Nothing about it says "medicine" — which is a genuine tension,
because medicine is what they actually sell.

**Quality judgement: honour the composition, redraw the execution.**

The *idea* is theirs and it is good — a lotus on water inside a ring, signed.
The *execution* is stock. Specifically:

- The gold is a **linear bevel gradient** running light-to-dark across every
  petal, which is the single most reliable tell of a clip-art mark. It also
  fails completely at favicon size and on any dark ground.
- The petals are a symmetric mirror of one shape, so the flower has no drawn
  weight distribution — no thick-to-thin, no overlap logic, no depth.
- The script is a licensed brush font set at default tracking. The **L**
  collides with the **i** dot, and "Med Spa" is set so small it fills in.
- Everything is centred inside a circle with no optical adjustment, so the
  flower sits visually high in the ring.

So: **not reinvented, redrawn.** The ring stays, the lotus stays, the bindu
stays, the water lines stay, the script stays, the gold stays. What changes is
that they are drawn properly — flat gold instead of a bevel, real petal
geometry with varied widths, the water lines rebuilt as a repeatable ornament,
and the script replaced with a well-drawn one that has room to breathe.

Someone who knows this business will recognise the mark instantly. That is the
test, and it passes.

---

## 2. Colour actually in use

Sampled from the live site's computed styles and from the logo's own pixels.

| Colour | Hex | Where it actually appears | Source |
|---|---|---|---|
| **Deep navy** | `#1A2A40` | Header bar, hero band, every heading on light sections, footer ground | **sampled** — computed `color`/`background-color`, 316 occurrences |
| **Gold** | `#EECC7A` | Phone number, links, accents, the whole logo | **sampled** — 75 occurrences |
| **Light gold** | `#F6DD8C` | Hover states, secondary accents | **sampled** — 16 occurrences |
| **Logo gold core** | `#FCCC6C` → `#FCD070` | The lotus petals' mid-tone, the densest colour in the mark | **sampled from logo pixels** |
| **Logo gold highlight** | `#FCE49C` → `#FCF0B8` | The bevel's light end | **sampled from logo pixels** |
| **Warm off-white** | `#EAE9E5` | Body copy on the dark header/footer, H1 | **sampled** — 325 occurrences |
| **Champagne** | `#E8DCCB` | Section grounds, card fills | **sampled** — 42 occurrences |
| **Taupe** | `#D9CDBF` | Footer headings at 80% opacity, rules | **sampled** — 17 occurrences |
| **Dusty rose** | `#C48F7F` | Button fills in the promotional modal | **sampled** — 6 occurrences |

**The identity is navy + gold, warmed with champagne, with a dusty rose that
only surfaces in promotional material.** Every one of those five colours is
carried into the concept. None is invented and none is replaced.

The one correction made: their gold is used as *text on navy* at `#EECC7A`,
which is fine, but they also set gold text on white in places, which fails AA
badly. The concept keeps the gold and fixes where it is allowed to land.

---

## 3. Type character

| Role | What they use | Genre | Source |
|---|---|---|---|
| Display / H1 / H2 | **Playfair Display**, 500–600 | High-contrast transitional-to-Didone serif | **sampled** — computed `font-family` on `h1`, `h2` |
| Body / buttons | **Montserrat**, 300–600 | Geometric sans | **sampled** — computed on buttons, phone, body copy |
| Nav / footer | **Gotham**, 300–400 | Geometric sans | **sampled** |
| Section subheads | **Ridley Grotesk**, 500–600 | Neo-grotesque | **sampled** |
| Wordmark | a brush signature script | Script | logo file |

Four text families plus a script, three of them doing the same job. That is a
site assembled in a page builder rather than designed — but the **genre choice
is right and it is theirs**: a high-contrast serif over a geometric sans, with
a script for the name.

**Carried across, genre for genre:**

- High-contrast serif → **kept**, executed better. Playfair Display is a fine
  face rendered here at a single optical size with default tracking. Its
  genre — a Didone, hairline serifs, vertical stress, dramatic thick/thin — is
  exactly right for a warm-luxury spa and it is what makes their headings feel
  expensive despite everything else. Replaced with a true Didone that has a
  live optical-size axis, so the contrast actually increases as the type grows.
- Geometric sans → **kept**, consolidated. Montserrat, Gotham and Ridley
  Grotesk collapse into one geometric-humanist family that holds up at reading
  sizes, which Montserrat Light at 16px does not.
- Script → **kept and promoted.** Their script is currently trapped in a 40px
  logo. It is the most characterful thing they own and it is the thing a
  patient would recognise. In the concept it becomes structural.

**Category switching would have been the failure mode here** and it is what 004
did: it dropped the serif for Fraunces-on-manila and dropped the script
entirely. This build does not switch category on any of the three.

---

## 4. Ornament and motif

Everything ornamental they own, exhaustively:

1. **The ring** — the circular container around the mark.
2. **The lotus** — five petals plus a detached bindu.
3. **The water lines** — two crossing shallow arcs. Their best asset.
4. **The signature stroke** — the long exit off the final "e" of Lifestyle.
5. Four small round service icons (weight management / wellness / aesthetics /
   products), gold line-art, generic stock. Not worth keeping.

Items 1–4 are rebuilt as real, reusable design-system elements. Item 5 is
dropped and its job is done by type instead.

The water lines are the find. Two crossing arcs meeting at a point is a
distinctive, drawable, repeatable shape, and it is currently doing nothing but
sitting inside a 40px logo. It becomes the section divider, the underline
beneath every signature, and the shape of the flourish under the wordmark.

---

## 5. Era and register

**Warm feminine luxury with a botanical calm** — closer to a hotel spa than to
a clinic. Gold-on-navy, script, lotus, "your journey", "glow".

And this is the productive tension in the whole brand: **what they actually
sell is prescription medicine, supervised by a board-certified internist.**
Their register says spa; their business is a physician-led weight-loss
practice; their own homepage H1 says "Weight Loss Clinic".

The concept does not resolve that by picking one side. It keeps the warm gold
register — because that is theirs and it is what "you're family" sounds like —
and it makes the *medicine* the thing the warmth is applied to. Warm colour,
serious content.

---

## 6. Their voice — actual words, verbatim

From their homepage, about page and ten staff bios:

> "There are no contracts, no hidden fees, no membership costs — and
> consultations are always free."

> "When you step through our doors, you're not just a patient — you're family."

> "We'll be by your side every step of the way"

> "world-class care should always feel personal"

> "compassionate, personalized care in a welcoming environment"

> "Known for her warm, genuine, and approachable personality"

> "Known for her warmth, empathy, and dedication to others"

The words that recur across their own copy and their patients' reviews are the
same words: **personal, warm, compassionate, family, supported, by your side.**
Not one recurring word is about technology, results, price or speed.

---

## 7. What is carried, what is changed

| Cue | Decision |
|---|---|
| Lotus mark | **Carried.** Redrawn — flat gold, real petal geometry, optically centred in the ring. |
| Ring | **Carried.** Now also the shape of the section-lead ornament. |
| Water lines | **Carried and promoted** from logo detail to the system's primary rule/divider. |
| Bindu | **Carried.** Becomes the marker on the divider and the list bullet. |
| Deep navy `#1A2A40` | **Carried** as the page ground. Refined into a full ramp. |
| Gold `#EECC7A` / `#FCCC6C` | **Carried** as the brand colour. Flat, never gradient. |
| Champagne `#E8DCCB`, off-white `#EAE9E5` | **Carried** as paper and ink-on-dark. |
| Dusty rose `#C48F7F` | **Carried** as the sub-5% accent. |
| High-contrast serif | **Carried by genre.** Playfair → a true Didone with a live optical-size axis. |
| Geometric sans | **Carried by genre.** Montserrat/Gotham/Ridley → one geometric-humanist family. |
| Signature script | **Carried and made structural** — see the concept's organising idea. |
| Gradient bevels | **Removed.** The one thing in the identity that is purely clip-art. |
| Stock service icons | **Removed.** Replaced with type. |
| Stock beauty photography | **Removed.** It is licensed to them, it is not their room or their staff, and it is the exact thing that makes their site look like every competitor's. |
| Four competing text families | **Consolidated** to three, one of which is used only for names. |

**How much of the original identity survives: nearly all of it.** Four of their
five colours, all four of their ornamental elements, both of their type genres,
and their wordmark's structure. What was replaced was execution — gradients,
default tracking, stock icons, stock photography — not identity.

---

## 8. Where the brand cues overrule the recipe

Per the canonical brief, brand cues beat the recipe book.

The medspa default recipe is **Clinical Calm** (alabaster, plum, bronze; light
ground; restrained sans). It was already burned by build 002, and it conflicts
with this business's real cues on three axes at once:

- Clinical Calm is **cool and light**; Lifestyle is **warm and dark**.
- Clinical Calm is **sans-led**; Lifestyle's whole heading system is a
  **high-contrast serif**, and it is the best thing about their current site.
- Clinical Calm has **no script and no ornament**; Lifestyle's identity is a
  script signature and a botanical mark, and the script is the single most
  recognisable thing they own.

Three conflicts on three axes means the recipe does not bend, it breaks. The
build is filed as a new entry, **"The Signature"**, derived from the brand
archaeology rather than from any recipe in the book. Logged as row 006.
