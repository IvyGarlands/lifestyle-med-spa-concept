# DEPLOY.md

Getting a site from this repo onto a live URL, written so a non-developer can
follow it. Roughly **15 minutes** the first time, and about **20 seconds** every
time after that (push, and it deploys itself).

Hosting is **Cloudflare Pages**. It is free at our volume, fast everywhere, has
free SSL, and — the reason we use it — there is nothing for the client to log
into, patch, or renew.

---

## Part 1 — Put the code on GitHub

### With the `gh` CLI (faster)

```bash
git add -A && git commit -m "Initial site"
```

```bash
gh repo create client-name --private --source=. --push
```

Done — skip to Part 2.

### Without the CLI (click-by-click)

1. Go to **github.com** and sign in.
2. Top-right **+** → **New repository**.
3. **Repository name**: `client-name` (lowercase, hyphens, no spaces).
4. Choose **Private**.
5. Do **not** tick "Add a README", "Add .gitignore", or "Choose a licence" —
   this repo already has them, and adding them here causes a conflict.
6. Click **Create repository**.
7. GitHub shows a page of commands. Ignore it and run these instead, from the
   project folder in Terminal:

```bash
git add -A && git commit -m "Initial site"
```

```bash
git branch -M main && git remote add origin https://github.com/YOUR-USERNAME/client-name.git && git push -u origin main
```

Refresh GitHub. Your files are there.

---

## Part 2 — Connect Cloudflare Pages

1. Go to **dash.cloudflare.com** and sign in (create a free account if needed).
2. In the left sidebar: **Compute (Workers & Pages)**.
3. Click **Create** → the **Pages** tab → **Connect to Git**.
4. Click **Connect GitHub**. A GitHub window opens asking for permission.
   - Choose **Only select repositories**
   - Pick the repository you just created
   - Click **Install & Authorize**
5. Back in Cloudflare, select your repository → **Begin setup**.
6. Fill in the build settings **exactly**:

   | Field | Value |
   |---|---|
   | Project name | `client-name` (becomes `client-name.pages.dev`) |
   | Production branch | `main` |
   | Framework preset | **Astro** |
   | Build command | `npm run build` |
   | Build output directory | `dist` |
   | Root directory | *(leave empty)* |

7. Expand **Environment variables** and add one:

   | Variable name | Value |
   |---|---|
   | `NODE_VERSION` | `22` |

   > This one matters. Cloudflare's default Node is older than this project
   > needs, and without it the build fails with a confusing error about
   > unsupported syntax.

8. Click **Save and Deploy**.

The first build takes 2–4 minutes. When it finishes you get a live URL:
`https://client-name.pages.dev`

**Every push to `main` now redeploys automatically.** There is nothing else to
set up.

---

## Part 3 — Point the client's domain at it

Only for real client sites. Ambush demos stay on the `.pages.dev` URL.

### If the client's domain is already on Cloudflare

1. In your Pages project → **Custom domains** → **Set up a custom domain**.
2. Type the domain (e.g. `rosalias.com`) → **Continue** → **Activate domain**.
3. Repeat for `www.rosalias.com`.

Cloudflare adds the DNS records itself. Live in a couple of minutes.

### If the domain is somewhere else (GoDaddy, Namecheap, Squarespace…)

You need the client's registrar login, or you need to send them these steps.

1. In Pages → **Custom domains** → **Set up a custom domain** → enter the
   domain.
2. Cloudflare shows the DNS records to create. Usually:

   | Type | Name | Value |
   |---|---|---|
   | CNAME | `www` | `client-name.pages.dev` |
   | CNAME | `@` (or "root"/"apex") | `client-name.pages.dev` |

3. Log in at the registrar, find **DNS** / **Manage DNS** / **Nameservers →
   Advanced DNS**, and add exactly those records.
4. If the registrar refuses a CNAME on the root domain (many do), use
   Cloudflare's **A record** alternative shown on the same screen instead.
5. Wait. DNS usually takes 5–30 minutes; it can take up to 24 hours.

**Before telling the client it's live**, check all four:

- `https://rosalias.com`
- `https://www.rosalias.com`
- `http://rosalias.com` (should redirect to https)
- The padlock shows a valid certificate

### Update `site.ts`

Once the domain is live, set the real URL — canonical tags, sitemap and OG tags
all read from it:

```ts
// src/config/site.ts
url: "https://rosalias.com",
```

Commit and push. The change is live in about a minute.

---

## Part 4 — Connect the contact form

We never run a backend. Pick one:

### Formspree

1. Sign up at **formspree.io** (free tier: 50 submissions/month).
2. **New Form** → name it → copy the endpoint, which looks like
   `https://formspree.io/f/xldbqwer`.
3. Put it in `src/config/site.ts`:
   ```ts
   FORM_ENDPOINT: "https://formspree.io/f/xldbqwer",
   ```
4. Push. **Then submit the form yourself and confirm the email arrives.**
5. In Formspree, set the notification email to the **client's** address.

### Web3Forms

1. Go to **web3forms.com**, enter the client's email, get an access key.
2. In `src/config/site.ts`:
   ```ts
   FORM_ENDPOINT: "https://api.web3forms.com/submit",
   FORM_ACCESS_KEY: "your-key-here",
   ```
3. Push, submit, confirm.

> Until `FORM_ENDPOINT` is set the form renders **visibly disabled** rather than
> silently swallowing messages. That is deliberate — a form that looks like it
> works and doesn't is worse than no form.

---

## Rolling back a bad deploy

1. Pages project → **Deployments**.
2. Find the last good one → **⋯** → **Rollback to this deployment**.

Instant. No build. This is why we don't need staging.

---

## When a build fails

Open the failed deployment in Cloudflare and read the log from the bottom up.

| Message | Cause | Fix |
|---|---|---|
| `Unsupported engine` / unexpected syntax | Node too old | Add `NODE_VERSION` = `22` (Part 2, step 7) |
| `Cannot find module` | Dependency not committed | Commit `package-lock.json` and push |
| `alt is required whenever photo is set` | Content missing alt text | Add `alt` to the content entry — this is the schema working as intended |
| Output directory not found | Wrong build settings | Output directory must be `dist`, command `npm run build` |
| Build succeeds, page is blank | Wrong `site` in astro.config | `SITE.url` must match the deployed URL |

If it built locally and fails on Cloudflare, it is almost always the Node
version or an uncommitted file. Check `git status` for anything untracked.

---

## Handover

When the site is the client's, hand over:

- Ownership of the GitHub repo (Settings → Collaborators, or transfer it)
- The Cloudflare Pages project (or keep it under our account as part of a
  maintenance arrangement — say which, in writing)
- The form provider login
- A filled-in `docs/handoff-packet-template.md`

Nothing else exists. There is no CMS, no database, no plugin, no server, and no
renewal — which is the entire point.
