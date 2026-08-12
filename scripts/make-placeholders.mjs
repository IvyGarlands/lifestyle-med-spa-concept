#!/usr/bin/env node
/**
 * make-placeholders.mjs — generates the FPO image set.
 *
 * Ambush mode ships demos before the operator has the client's real photos.
 * Those gaps get *tasteful neutral placeholders, clearly marked FPO* so they
 * are impossible to miss before sending (docs/ambush-workflow.md step 5).
 *
 * Deliberately ugly-on-purpose is wrong here — a demo has to look expensive —
 * so these are quiet warm-grey fields with a small FPO label and the intended
 * subject written on them. Obvious to us, inoffensive in a screenshot.
 *
 *   npm run placeholders
 */

import sharp from "sharp";
import { mkdirSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, resolve, join } from "node:path";

const here = dirname(fileURLToPath(import.meta.url));
const OUT = resolve(here, "../src/assets/images");
mkdirSync(OUT, { recursive: true });

/** name, width, height, subject label */
const SIZES = [
  ["fpo-hero-16x9", 2400, 1350, "HERO 16:9"],
  ["fpo-hero-4x5", 1600, 2000, "HERO 4:5"],
  ["fpo-wide-21x9", 2400, 1029, "WIDE 21:9"],
  ["fpo-landscape", 1800, 1200, "LANDSCAPE 3:2"],
  ["fpo-portrait", 1200, 1500, "PORTRAIT 4:5"],
  ["fpo-square", 1400, 1400, "SQUARE 1:1"],
];

const svg = (w, h, label) => {
  // Scale type with the smaller edge so every size reads the same.
  const unit = Math.min(w, h);
  const mark = Math.round(unit * 0.075);
  const sub = Math.round(unit * 0.028);
  const stripe = Math.round(unit * 0.06);

  return Buffer.from(`
<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}" viewBox="0 0 ${w} ${h}">
  <defs>
    <pattern id="d" width="${stripe}" height="${stripe}"
             patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
      <rect width="${stripe}" height="${stripe}" fill="#e8e3da"/>
      <rect width="${stripe / 2}" height="${stripe}" fill="#e2ddd3"/>
    </pattern>
  </defs>
  <rect width="${w}" height="${h}" fill="url(#d)"/>
  <rect x="${unit * 0.02}" y="${unit * 0.02}"
        width="${w - unit * 0.04}" height="${h - unit * 0.04}"
        fill="none" stroke="#c9c2b5" stroke-width="${Math.max(2, unit * 0.003)}"/>
  <g font-family="Helvetica, Arial, sans-serif" text-anchor="middle" fill="#8b8069">
    <text x="${w / 2}" y="${h / 2}" font-size="${mark}" font-weight="700"
          letter-spacing="${mark * 0.12}">FPO</text>
    <text x="${w / 2}" y="${h / 2 + sub * 2.2}" font-size="${sub}"
          font-weight="500" letter-spacing="${sub * 0.18}">${label}</text>
    <text x="${w / 2}" y="${h - unit * 0.055}" font-size="${sub * 0.8}"
          font-weight="500" letter-spacing="${sub * 0.15}"
          fill="#a2997f">REPLACE BEFORE SENDING</text>
  </g>
</svg>`);
};

let made = 0;
for (const [name, w, h, label] of SIZES) {
  const file = join(OUT, `${name}.jpg`);
  await sharp(svg(w, h, label))
    .jpeg({ quality: 82, mozjpeg: true })
    .toFile(file);
  console.log(`  ${name}.jpg  ${w}×${h}`);
  made++;
}

/* A 1200x630 OG placeholder lives in /public — it is referenced by URL, not
   imported, so it never goes through astro:assets. */
const PUB = resolve(here, "../public");
mkdirSync(PUB, { recursive: true });
await sharp(svg(1200, 630, "OPEN GRAPH 1200×630"))
  .jpeg({ quality: 82, mozjpeg: true })
  .toFile(join(PUB, "og-default.jpg"));
console.log("  public/og-default.jpg  1200×630");

console.log(`\n✓ ${made + 1} FPO placeholders generated.`);
