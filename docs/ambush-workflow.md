# Ambush Workflow

A repeatable process for producing a redesigned homepage for a real local
business as a cold-outreach demo, live on a staging URL, in **under an hour of
your involvement**.

You trigger it by saying:

```
AMBUSH: [business name], [address], [vertical], [design recipe], [notes]
```

Example:

```
AMBUSH: Vinny's Auto Body, 1120 Cranston St Providence RI, auto, Precision Shop,
they've been there 30 years and the owner answers the phone himself
```

The recipe is optional — if you leave it out I'll propose one from the vertical
defaults in `design-recipes.md` and check it against the differentiation log.

---

## The one-hour budget

The whole workflow is designed around where *your* time actually goes. Claude's
time is not the constraint; yours is.

| Phase | Who | Target |
|---|---|---|
| 0. Gather materials | **You** | 20 min |
| 1. Paste the intake | **You** | 5 min |
| 2. Scaffold + copy + build | Claude | — |
| 3. Review and correct | **You** | 15 min |
| 4. Push + deploy | **You** (commands supplied) | 10 min |
| 5. Log + send | **You** | 5 min |

**Phase 0 is the whole game.** An ambush with real photos and five real reviews
lands; one with FPO placeholders and invented copy does not. If you only have 20
minutes, spend 15 of them on photos.

---

## Phase 0 — Gather (you, before triggering)

Create `input/[slug]/` and put everything in it. **I do not scrape, fetch or
download anything from the target's site or profile** (CLAUDE.md §11) — you
supply every asset, deliberately.

**Required**

- [ ] **Google Business Profile basics** — exact business name, address, phone,
      hours, and the categories Google lists them under
- [ ] **5–10 real Google reviews** — copy the text verbatim, with the reviewer's
      first name + last initial, star rating and month. Pick the ones that say
      something specific; "great food" is useless
- [ ] **Menu or service list** — a photo of the menu is fine, I'll transcribe it

**Strongly recommended**

- [ ] **Photos** into `input/[slug]/photos/` — 6–12 is plenty. Their own
      Facebook photos usually beat their website's. Name them so I know what
      they are: `dining-room.jpg`, `owner-marco.jpg`
- [ ] **Anything they say about themselves** — the "About" paragraph from their
      current site, a newspaper write-up, the sign in the window

**Worth two minutes**

- [ ] Their current website URL (so the pitch can be specific about what improves)
- [ ] Whether they serve a Spanish-speaking community — bilingual is a genuine
      differentiator and costs one extra content pass

### Sourcing images — read this once

**Claude cannot fetch images from the target's website.** Two reasons, and the
second is the one that matters:

1. **Technical.** `WebFetch` returns text/markdown. It cannot download binaries.
   Screenshots are the wrong resolution and carry the site's own overlays.
2. **Licensing.** A business's site is usually a mix of *their* photos and
   *licensed* photos — stock, or a manufacturer's partner library (James
   Hardie, Andersen, Sherwin-Williams and most franchise suppliers all provide
   these). That licence covers **their** domain, not ours. Showing a business
   its own job photos back is defensible; re-hosting a manufacturer's or a
   photographer's images is not.

So: **the operator supplies every image file.** Drop them in
`input/photos/`. Name them for what they are (`kitchen-after.jpg`,
`owner-portrait.jpg`) so they can be placed without a round-trip.

**Attaching images in chat is not a substitute.** It is useful — Claude can see
them, tell you which are hero-worthy and what is missing — but a chat
attachment cannot become a build asset. `astro:assets` needs real bytes on disk
to emit AVIF/WebP and lock dimensions, and an image that has only been *viewed*
cannot be written back out losslessly. If you are unsure whether your setup
exposes attachments on disk, attach one and ask Claude to check for a
filesystem path before you attach twenty.

**Where the good photos actually live** — almost never the website:

| Vertical | Best source, in order |
|---|---|
| contractor / remodeler | Google Business Profile → Houzz → Instagram → the owner's phone |
| restaurant / bakery | Instagram → Google Business Profile → Yelp user photos |
| medspa / salon | Instagram → Google Business Profile |
| auto / trades | Google Business Profile → Facebook |
| venue | their own gallery → wedding photographers who tag them |

A business's Google Business Profile photos are its own uploads, which makes
them both the most authentic and the cleanest to use. Ten real phone photos beat
forty polished stock ones — the whole pitch is that this site is *theirs*.

**Regulated verticals** (legal, financial, medspa, dental, vet, contractor):
also grab their **licence number and any required disclaimer**. If you can't
find them, I'll leave those sections out rather than invent them.

---

## Phase 1 — The intake (you, 5 minutes)

Trigger the ambush, then paste what you gathered. I'll ask for anything missing.
No need to format it — dumped text is fine.

I'll confirm back:
- the recipe and hero/section variants I intend to use
- that the combination isn't already in the differentiation log
- which sections will ship, and which are blocked for lack of material

---

## Phase 2 — Build (Claude)

1. **Scaffold** a sibling project:
   ```bash
   ./scripts/new-client.sh --ambush --name "Vinny's Auto Body" --vertical auto
   ```
   Creates `../ambush-vinnys-auto-body/`, copies the engine, sets
   `SITE.isConcept = true` (which turns on the concept badge **and** emits
   `noindex,nofollow` automatically), and runs `git init`.

2. **Apply the recipe** — paste its primitives into `tokens.css` §1, swap the
   two Fontsource imports in `BaseLayout.astro`, apply the texture and motion
   overrides. Then **modify it**: shift the palette and retune the type scale, so
   it isn't a template (CLAUDE.md §8).

