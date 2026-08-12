#!/usr/bin/env bash
#
# new-client.sh — scaffold a fresh client project from the engine.
#
#   ./scripts/new-client.sh
#   ./scripts/new-client.sh --name "Vinny's Auto Body" --vertical auto
#   ./scripts/new-client.sh --ambush --name "Vinny's Auto Body" --vertical auto
#
# Creates a SIBLING directory (../client-<slug>, or ../ambush-<slug> with
# --ambush), copies the engine into it, rewrites the identity in
# src/config/site.ts, strips the reference build, and runs git init.
#
# --ambush additionally sets isConcept = true, which turns on the concept
# badge AND emits noindex,nofollow. That pairing is deliberate: a demo must
# never be indexable under the real business's name.

set -euo pipefail

ENGINE_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
PARENT_DIR="$(dirname "$ENGINE_DIR")"

NAME=""
VERTICAL=""
AMBUSH=false

VERTICALS="restaurant venue bakery salon studio auto autodetail homeservices contractor medspa dental legal financial vet"

die() { printf '\nError: %s\n\n' "$1" >&2; exit 1; }

while [[ $# -gt 0 ]]; do
  case "$1" in
    --name)     NAME="${2:-}"; shift 2 ;;
    --vertical) VERTICAL="${2:-}"; shift 2 ;;
    --ambush)   AMBUSH=true; shift ;;
    -h|--help)
      sed -n '2,20p' "${BASH_SOURCE[0]}" | sed 's/^# \{0,1\}//'
      exit 0 ;;
    *) die "Unknown option: $1" ;;
  esac
done

# ---- prompt for anything not supplied ------------------------------------
if [[ -z "$NAME" ]]; then
  read -r -p "Business name: " NAME
fi
[[ -n "$NAME" ]] || die "A business name is required."

if [[ -z "$VERTICAL" ]]; then
  printf 'Verticals: %s\n' "$VERTICALS"
  read -r -p "Vertical: " VERTICAL
fi

# Validate against the real list — a typo here silently breaks the JSON-LD type.
case " $VERTICALS " in
  *" $VERTICAL "*) ;;
  *) die "Unknown vertical '$VERTICAL'. One of: $VERTICALS" ;;
esac

# ---- slug ------------------------------------------------------------------
# lowercase, strip anything not alphanumeric, collapse to single hyphens
SLUG="$(printf '%s' "$NAME" \
  | tr '[:upper:]' '[:lower:]' \
  | sed -E "s/[’']//g; s/[^a-z0-9]+/-/g; s/^-+|-+$//g")"
[[ -n "$SLUG" ]] || die "Could not derive a slug from '$NAME'."

if [[ "$AMBUSH" == true ]]; then
  TARGET="$PARENT_DIR/ambush-$SLUG"
else
  TARGET="$PARENT_DIR/client-$SLUG"
fi

[[ -e "$TARGET" ]] && die "$TARGET already exists."

# ---- copy ------------------------------------------------------------------
printf '\n  Scaffolding %s\n' "$TARGET"

mkdir -p "$TARGET"

# rsync keeps this readable and lets us exclude build artefacts in one place.
rsync -a \
  --exclude '.git' \
  --exclude 'node_modules' \
  --exclude 'dist' \
  --exclude '.astro' \
  --exclude 'input' \
  "$ENGINE_DIR/" "$TARGET/"

cd "$TARGET"

# ---- strip the reference build ---------------------------------------------
# The Rosalia's demo exists to show the engine working. A client project must
# start from a blank page, not from someone else's restaurant.
rm -rf src/pages/es
rm -f src/content/menu/*.json src/content/testimonials/*.json src/content/events/*.json
mkdir -p input/photos

cat > src/pages/index.astro <<'PAGE'
---
/**
 * Homepage. Compose sections here; never lay out inside a page.
 * See docs/ambush-workflow.md for the per-vertical section recipe.
 */
import BaseLayout from "../layouts/BaseLayout.astro";
import HeroSplit from "../components/sections/HeroSplit.astro";
import CTABand from "../components/sections/CTABand.astro";
import LocationContact from "../components/sections/LocationContact.astro";

import { SITE } from "../config/site";
import { useTranslations, localeFromUrl } from "../i18n/ui";
import heroImg from "../assets/images/fpo-hero-16x9.jpg";

const locale = localeFromUrl(Astro.url);
const t = useTranslations(locale);

const navLinks = [{ label: "Visit", href: "#contact" }];
---

<BaseLayout
  title="TODO — page title"
  description="TODO — 150 character meta description."
  path="/"
  navLinks={navLinks}
>
  <HeroSplit
    eyebrow="TODO"
    heading="TODO — the one line that has to land."
    body="TODO — two sentences in the owner's voice."
    image={heroImg}
    alt="TODO — describe this photo"
    ctaLabel={`${t("cta.call")} ${SITE.phone}`}
    ctaHref={`tel:${SITE.phoneHref}`}
  />

  <LocationContact locale={locale} id="contact" />

  <CTABand
    heading="TODO — the closing ask."
    ctaLabel={`${t("cta.call")} ${SITE.phone}`}
    ctaHref={`tel:${SITE.phoneHref}`}
  />
</BaseLayout>
PAGE

# ---- rewrite identity in site.ts -------------------------------------------
# Escape for sed: the business name may contain & or /
ESCAPED_NAME="$(printf '%s' "$NAME" | sed -e 's/[&/\]/\\&/g')"

if [[ "$AMBUSH" == true ]]; then
  CONCEPT="true"
  URL="https://ambush-$SLUG.pages.dev"
else
  CONCEPT="false"
  URL="https://client-$SLUG.pages.dev"
fi

# BSD sed (macOS) needs the empty -i argument; GNU sed does not.
if sed --version >/dev/null 2>&1; then SEDI=(-i); else SEDI=(-i ''); fi

sed "${SEDI[@]}" \
  -e "s|^  name: \".*\",|  name: \"$ESCAPED_NAME\",|" \
  -e "s|^  legalName: \".*\",|  legalName: \"$ESCAPED_NAME\",|" \
  -e "s|^  vertical: \".*\" as Vertical,|  vertical: \"$VERTICAL\" as Vertical,|" \
  -e "s|^  url: \".*\",|  url: \"$URL\",|" \
  -e "s|^  isConcept: .*,|  isConcept: $CONCEPT,|" \
  src/config/site.ts

# The engine's own package name would collide in a workspace.
sed "${SEDI[@]}" -e "s|\"name\": \"website-engine\"|\"name\": \"$SLUG\"|" package.json

# ---- git --------------------------------------------------------------------
git init -q
git add -A
git commit -qm "Scaffold $NAME from engine" || true

printf '\n  Done.\n\n'
printf '  Next:\n'
printf '    cd %s\n' "$TARGET"
printf '    npm install\n'
printf '    # 1. paste the recipe primitives into src/styles/tokens.css §1\n'
printf '    # 2. swap the two Fontsource imports in src/layouts/BaseLayout.astro\n'
printf '    # 3. fill in src/config/site.ts (phone, address, hours, FORM_ENDPOINT)\n'
printf '    # 4. drop photos into src/assets/images/\n'
printf '    npm run dev\n'
printf '    npm run verify\n\n'

if [[ "$AMBUSH" == true ]]; then
  printf '  AMBUSH MODE: isConcept = true.\n'
  printf '  The concept badge renders and the page emits noindex,nofollow.\n'
  printf '  Do not turn either off. See CLAUDE.md §11.\n\n'
fi
