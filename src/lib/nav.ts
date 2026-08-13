/**
 * nav.ts — one navigation, used by every page.
 *
 * Ordered the way a visitor's questions arrive, not the way an org chart is
 * drawn: what we treat first, who we are second, how to reach us last. Their
 * current site opens with About and puts the treatments behind four dropdowns.
 */
export const NAV = [
  { label: "Weight loss", href: "/weight-loss" },
  { label: "Wellness & IV", href: "/wellness" },
  { label: "Aesthetics", href: "/aesthetics" },
  { label: "Skincare", href: "/skincare" },
  { label: "Our team", href: "/team" },
  { label: "Visit", href: "/contact" },
];

/** The four things we do. Used by the nav, the pillar grid and the footer. */
export const PILLARS = [
  {
    slug: "weight-loss",
    title: "Weight management",
    blurb:
      "Physician-directed weight loss built around GLP-1 medication, with the nutrition and lifestyle work that makes it hold.",
  },
  {
    slug: "wellness",
    title: "Wellness & IV",
    blurb:
      "Vitamin IV drips, NAD+, probiotics and vitamin injections, for energy, recovery and immunity.",
  },
  {
    slug: "aesthetics",
    title: "Aesthetics",
    blurb:
      "Neuromodulators, HydraFacial, plasma fibroblast and professional facials, delivered by our clinical team.",
  },
  {
    slug: "skincare",
    title: "Medical skincare",
    blurb:
      "ZO Skin Health and Circadia, prescribed to your skin rather than sold off a shelf.",
  },
];

/**
 * Where we see patients. Their own service-area pages, consolidated.
 *
 * Their site currently publishes roughly 190 near-identical pages built by
 * multiplying ~14 treatments across ~28 city names. That pattern is a real
 * liability now — search engines treat it as doorway content — and it is also
 * unmaintainable by hand. One service-area page with a real photograph per
 * community covers the same ground honestly. See the handoff notes.
 */
export const AREAS = [
  { slug: "agoura-hills", name: "Agoura Hills", note: "Our clinic" },
  { slug: "westlake-village", name: "Westlake Village" },
  { slug: "thousand-oaks", name: "Thousand Oaks" },
  { slug: "calabasas", name: "Calabasas" },
  { slug: "sherman-oaks", name: "Sherman Oaks" },
  { slug: "encino", name: "Encino" },
  { slug: "malibu", name: "Malibu" },
  { slug: "simi-valley", name: "Simi Valley" },
  { slug: "camarillo", name: "Camarillo" },
  { slug: "oxnard", name: "Oxnard" },
  { slug: "los-angeles", name: "Los Angeles" },
];
