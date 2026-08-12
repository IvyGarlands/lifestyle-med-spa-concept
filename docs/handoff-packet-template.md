# Handoff Packet — [BUSINESS NAME]

> Fill in every `[BRACKET]`, delete this line, and send as a PDF.
> The goal: the client can run and change their own site without calling us,
> and nobody has to remember anything a year from now.

---

## Your website

**Live at:** [https://example.com]
**Launched:** [DATE]
**Built by:** Looking Glass Labs — [YOUR EMAIL] · [YOUR PHONE]

---

## What you own

Everything. There is no subscription to us, no licence, and no lock-in.

| Thing | Where it lives | Who owns it | Login |
|---|---|---|---|
| Domain name | [REGISTRAR] | You | [ACCOUNT EMAIL] |
| Website files | GitHub — [REPO URL] | You | [GITHUB ACCOUNT] |
| Hosting | Cloudflare Pages | You | [CLOUDFLARE ACCOUNT] |
| Contact form | [Formspree / Web3Forms] | You | [ACCOUNT EMAIL] |
| Photography | On the site | [You / photographer — LICENCE TERMS] | — |

**Recurring costs: [$X/year for the domain]. That is the entire bill.**
Hosting is free at your traffic level. There is no CMS licence, no plugin
subscription, and no maintenance fee.

---

## Why there's nothing to maintain

Your site is *static*: every page was built in advance and is served as a plain
file. There is no database, no admin login, no WordPress, and no plugins.

That means:

- **Nothing to update.** No security patches, no version upgrades.
- **Nothing to hack.** There is no login page and no database to break into.
- **It cannot go down under load.** The files are cached worldwide.
- **It will still work in five years** if nobody touches it.

The trade-off, stated honestly: **you cannot edit it yourself in a browser.**
Changes go through us (or any developer — see "If we get hit by a bus"). For a
site that changes a few times a year, that is a good trade. If you expect to
edit weekly, tell us and we'll talk about a different setup.

---

## Making changes

### Things we'll do quickly

| Change | Typical turnaround | Cost |
|---|---|---|
| Hours, phone, address | [SAME DAY] | [$X or included] |
| Menu / service / price updates | [1–2 DAYS] | [$X] |
| Swap photos | [1–2 DAYS] | [$X] |
| Add or remove a review | [SAME DAY] | [$X] |
| Announcement bar (specials, holiday hours, closures) | [SAME DAY] | [$X] |
| New page | [3–5 DAYS] | [$X] |

**How to request one:** email [YOUR EMAIL] with what you want changed. Photos as
attachments. No need to be technical — "take the lunch specials off and put the
Thanksgiving hours up" is a perfect request.

### Things you can do yourself

- **Google Business Profile** — hours, holiday hours, photos, posts, replying to
  reviews. This matters more for getting found than the website does. Keep it
  current.
- **Form notifications** — change where enquiries go in your
  [Formspree/Web3Forms] account.

---

## Where enquiries go

Contact-form submissions email **[CLIENT EMAIL]**.

- **Check spam for the first week** and mark them "not spam" once, so later ones
  land properly.
- Reply directly to the email — it goes back to the customer.
- To change the destination address: log into [PROVIDER] → [FORM NAME] →
  Settings → Notification email.

**Test it now, in front of us:** submit the form on your own site and confirm
the email arrives. Do not skip this.

---

## Your site at a glance

| | |
|---|---|
| Pages | [LIST] |
| Languages | [English / English + Spanish] |
| Design recipe | [RECIPE NAME] |
| Typefaces | [DISPLAY] / [BODY] — self-hosted, no licence to renew |
| Analytics | [None / Cloudflare Web Analytics — cookie-free, no banner needed] |

### Performance at launch

Google Lighthouse, mobile:

| | Score |
|---|---|
| Performance | [XX] |
| Accessibility | [XX] |
| Best Practices | [XX] |
| SEO | [XX] |

For context, a typical small-business WordPress site scores 30–50 on mobile
performance. This matters because Google ranks partly on speed, and because
roughly [70]% of your visitors are on a phone, often on a bad connection.

---

## Getting found

We set up:

- Structured data telling Google you are a **[SCHEMA TYPE]**, with your hours,
  address and phone in a format it reads directly
- A sitemap, submitted automatically
- Titles and descriptions written per page
- Fast mobile pages, which is a ranking factor

**What actually moves the needle now is not the website — it's your Google
Business Profile.** Specifically:

1. **Ask for reviews.** Ask every happy customer, out loud, at the moment
   they're happy. This outranks everything else on this page.
2. Post photos to your Google profile monthly.
3. Keep holiday hours updated there — wrong hours on Google costs you more
   customers than any web design decision.

---

## If something breaks

It almost certainly won't. If it does:

1. **Site won't load** — check [https://www.cloudflarestatus.com]. If Cloudflare
   is fine, call us.
2. **Wrong information showing** — your browser cached an old copy. Hard-refresh
   with `Cmd+Shift+R` (Mac) or `Ctrl+F5` (Windows).
3. **Form stopped emailing** — check spam first, then your [PROVIDER] account
   quota.
4. **Anything else** — [YOUR PHONE] / [YOUR EMAIL].

**Emergency rollback:** if a change ever breaks something, the previous version
can be restored in about 30 seconds from the Cloudflare dashboard
(Deployments → the last good one → Rollback). Nothing is ever lost.

---

## If we get hit by a bus

Deliberately included, because a site you can't leave isn't really yours.

Your site is a standard **Astro** project in your GitHub repository. Any
competent web developer can pick it up. Tell them:

> Astro, static output, vanilla CSS with design tokens in
> `src/styles/tokens.css`, content in Astro content collections under
> `src/content/`, deployed to Cloudflare Pages on push to `main`.
> `CLAUDE.md` in the repo root documents the whole system.

That sentence is enough for them to quote you accurately. There is no
proprietary framework, no page builder, and no piece of it that only we can
work on.

---

## Signed off

| | |
|---|---|
| Delivered by | [YOUR NAME], Looking Glass Labs |
| Date | [DATE] |
| Accepted by | ______________________ |
| Date | ______________________ |
