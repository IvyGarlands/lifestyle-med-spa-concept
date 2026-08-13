#!/usr/bin/env bash
#
# build-pdf.sh — render the deck to a PDF you can attach to an email.
#
# Chrome is used rather than a library because it is the same engine that
# renders the deck in a browser, so what you see is what you send. The
# @page rule in index.html sets 297x167mm (16:9), which is why no scaling
# flag is needed here.
#
#   ./build-pdf.sh
#
set -euo pipefail

HERE="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
CHROME="/Applications/Google Chrome.app/Contents/MacOS/Google Chrome"

if [[ ! -x "$CHROME" ]]; then
  echo "Google Chrome not found at: $CHROME" >&2
  echo "Open index.html in any browser and print to PDF instead." >&2
  exit 1
fi

"$CHROME" \
  --headless \
  --disable-gpu \
  --no-pdf-header-footer \
  --print-to-pdf="$HERE/lifestyle-med-spa-concept.pdf" \
  "file://$HERE/index.html" 2>/dev/null

echo "Wrote $HERE/lifestyle-med-spa-concept.pdf"
