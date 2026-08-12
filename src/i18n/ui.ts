/**
 * ui.ts — structural microcopy only.
 *
 * The ONE exception to "all content lives in content collections" (CLAUDE.md
 * §3): strings that are part of a component's mechanics rather than the
 * business's voice. "Skip to content" is ours; "Hand-rolled pasta since 1974"
 * is theirs and belongs in a collection.
 *
 * Adding a language is a content task: add a block here, add `lang: 'xx'`
 * entries to the collections, add the locale to src/config/site.ts.
 */

import { SITE } from "../config/site";

export type Locale = (typeof SITE.locales)[number];

export const ui = {
  en: {
    "skip.content": "Skip to content",
    "nav.label": "Main",
    "nav.open": "Open menu",
    "nav.close": "Close menu",
    "nav.toggle": "Menu",

    "cta.call": "Call",
    "cta.callNow": "Call now",
    "cta.directions": "Get directions",
    "cta.viewMenu": "View menu",
    "cta.book": "Book now",
    "cta.inquire": "Make an inquiry",
    "cta.consultation": "Request a consultation",
    "cta.newPatient": "New patient? Start here",
    "cta.quote": "Get a free quote",
    "cta.viewAll": "View all",
    "cta.readMore": "Read more",

    "hours.title": "Hours",
    "hours.closed": "Closed",
    "hours.today": "Today",
    "hours.openNow": "Open now",
    "hours.closedNow": "Closed now",

    "location.title": "Find us",
    "location.address": "Address",
    "location.phone": "Phone",
    "location.email": "Email",

    "map.activate": "Load interactive map",
    "map.note": "Loads Google Maps. Google may set cookies.",
    "map.staticAlt": "Map showing the location of",

    "gallery.label": "Photo gallery",
    "gallery.open": "View larger",
    "lightbox.close": "Close",
    "lightbox.prev": "Previous image",
    "lightbox.next": "Next image",
    "lightbox.counter": "of",

    "form.name": "Name",
    "form.email": "Email",
    "form.phone": "Phone",
    "form.date": "Date",
    "form.guests": "Number of guests",
    "form.message": "Message",
    "form.send": "Send",
    "form.sending": "Sending…",
    "form.success": "Thank you — we'll be in touch shortly.",
    "form.error": "Something went wrong. Please call us instead.",
    "form.required": "Required",
    "form.invalidEmail": "Enter a valid email address",
    "form.disabled": "This form is not connected yet.",

    "testimonials.title": "What people say",
    "testimonials.source": "via",

    "faq.title": "Common questions",

    "404.title": "Page not found",
    "404.body": "That page has moved or never existed.",
    "404.home": "Back to home",

    "concept.badge": "Concept redesign by",
    "concept.disclaimer": "Not affiliated with",

    "footer.rights": "All rights reserved.",
    "footer.builtBy": "Site by",
  },

  es: {
    "skip.content": "Saltar al contenido",
    "nav.label": "Principal",
    "nav.open": "Abrir menú",
    "nav.close": "Cerrar menú",
    "nav.toggle": "Menú",

    "cta.call": "Llamar",
    "cta.callNow": "Llame ahora",
    "cta.directions": "Cómo llegar",
    "cta.viewMenu": "Ver el menú",
    "cta.book": "Reservar",
    "cta.inquire": "Solicitar información",
    "cta.consultation": "Solicitar una consulta",
    "cta.newPatient": "¿Paciente nuevo? Empiece aquí",
    "cta.quote": "Pedir presupuesto gratis",
    "cta.viewAll": "Ver todo",
    "cta.readMore": "Leer más",

    "hours.title": "Horario",
    "hours.closed": "Cerrado",
    "hours.today": "Hoy",
    "hours.openNow": "Abierto ahora",
    "hours.closedNow": "Cerrado ahora",

    "location.title": "Dónde estamos",
    "location.address": "Dirección",
    "location.phone": "Teléfono",
    "location.email": "Correo electrónico",

    "map.activate": "Cargar mapa interactivo",
    "map.note": "Carga Google Maps. Google puede usar cookies.",
    "map.staticAlt": "Mapa con la ubicación de",

    "gallery.label": "Galería de fotos",
    "gallery.open": "Ver más grande",
    "lightbox.close": "Cerrar",
    "lightbox.prev": "Imagen anterior",
    "lightbox.next": "Imagen siguiente",
    "lightbox.counter": "de",

    "form.name": "Nombre",
    "form.email": "Correo electrónico",
    "form.phone": "Teléfono",
    "form.date": "Fecha",
    "form.guests": "Número de personas",
    "form.message": "Mensaje",
    "form.send": "Enviar",
    "form.sending": "Enviando…",
    "form.success": "Gracias — le responderemos muy pronto.",
    "form.error": "Algo salió mal. Por favor, llámenos.",
    "form.required": "Obligatorio",
    "form.invalidEmail": "Introduzca un correo electrónico válido",
    "form.disabled": "Este formulario aún no está conectado.",

    "testimonials.title": "Lo que dice la gente",
    "testimonials.source": "vía",

    "faq.title": "Preguntas frecuentes",

    "404.title": "Página no encontrada",
    "404.body": "Esa página se movió o nunca existió.",
    "404.home": "Volver al inicio",

    "concept.badge": "Rediseño conceptual por",
    "concept.disclaimer": "Sin afiliación con",

    "footer.rights": "Todos los derechos reservados.",
    "footer.builtBy": "Sitio por",
  },
} as const;

export type UIKey = keyof (typeof ui)["en"];

/**
 * Returns a translator bound to a locale. Falls back to the default locale for
 * any key a translation is missing, so a half-translated site degrades to
 * readable rather than blank.
 */
export function useTranslations(locale: Locale) {
  return function t(key: UIKey): string {
    const table = ui[locale] as Record<string, string> | undefined;
    return table?.[key] ?? (ui[SITE.defaultLocale] as Record<string, string>)[key] ?? key;
  };
}

/** Pull the locale out of a URL pathname. `/es/about` → `es`. */
export function localeFromUrl(url: URL): Locale {
  const seg = url.pathname.split("/").filter(Boolean)[0];
  return (SITE.locales as readonly string[]).includes(seg)
    ? (seg as Locale)
    : SITE.defaultLocale;
}

/** Prefix a path with the locale, leaving the default locale un-prefixed. */
export function localizePath(path: string, locale: Locale): string {
  const clean = path.startsWith("/") ? path : `/${path}`;
  return locale === SITE.defaultLocale ? clean : `/${locale}${clean}`;
}
