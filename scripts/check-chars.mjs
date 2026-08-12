#!/usr/bin/env node
/**
 * check-chars.mjs — catches invisible characters that break code silently.
 *
 * Written after a non-breaking space (U+00A0) inside a template literal shipped
 * a headline that rendered as "lineby", and after homoglyph characters landed
 * in hex colour values in the recipe book. Both are invisible in an editor and
 * neither is ever intentional in source.
 *
 * Flags:
 *   U+00A0  non-breaking space      — breaks string spacing and CSS wrapping
 *   U+200B  zero-width space        — invisible, breaks identifiers and hex
 *   U+200C/D zero-width joiners     — same
 *   U+FEFF  BOM in mid-file         — breaks parsers
 *   Cyrillic/Greek homoglyphs in hex colours and identifiers
 *
 * Deliberately does NOT flag legitimate typography in comments and UI copy —
 * em dashes, §, accented characters and curly quotes are all fine and we use
 * them everywhere.
 *
 *   npm run check:chars
 */

import { readdirSync, readFileSync, statSync } from "node:fs";
import { join, extname, relative } from "node:path";
import { fileURLToPath } from "node:url";
import { dirname, resolve } from "node:path";

const here = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(here, "..");
const SCAN = ["src", "scripts", "docs"];
const EXTS = new Set([".ts", ".js", ".mjs", ".astro", ".css", ".json", ".md", ".sh"]);

/** Invisible characters that are never intentional in our source. */
const INVISIBLE = [
  ["\u00A0", "U+00A0 non-breaking space"],
  ["\u200B", "U+200B zero-width space"],
  ["\u200C", "U+200C zero-width non-joiner"],
  ["\u200D", "U+200D zero-width joiner"],
  ["\u2060", "U+2060 word joiner"],
];

/** Latin-lookalikes that corrupt hex colours and identifiers. */
const HOMOGLYPH = /[\u0400-\u04FF\u0370-\u03FF]/;

function walk(dir, out = []) {
  for (const entry of readdirSync(dir)) {
    if (entry === "node_modules" || entry === "dist" || entry === ".astro") continue;
    const full = join(dir, entry);
    if (statSync(full).isDirectory()) walk(full, out);
    else if (EXTS.has(extname(entry))) out.push(full);
  }
  return out;
}

const files = SCAN.flatMap((d) => {
  try {
    return walk(join(ROOT, d));
  } catch {
    return [];
  }
});

const problems = [];

for (const file of files) {
  const text = readFileSync(file, "utf8");
  const rel = relative(ROOT, file);

  text.split("\n").forEach((line, i) => {
    for (const [ch, label] of INVISIBLE) {
      if (line.includes(ch)) {
        problems.push(
          `${rel}:${i + 1}  ${label}\n      ${line.trim().slice(0, 90)}`
        );
      }
    }

    // Homoglyphs only matter where they corrupt machine-read values. A
    // Cyrillic character inside a hex colour or a token name is always a bug;
    // one inside prose might be a legitimate quotation.
    if (HOMOGLYPH.test(line)) {
      const risky =
        /#[0-9a-fA-F\u0400-\u04FF\u0370-\u03FF]{3,8}\b/.test(line) ||
        /--[\w\u0400-\u04FF\u0370-\u03FF-]+\s*:/.test(line);
      if (risky) {
        problems.push(
          `${rel}:${i + 1}  non-Latin character in a hex colour or token name\n      ${line.trim().slice(0, 90)}`
        );
      }
    }
  });

  // A BOM is only acceptable at byte 0, and we would rather not have one at all.
  if (text.includes("\uFEFF")) {
    problems.push(`${rel}  contains U+FEFF (byte-order mark)`);
  }
}

console.log(`Scanned ${files.length} files.`);

if (problems.length) {
  console.error(`\n✗ ${problems.length} invisible-character problem(s):\n`);
  for (const p of problems) console.error(`  ${p}`);
  console.error(
    "\nThese are invisible in an editor and never intentional. Replace with the\n" +
      "plain ASCII equivalent.\n"
  );
  process.exit(1);
}

console.log("✓ No invisible or homoglyph characters in source.\n");