3. **Write the copy** in the business's own voice, from the supplied materials:
   hero line, story blurb, offerings, one featured real review, hours and
   location, and one clear primary CTA.

   Copy rules that matter more than anything else here:
   - **Specifics beat adjectives.** "Rolled every morning since 1974" beats
     "authentic, high-quality Italian cuisine."
   - **Steal their actual phrases.** If a review says "the guy actually calls
     you back", that's the headline.
   - **Never invent a fact.** No awards, no "family owned since 1962", no
     certifications, no review text (CLAUDE.md §11).
   - Read it aloud. If it sounds like a brochure, rewrite it.

4. **Build one page.** Homepage only. Resist adding inner pages — they cost time
   and add nothing to the pitch.

5. **Images** — their real photos where supplied; `FPO` placeholders where not.
   Placeholders are visibly marked `REPLACE BEFORE SENDING` so they cannot be
   missed. I'll list every one at the end.

6. **The concept badge** renders automatically from `SITE.isConcept`:
   > Concept redesign by **Looking Glass Labs** · Not affiliated with Vinny's Auto Body

   It is not optional and it does not come off (CLAUDE.md §11).

7. **QA** — run `docs/qa-checklist.md`, `npm run verify`, and report the results
   honestly, including anything that failed.

---

## Phase 3 — Review (you, 15 minutes)

Open the local preview and check, in this order:

1. **The headline.** Does it sound like them, or like a website? This is the
   only thing the recipient will really read.
2. **The reviews.** Are they verbatim? Right names?
3. **The facts.** Phone, address, hours — one wrong digit kills the pitch.
4. **The FPO list.** Swap or accept every one.
5. **On your phone.** Not devtools. Your actual phone.

Tell me what to change. Corrections at this stage are cheap.

---

## Phase 4 — Ship (you, 10 minutes)

I'll give you the exact commands. They look like this:

```bash
cd ../ambush-vinnys-auto-body && git add -A && git commit -m "Concept redesign for Vinny's Auto Body"
```

```bash
gh repo create ambush-vinnys-auto-body --private --source=. --push
```

Then Cloudflare Pages — the click-by-click is in `DEPLOY.md`. First deploy takes
about four minutes; every later push is automatic.

**Before sending, confirm the staging URL returns `noindex`.** `SITE.isConcept`
handles it, but check — a demo indexed under the client's name is a real problem
for them and an embarrassing one for us:

```bash
curl -s https://ambush-vinnys-auto-body.pages.dev | grep -o 'name="robots"[^>]*'
```

---

## Phase 5 — Log and send (you, 5 minutes)

1. Append the project to the differentiation log in **CLAUDE.md §9**. Do this
   even for ambushes that never convert — the point is that no two projects ever
   share a look, and an unlogged ambush is a landmine for a future client.
2. Send it.

### The send

Short. The link does the work. Something like:

> Subject: I redesigned your homepage — no charge, no catch
>
> Hi [name] — I'm [you], I build websites for local businesses in [area].
>
> I spent a couple of hours rebuilding your homepage as a concept. It's here:
> [link]. It's not affiliated with you and there's nothing to sign — I built it
> because [specific, true reason: your reviews are extraordinary and the current
> site doesn't show them / the site isn't readable on a phone].
>
> If you like it, I'll finish it and hand you the whole thing. If not, keep the
> screenshots and use them with whoever you like.
>
> [phone]

Don't attach anything. Don't explain the tech. Don't say "AI".

---

## What makes ambushes fail

Learned the expensive way; treat these as rules.

| Failure | Fix |
|---|---|
| FPO placeholders left in | Phase 0. Get photos. |
| Generic copy | You skipped reading the reviews. The voice is in the reviews. |
| Wrong hours or phone | Check against the Google profile one more time. |
| Looks like their competitor's site | You reused a differentiation-log combination. |
| Sent Friday afternoon | Tuesday–Thursday morning. They read email before service. |
| Demo got indexed | `SITE.isConcept` was false. Check with the curl above. |
| Too many sections | One page, six sections, one CTA. A long demo reads as a template. |

---

## Section recipe by vertical

A starting composition, not a rule.

| Vertical | Sections, in order |
|---|---|
| restaurant / bakery | Hero → Story → Menu → Featured review → Gallery → Location+Hours → CTA |
| venue | Hero (centered) → Story → Gallery → Events/Private → Review → Location → CTA |
| auto repair | Hero (split, dark) → TrustBar → Services → Process → Review → Location → CTA |
| auto detailing | Hero (full-bleed) → BeforeAfter → PackageTiers → Review → Location → CTA |
| home services | Hero (split) → EmergencyBanner → TrustBar → Services → Process → Review → CTA |
| contractor | Hero (editorial) → BeforeAfter → Process → Review → TrustBar → CTA |
| medspa / salon | Hero (centered) → Services+pricing → ProviderBios → FAQ → Review → Location → CTA |
| dental | Hero (split) → TrustBar (insurance) → Services → ProviderBios → FAQ → Location → CTA |
| legal | Hero (split, portrait) → PracticeAreas → Process → AttorneyBio → FAQ → CTA |
| financial | Hero (split) → Services → Process → AdvisorBio → FAQ (fees first) → CTA |
| vet | Hero (split) → EmergencyBanner → Services → ProviderBios → Hours → Review → CTA |
| studio | Hero (video/split) → Schedule → Gallery → Review → Location → CTA |

---

## Quick reference

```bash
./scripts/new-client.sh --ambush --name "Business" --vertical auto   # scaffold
npm run dev                                                          # preview
npm run verify                                                       # types + contrast + recipes + build
npm run placeholders                                                 # regenerate FPO images
grep -rn "FPO\|fpo-" src/pages/                                      # find every placeholder
```
