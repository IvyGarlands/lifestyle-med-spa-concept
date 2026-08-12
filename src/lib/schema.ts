/**
 * schema.ts — JSON-LD generation.
 *
 * The page and the structured data read from the SAME source
 * (src/config/site.ts), so they cannot disagree — which is the failure mode
 * Google actually penalises: hours in the markup that contradict hours in the
 * schema.
 *
 * Must validate with ZERO errors in Google's Rich Results Test before ship
 * (CLAUDE.md §7).
 */

import { SITE, SCHEMA_TYPE, type Vertical } from "../config/site";

const DAY_NAMES: Record<string, string> = {
  monday: "Monday",
  tuesday: "Tuesday",
  wednesday: "Wednesday",
  thursday: "Thursday",
  friday: "Friday",
  saturday: "Saturday",
  sunday: "Sunday",
};

/** Only days with real open/close times become specifications. A closed day is
 *  expressed by its absence — emitting it with null times is a schema error. */
function openingHours() {
  return Object.entries(SITE.hours)
    .filter(([, h]) => h.open && h.close)
    .map(([day, h]) => ({
      "@type": "OpeningHoursSpecification",
      dayOfWeek: `https://schema.org/${DAY_NAMES[day]}`,
      opens: h.open,
      closes: h.close,
    }));
}

export interface BusinessSchemaOptions {
  /** Absolute URL of the page this schema is embedded in. */
  pageUrl: string;
  /** Absolute URL of the primary image. */
  imageUrl?: string;
  /** Restaurants/bakeries: "$", "$$", "$$$". */
  priceRange?: string;
  /** Restaurants: link to the menu page. */
  menuUrl?: string;
  /** Cuisine, treatment types, practice areas — vertical-appropriate. */
  servesCuisine?: string[];
}

export function businessSchema(opts: BusinessSchemaOptions) {
  const type = SCHEMA_TYPE[SITE.vertical as Vertical] ?? "LocalBusiness";
  const hours = openingHours();

  const node: Record<string, unknown> = {
    "@context": "https://schema.org",
    "@type": type,
    "@id": `${SITE.url}/#business`,
    name: SITE.legalName || SITE.name,
    url: SITE.url,
    telephone: SITE.phone,
    address: {
      "@type": "PostalAddress",
      streetAddress: SITE.address.street,
      addressLocality: SITE.address.locality,
      addressRegion: SITE.address.region,
      postalCode: SITE.address.postalCode,
      addressCountry: SITE.address.country,
    },
  };

  if (SITE.tagline) node.description = SITE.tagline;
  if (SITE.email) node.email = SITE.email;
  if (opts.imageUrl) node.image = opts.imageUrl;
  if (SITE.geo) {
    node.geo = {
      "@type": "GeoCoordinates",
      latitude: SITE.geo.lat,
      longitude: SITE.geo.lng,
    };
  }
  if (hours.length) node.openingHoursSpecification = hours;
  if (opts.priceRange) node.priceRange = opts.priceRange;
  if (opts.menuUrl) node.hasMenu = opts.menuUrl;
  if (opts.servesCuisine?.length) node.servesCuisine = opts.servesCuisine;

  const social = Object.values(SITE.social).filter(Boolean);
  if (social.length) node.sameAs = social;

  return node;
}

/** FAQPage. Only emit when the page genuinely renders these Q&As visibly —
 *  Google treats hidden FAQ markup as a violation. */
export function faqSchema(items: { question: string; answer: string }[]) {
  if (!items.length) return null;
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: items.map((i) => ({
      "@type": "Question",
      name: i.question,
      acceptedAnswer: { "@type": "Answer", text: i.answer },
    })),
  };
}

/** Breadcrumbs for inner pages. */
export function breadcrumbSchema(trail: { name: string; url: string }[]) {
  if (trail.length < 2) return null;
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: trail.map((t, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: t.name,
      item: t.url,
    })),
  };
}
