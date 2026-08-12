# QA Checklist

Every line passes before a site ships or a demo is sent. No exceptions, no
"we'll fix it after" — after never comes on a zero-maintenance site.

Run the automated gate first; it catches about half of this on its own:

```bash
npm run verify
```

That runs `astro check` → `check:contrast` → `check:recipes` → `build`, in that
order, and fails on the first problem.

---

## 1. Build & types

- [ ] `npm run build` completes with **no warnings and no errors**
- [ ] `npm run check` — 0 errors
- [ ] `npm run check:contrast` — passes (re-run after ANY palette edit)
- [ ] No `console.log` left in shipped scripts
- [ ] No unused imports or dead components

## 2. Content

- [ ] **Every `FPO` placeholder removed** or explicitly accepted by the client
      — `grep -rn "fpo-" src/pages/ src/content/`
- [ ] Business name, phone, address, hours checked **against the Google Business
      Profile**, character by character. One wrong digit undoes the whole job
- [ ] Phone number is a working `tel:` link — tap it on a real phone
- [ ] All testimonials are **real, verbatim, and attributed** (CLAUDE.md §11)
- [ ] No invented awards, certifications, licences, "since 19XX", or statistics
- [ ] Regulated verticals: licence number and disclaimer are the client's own
      text, supplied in writing
- [ ] Prices match what the business actually charges today
- [ ] Spelling: run the copy through a checker. Read the headline aloud
- [ ] Nothing says "Lorem", "TODO", "Business Name", or "example.com"

## 3. Accessibility

- [ ] **Keyboard-only pass**: tab the whole page top to bottom. Every
      interactive thing is reachable, in a sensible order, with a visible ring
- [ ] Mobile menu: opens, traps focus, closes on `Escape`, returns focus to the
      trigger
- [ ] Lightbox: opens, arrow keys page, `Escape` closes, focus returns
- [ ] Skip link works and is visible when focused
- [ ] One `<h1>`; heading levels never skip (h2 → h4 is a bug)
- [ ] Landmarks: one `header`, one `main`, one `footer`; every `nav` labelled
- [ ] **Every image has meaningful alt text** — decorative ones are `alt=""`
      *and* explained in `altNote`
- [ ] No dangling `aria-labelledby` — every referenced id exists on the page
- [ ] Forms: visible `<label>` on every field (placeholder is not a label);
      errors are text, not colour alone
- [ ] Touch targets ≥44×44px
- [ ] `prefers-reduced-motion: reduce` — turn it on in OS settings and reload.
      **Nothing animates, nothing is hidden**
- [ ] Zoom to 200% — no content lost, no horizontal scroll
- [ ] `<html lang>` correct on every locale; `hreflang` alternates resolve

## 4. Performance

- [ ] **Lighthouse ≥95 in all four categories, mobile preset, on the deployed
      URL** (localhost lies — no network latency, warm cache)
- [ ] **CLS = 0.** Every image has explicit dimensions or a locked aspect-ratio
- [ ] LCP element is the hero image or hero heading, and it is NOT animated
      from `opacity: 0`
- [ ] Hero image: `loading="eager"` + `fetchpriority="high"`. Everything below
      the fold: `loading="lazy"`
- [ ] Fonts self-hosted; **zero requests to fonts.googleapis.com or
      fonts.gstatic.com** — check the network tab
- [ ] Total client JS under 40KB gzipped
- [ ] No live third-party embeds above the fold (map is a click-to-activate
      facade)
- [ ] Total page weight under 1MB on first load

## 5. SEO

- [ ] Unique `<title>` and meta description per page; description 120–160 chars
- [ ] Canonical URL correct and absolute
- [ ] **JSON-LD validates with zero errors** in Google's Rich Results Test
- [ ] Schema `@type` matches the vertical (CLAUDE.md §10a)
- [ ] Hours in the schema match the hours on the page — they read from the same
      source, so a mismatch means someone hardcoded something
- [ ] OG image is 1200×630 and actually renders — paste the URL into a Slack or
      iMessage draft and look
- [ ] `sitemap-index.xml` generated and lists the real pages
- [ ] `robots.txt` present and correct
- [ ] **Concept/demo builds return `noindex,nofollow`** —
      `curl -s <url> | grep robots`

## 6. Real-device check

Not devtools. An actual phone.

- [ ] Homepage on a real phone, on cellular if possible
- [ ] Sticky call bar doesn't cover the footer or the last section
- [ ] Thumb reach: primary CTA is in the bottom two-thirds
- [ ] Text is readable without zooming
- [ ] No horizontal scroll anywhere —
      `document.documentElement.scrollWidth > innerWidth` is `false`
- [ ] Tap the phone number. It should dial
- [ ] Landscape orientation doesn't break the hero
- [ ] Check on iOS Safari specifically — it's the one that finds your bugs

## 7. Forms

- [ ] **Submit the form for real**, with the production endpoint
- [ ] The email arrived. Check spam
- [ ] Reply-to is the visitor's address, not ours
- [ ] Required-field validation fires and is announced
- [ ] Honeypot present and hidden from humans
- [ ] Success message appears; the form resets
- [ ] Error path tested (block the network and submit)
- [ ] `FORM_ENDPOINT` is the client's, not a leftover test endpoint

## 8. Deploy

- [ ] Custom domain resolves with HTTPS; the certificate is valid
- [ ] `www` and apex both work and one redirects to the other
- [ ] 404 page renders and offers a way back
- [ ] Auto-deploy on push confirmed — push a trivial change and watch it land
- [ ] Client has been handed `docs/handoff-packet-template.md`, filled in

## 9. Differentiation

- [ ] The hero variant + type pairing + colour story combination is **not**
      already in the CLAUDE.md §9 log
- [ ] The recipe was modified — at minimum the palette and the type scale
- [ ] **Project appended to the log** before the invoice goes out

---

## Fast pre-send check for ambush demos

When you have four minutes, not forty:

```bash
npm run verify
grep -rn "fpo-" src/pages/          # any placeholder left?
curl -s <staging-url> | grep -o 'name="robots"[^>]*'   # must be noindex
```

Then by eye: **headline, phone number, review text, one real phone.** Those four
are what the recipient actually looks at.
