/**
 * contrast.mjs — shared colour maths + tokens.css parsing.
 *
 * Used by:
 *   scripts/check-contrast.mjs   (the live palette in src/styles/tokens.css)
 *   scripts/check-recipes.mjs    (every palette in docs/design-recipes.md)
 *
 * Keeping these in one place means a recipe cannot pass a weaker test than the
 * shipping palette does.
 */

/* ---------- CSS parsing ---------------------------------------------- */

/** Read from `open` (index of a `{`) to its balancing `}`. */
export function balanced(src, open) {
  let depth = 0;
  for (let i = open; i < src.length; i++) {
    if (src[i] === "{") depth++;
    else if (src[i] === "}" && --depth === 0)
      return { body: src.slice(open + 1, i), end: i };
  }
  throw new Error("Unbalanced braces");
}

/** Drop comments and every @media block, leaving only unconditional rules. */
export function baseLayer(css) {
  let s = css.replace(/\/\*[\s\S]*?\*\//g, "");
  for (;;) {
    const at = s.search(/@media[^{]*\{/);
    if (at === -1) return s;
    const { end } = balanced(s, s.indexOf("{", at));
    s = s.slice(0, at) + s.slice(end + 1);
  }
}

/**
 * Collect `--name: value` pairs from EVERY block with this selector, merged in
 * source order — tokens.css deliberately splits :root across sections, and a
 * later declaration wins exactly as the cascade would resolve it.
 */
export function parseBlocks(src, selector) {
  const re = new RegExp(
    `(?:^|[};])\\s*${selector.replace(".", "\\.")}\\s*\\{`,
    "g"
  );
  const out = {};
  let found = 0;
  let m;
  while ((m = re.exec(src)) !== null) {
    const { body, end } = balanced(src, src.indexOf("{", m.index));
    found++;
    for (const d of body.matchAll(/(--[\w-]+)\s*:\s*([^;]+);/g)) {
      out[d[1]] = d[2].trim();
    }
    re.lastIndex = end;
  }
  if (!found) throw new Error(`Block not found: ${selector}`);
  return out;
}

/** Pull loose `--name: value;` declarations out of a bare snippet. */
export function parseDeclarations(src) {
  const out = {};
  for (const d of src.replace(/\/\*[\s\S]*?\*\//g, "").matchAll(
    /(--[\w-]+)\s*:\s*([^;]+);/g
  )) {
    out[d[1]] = d[2].trim();
  }
  return out;
}

/* ---------- token resolution ------------------------------------------ */

/** Follow var(--x) chains until we land on a literal value. */
export function resolveToken(scope, token, seen = new Set()) {
  const v = scope[token];
  if (v === undefined) throw new Error(`Undefined token: ${token}`);
  const m = v.match(/^var\(\s*(--[\w-]+)\s*\)$/);
  if (m) {
    if (seen.has(m[1])) throw new Error(`Circular token: ${token}`);
    seen.add(m[1]);
    return resolveToken(scope, m[1], seen);
  }
  return v;
}

/* ---------- colour ----------------------------------------------------- */

/** #rgb / #rrggbb / rgb(r g b / a), composited over a known backdrop. */
export function toRgb(value, backdrop) {
  const v = value.trim();
  let m = v.match(/^#([0-9a-f]{3}|[0-9a-f]{6})$/i);
  if (m) {
    let h = m[1];
    if (h.length === 3) h = h.split("").map((c) => c + c).join("");
    const n = parseInt(h, 16);
    return [(n >> 16) & 255, (n >> 8) & 255, n & 255];
  }
  m = v.match(
    /^rgba?\(\s*([\d.]+)[\s,]+([\d.]+)[\s,]+([\d.]+)\s*(?:[/,]\s*([\d.]+))?\s*\)$/i
  );
  if (m) {
    const rgb = [+m[1], +m[2], +m[3]];
    const a = m[4] === undefined ? 1 : +m[4];
    if (a === 1) return rgb;
    if (!backdrop) throw new Error(`Translucent colour needs a backdrop: ${v}`);
    return rgb.map((c, i) => Math.round(a * c + (1 - a) * backdrop[i]));
  }
  throw new Error(`Cannot parse colour: ${v}`);
}

const chan = (c) => {
  const s = c / 255;
  return s <= 0.04045 ? s / 12.92 : ((s + 0.055) / 1.055) ** 2.4;
};

export const luminance = ([r, g, b]) =>
  0.2126 * chan(r) + 0.7152 * chan(g) + 0.0722 * chan(b);

export function ratio(a, b) {
  const x = luminance(a);
  const y = luminance(b);
  return (Math.max(x, y) + 0.05) / (Math.min(x, y) + 0.05);
}

/* ---------- the pair matrix -------------------------------------------- */

export const AA_TEXT = 4.5; // body copy
export const AA_LARGE = 3.0; // >=24px, or >=18.66px bold
export const AA_UI = 3.0; // meaningful non-text boundaries

const SURFACES = [
  "--color-canvas",
  "--color-surface",
  "--color-surface-sunken",
];

const INKS = [
  ["--color-ink", AA_TEXT],
  ["--color-ink-strong", AA_TEXT],
  ["--color-ink-muted", AA_TEXT],
  ["--color-brand", AA_TEXT],
  ["--color-accent", AA_TEXT],
  ["--color-line-strong", AA_UI],
  ["--color-focus", AA_UI],
];

const FILLS = [
  ["--color-brand", "--color-brand-contrast", AA_TEXT],
  ["--color-accent", "--color-accent-contrast", AA_TEXT],
];

/**
 * Check one context (a resolved token scope) against the full matrix.
 * Returns { checks, failures: [{label, r, min}] }.
 */
export function checkContext(scope, { extraInks = [], extraFills = [] } = {}) {
  const results = [];
  for (const surfaceTok of SURFACES) {
    const surface = toRgb(resolveToken(scope, surfaceTok));
    for (const [inkTok, min] of [...INKS, ...extraInks]) {
      const ink = toRgb(resolveToken(scope, inkTok), surface);
      const r = ratio(ink, surface);
      results.push({ label: `${inkTok} on ${surfaceTok}`, r, min, ok: r >= min });
    }
  }
  for (const [fillTok, inkTok, min] of [...FILLS, ...extraFills]) {
    const fill = toRgb(resolveToken(scope, fillTok));
    const ink = toRgb(resolveToken(scope, inkTok), fill);
    const r = ratio(ink, fill);
    results.push({
      label: `${inkTok} on ${fillTok} fill`,
      r,
      min,
      ok: r >= min,
    });
  }
  return results;
}

/**
 * Type overlaid on photography is only legible because of the scrim. Model the
 * worst realistic case: the scrim at its declared strength over a MID-GREY
 * photo (a bright photo is the real hazard; #808080 stands in for "not dark").
 * Hero display type must clear AA-large against that.
 */
export function checkScrim(scope) {
  const strength = parseFloat(resolveToken(scope, "--scrim-strength"));
  const scrimRgb = resolveToken(scope, "--color-overlay-scrim")
    .split(/\s+/)
    .map(Number);
  const midPhoto = [128, 128, 128];
  const composited = scrimRgb.map((c, i) =>
    Math.round(strength * c + (1 - strength) * midPhoto[i])
  );
  const heroInk = toRgb(resolveToken(scope, "--n-000"));
  const r = ratio(heroInk, composited);
  return {
    label: `hero ink over scrim(${strength}) on mid-grey photo`,
    r,
    min: AA_LARGE,
    ok: r >= AA_LARGE,
  };
}
