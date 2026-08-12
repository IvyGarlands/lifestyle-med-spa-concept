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
/**
 * Hours, verbatim from lifestylehealthservices.com — they publish them
 * identically in their contact block and their footer:
 *   "Monday & Wednesday: 9:00 AM to 1:00 PM"
 *   "Tuesday & Thursday: 9:00 AM to 5:00 PM"
 *   "Friday - Sunday: Closed"
 *
 * Fresha lists Mon–Fri 9:00–16:30 instead. That listing states on its own page
 * that the business "is not currently affiliated with or partnered with
 * Fresha" and is built from public data, so it is not a primary source. The
 * conflict is logged in input/facts.txt §2.
 *
 * Four open days, 28 hours a week. Small, and the page must not imply
 * otherwise — which is precisely why the texting line matters enough to be a
 * first-class CTA.
 */
export const HOURS: Record<Weekday, DayHours> = {
  monday: { open: "09:00", close: "13:00" },
  tuesday: { open: "09:00", close: "17:00" },
  wednesday: { open: "09:00", close: "13:00" },
  thursday: { open: "09:00", close: "17:00" },
  friday: { note: "Closed" },
  saturday: { note: "Closed" },
  sunday: { note: "Closed" },
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
  /* ---- identity ----------------------------------------------------
     NAME CONFLICT, resolved deliberately. Their domain and their Yelp
     listing say "Lifestyle Health Services". Their wordmark, their page
     title and 100% of their own body copy say "Lifestyle Med Spa". The
     previous concept (004) led with the legal name; that was the wrong call
     against their own branding, and it is corrected here. See
     input/facts.txt §1.                                                  */
  name: "Lifestyle Med Spa",
  legalName: "Lifestyle Health Services",
  /** Their own H1, verbatim. Not a line we wrote. */
  tagline: "Weight Loss Clinic of Agoura Hills, CA",
  vertical: "medspa" as Vertical,

  /**
   * NAMING RULE: the deployed URL must never contain the word "ambush" —
   * it lands in the canonical, in og:url and in the JSON-LD @id, and the
   * recipient is one right-click away from reading it. Only the local
   * directory keeps the ambush- prefix.
   */
  url: "https://lifestyle-med-spa-concept.pages.dev",

  /* ---- contact ------------------------------------------------------ */
  phone: "(818) 206-3066",
  /** E.164, for the tel: href. Never format this one. */
  phoneHref: "+18182063066",
  /**
   * A SEPARATE PUBLISHED TEXTING LINE. Their footer labels it "Texting:"
   * distinctly from "Office:". Unusual, real, and a genuine accommodation
   * for a practice that is closed three days a week — so it is treated as a
   * first-class CTA next to the phone, not a footnote.
   */
  textPhone: "(805) 391-2314",
  textPhoneHref: "+18053912314",
  email: "info@lifestylehealthservices.com",

  address: {
    street: "30497 Canwood St, Ste 200",
    locality: "Agoura Hills",
    region: "CA",
    postalCode: "91301",
    country: "US",
  },

  /**
   * NULL, deliberately. No primary source publishes coordinates for this
   * suite, and a lat/lng I derived myself would be a fabricated fact
   * rendered as a map pin — the one kind of error that is both invisible in
   * review and unforgivable in person. The schema omits `geo` (lib/schema.ts
   * already guards on it) and the directions link resolves the address by
   * text, which is what Google does with it anyway.
   */
  geo: null as { lat: number; lng: number } | null,

  /** Deep link for the directions button. */
  mapsUrl:
    "https://maps.google.com/?q=30497+Canwood+St+Ste+200+Agoura+Hills+CA+91301",

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
    instagram: "https://www.instagram.com/lifestylemedspa/",
    facebook: "https://www.facebook.com/lifestylehealthservicesagoura",
    yelp: "",
    tripadvisor: "",
  },

  /* ---- i18n ----------------------------------------------------------
     ENGLISH ONLY, per the brief. The locale list is what drives the i18n
     routing, the hreflang block and the sitemap's locale map — trimming it
     here is the single edit, and SEOHead now suppresses hreflang entirely
     when there is only one locale.                                        */
  defaultLocale: "en",
  locales: ["en"] as const,

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
     Never authored by us — CLAUDE.md §11.

     licenseNumber: EMPTY. Their LegitScript seal (ID 18388123) links to a
     lookup gated behind a reCAPTCHA, which I will not complete, so the
     certification is UNVERIFIED and is not republished. Their HIPAA badge is
     a graphic with no issuing body behind it. Neither ships. See
     input/facts.txt §6.

     legalDisclaimer: the third-party trademark line. Mounjaro, Ozempic,
     Wegovy and Zepbound are other companies' marks and appear on this page
     only inside a factual list of medications the practice works with.       */
  licenseNumber: "",
  legalDisclaimer:
    "Mounjaro, Ozempic, Wegovy and Zepbound are registered trademarks of their respective owners. Listing a medication is not a claim of affiliation with or endorsement by its manufacturer. Prescription treatment is provided only where clinically appropriate, following evaluation by a licensed provider.",
} as const;

export type SiteConfig = typeof SITE;
