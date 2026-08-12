/**
 * site.ts — every site-wide fact, in one place.
 *
 * This is the second file (after tokens.css) that a new client project edits.
 * If a phone number, address or endpoint appears anywhere else in the codebase,
 * that is a bug — see CLAUDE.md §3.
 */

/** Drives the JSON-LD @type and the default recipe set. See CLAUDE.md §10a. */
export type Vertical =
  // hospitality & lifestyle
  | "restaurant"
  | "venue"
  | "bakery"
  | "salon"
  | "studio"
  // trades & professional services
  | "auto"
  | "autodetail"
  | "homeservices"
  | "contractor"
  | "medspa"
  | "dental"
  | "legal"
  | "financial"
  | "vet";

/** schema.org type per vertical. All inherit from LocalBusiness. */
export const SCHEMA_TYPE: Record<Vertical, string> = {
  restaurant: "Restaurant",
  venue: "EventVenue",
  bakery: "Bakery",
  salon: "HealthAndBeautyBusiness",
  studio: "SportsActivityLocation",
  auto: "AutoRepair",
  autodetail: "AutoWash",
  homeservices: "HomeAndConstructionBusiness",
  contractor: "GeneralContractor",
  medspa: "MedicalBusiness",
  dental: "Dentist",
  legal: "Attorney",
  financial: "FinancialService",
  vet: "VeterinaryCare",
};

export interface DayHours {
  /** 24h "HH:MM". Omit both for a closed day. */
  open?: string;
  close?: string;
  /** Optional note shown instead of times, e.g. "Kitchen closes 9pm". */
  note?: string;
}

export type Weekday =
  | "monday"
  | "tuesday"
  | "wednesday"
  | "thursday"
  | "friday"
  | "saturday"
  | "sunday";

/**
 * Hours live outside the `as const` SITE object on purpose. Inside it, each day
 * narrows to its own literal shape and a closed day loses `.open`/`.close`
 * entirely, which makes every consumer fight the type system for no benefit.
 */
export const HOURS: Record<Weekday, DayHours> = {
  monday: { note: "Closed" },
  tuesday: { open: "17:00", close: "22:00" },
  wednesday: { open: "17:00", close: "22:00" },
  thursday: { open: "17:00", close: "22:00" },
  friday: { open: "17:00", close: "23:00" },
  saturday: { open: "16:00", close: "23:00" },
  sunday: { open: "16:00", close: "21:00" },
};

export const WEEKDAYS: readonly Weekday[] = [
  "monday",
  "tuesday",
  "wednesday",
  "thursday",
  "friday",
  "saturday",
  "sunday",
];

export const SITE = {
  /* ---- identity ---------------------------------------------------- */
  name: "Lifestyle Med Spa",
  legalName: "Lifestyle Med Spa",
  /** One line, under 90 chars. Used in the footer and as an OG fallback. */
  tagline: "Hand-rolled pasta and coal-fired pizza on Federal Hill since 1974.",
  vertical: "medspa" as Vertical,

  /** Production URL. Cloudflare Pages gives you a *.pages.dev to start with. */
  url: "https://ambush-lifestyle-med-spa.pages.dev",

  /* ---- contact ------------------------------------------------------ */
  phone: "(401) 555-0142",
  /** E.164, for the tel: href. Never format this one. */
  phoneHref: "+14015550142",
  email: "hello@rosalias.example",

  address: {
    street: "218 Atwells Avenue",
    locality: "Providence",
    region: "RI",
    postalCode: "02903",
    country: "US",
  },

  /** Used by the map facade and the LocalBusiness schema. */
  geo: { lat: 41.8236, lng: -71.4222 },

  /** Deep link for the directions button. Place ID beats a coordinate string. */
  mapsUrl: "https://maps.google.com/?q=218+Atwells+Avenue+Providence+RI",

  /* ---- hours --------------------------------------------------------
     Defined as HOURS above. Drives both HoursTable and openingHours in
     JSON-LD, so the page and the schema can never disagree.               */
  hours: HOURS,

  /* ---- forms ---------------------------------------------------------
     One value, swapped per client. Formspree: https://formspree.io/f/xxxx
     Web3Forms: https://api.web3forms.com/submit (+ access_key below).
     Leave FORM_ENDPOINT empty during a demo build — ContactForm renders a
     disabled state rather than silently posting into the void.             */
  FORM_ENDPOINT: "",
  /** Web3Forms only. Formspree ignores this. */
  FORM_ACCESS_KEY: "",

  /* ---- social -------------------------------------------------------- */
  social: {
    instagram: "https://instagram.com/",
    facebook: "https://facebook.com/",
    yelp: "",
    tripadvisor: "",
  },

  /* ---- i18n ---------------------------------------------------------- */
  defaultLocale: "en",
  locales: ["en", "es"] as const,

  /* ---- SEO defaults --------------------------------------------------- */
  /** Fallback OG image, 1200x630, lives in /public. */
  ogImage: "/og-default.jpg",
  twitterHandle: "",

  /* ---- ambush mode ----------------------------------------------------
     When `isConcept` is true, BaseLayout renders the ConceptBadge and emits
     <meta name="robots" content="noindex,nofollow">. A demo must never be
     indexed under the real business's name. Scaffolding an ambush project
     sets this to true; a real client build sets it to false.               */
  isConcept: true,
  studioName: "Looking Glass Labs",
  studioUrl: "",

  /* ---- regulated verticals -------------------------------------------
     Client-supplied, verbatim, or empty. Never authored by us — CLAUDE.md §11.
     Rendered in the footer when non-empty.                                */
  licenseNumber: "",
  legalDisclaimer: "",
} as const;

export type SiteConfig = typeof SITE;
