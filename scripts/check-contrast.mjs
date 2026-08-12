#!/usr/bin/env node
/**
 * check-contrast.mjs — enforces the accessibility half of the tokens contract.
 *
 * Parses src/styles/tokens.css, resolves the var() chains in :root, .on-dark
 * and .on-brand, then asserts every ink/surface pair the design system can
 * actually produce — plus hero type over the scrim on a worst-case photo.
 *
 * Run it after EVERY reskin. That is the whole point of putting brand
 * personality in tokens: the palette can change, the guarantee cannot.
 *
 *   npm run check:contrast
 *
 * Exits non-zero on any failure so it can gate a build or a commit.
 */

import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, resolve } from "node:path";
import {
  baseLayer,
  parseBlocks,
  checkContext,
  checkScrim,
  AA_TEXT,
} from "./lib/contrast.mjs";

const here = dirname(fileURLToPath(import.meta.url));
const TOKENS = resolve(here, "../src/styles/tokens.css");

const base = baseLayer(readFileSync(TOKENS, "utf8"));
const root = parseBlocks(base, ":root");
const onDark = { ...root, ...parseBlocks(base, ".on-dark") };
const onBrand = { ...root, ...parseBlocks(base, ".on-brand") };

const CONTEXTS = [
  {
    name: ":root (light)",
    scope: root,
    // Feedback colours and the inverse surface only exist in the light context.
    extraInks: [
      ["--color-ok", AA_TEXT],
      ["--color-warn", AA_TEXT],
      ["--color-err", AA_TEXT],
    ],
    extraFills: [["--color-surface-inverse", "--color-ink-inverse", AA_TEXT]],
  },
  { name: ".on-dark", scope: onDark },
  { name: ".on-brand", scope: onBrand },
];

let checks = 0;
const failures = [];

for (const ctx of CONTEXTS) {
  console.log(`\n── ${ctx.name} ─────────────────────────────────`);
  for (const r of checkContext(ctx.scope, ctx)) {
    checks++;
    console.log(
      `${r.ok ? "PASS" : "FAIL"}  ${r.r.toFixed(2).padStart(6)}:1  (min ${r.min.toFixed(1)})  ${r.label}`
    );
    if (!r.ok) failures.push(`${ctx.name}: ${r.label} — ${r.r.toFixed(2)}:1`);
  }
}

console.log(`\n── overlays ───────────────────────────────────`);
const scrim = checkScrim(root);
checks++;
console.log(
  `${scrim.ok ? "PASS" : "FAIL"}  ${scrim.r.toFixed(2).padStart(6)}:1  (min ${scrim.min.toFixed(1)})  ${scrim.label}`
);
if (!scrim.ok) failures.push(`scrim: ${scrim.label}`);

console.log(`\n${checks} checks run.`);
if (failures.length) {
  console.error(`\n✗ ${failures.length} CONTRAST FAILURE(S):`);
  for (const f of failures) console.error(`  - ${f}`);
  console.error(
    "\nFix the primitive in tokens.css §1, or remap the semantic in §3/§10.\n" +
      "Do NOT fix this in a component.\n"
  );
  process.exit(1);
}
console.log("✓ Token palette holds WCAG AA across every declared pairing.\n");
