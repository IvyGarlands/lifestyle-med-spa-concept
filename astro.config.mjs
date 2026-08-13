// @ts-check
import { defineConfig } from "astro/config";
import { SITE } from "./src/config/site.ts";

/**
 * Engine defaults. Per-client changes should be limited to:
 *   - `site` (comes from src/config/site.ts)
 *   - the i18n `locales` list, if the client is not bilingual
 * Everything else is engine policy and should not be edited per project.
 *
 * https://astro.build/config
 */
export default defineConfig({
  site: SITE.url,
  output: "static",
  trailingSlash: "ignore",

  // Built-in i18n routing. Default locale stays un-prefixed (/about), the
  // second locale is prefixed (/es/about). Adding a language is a content
  // task: drop in `lang: 'es'` entries and the routes exist.
  i18n: {
    defaultLocale: SITE.defaultLocale,
    // Spread: SITE is `as const`, and Astro's Locales type is mutable.
    locales: [...SITE.locales],
    routing: {
      prefixDefaultLocale: false,
      redirectToDefaultLocale: false,
    },
  },

  /**
   * NO SITEMAP. Lock 2 of 4 on findability.
   *
   * The engine ships @astrojs/sitemap and every client build wants it. A
   * concept redesign is the exact opposite case: a sitemap is an invitation,
   * and `robots.txt: Disallow` plus a sitemap listing every URL is a mixed
   * signal that some crawlers resolve in the wrong direction. The integration
   * is removed rather than filtered, so there is no configuration state in
   * which it can come back on by accident.
   *
   * See public/robots.txt for the other three locks.
   */
  integrations: [],

  image: {
    // AVIF first, WebP fallback, original as last resort — handled per-usage by
    // <Picture>. Sharp is the build-time encoder; no runtime image service.
    responsiveStyles: true,
    layout: "constrained",
  },

  build: {
    /**
     * Inline ALL CSS rather than Astro's default "auto".
     *
     * Our total CSS is ~10KB gzipped, and "auto" left three separate
     * render-blocking <link> requests in <head>. On these sites the
     * overwhelming majority of visitors see exactly one page on a phone, so
     * the cross-page cache benefit of external CSS never materialises while
     * the extra round-trips are paid every time.
     *
     * Revisit if a project's CSS ever exceeds ~20KB gzipped — past that the
     * inlined bytes start costing more than the requests saved.
     */
    inlineStylesheets: "always",
  },

  /**
   * Dev-server only. Astro's dev router runs a Fetch-Metadata check
   * (secFetchMiddleware): any request whose `Sec-Fetch-Site` is `cross-site`
   * is 403'd with "Cross-origin request blocked" UNLESS its `Origin` host
   * matches `security.allowedDomains`. The v0 preview serves this app inside
   * an iframe on a proxied host (a different origin than localhost:4321), so
   * every request looks cross-site and gets blocked.
   *
   * An empty pattern `{}` matches any host, so this trusts all origins for the
   * dev router. `security.allowedDomains` is only consulted by the dev server;
   * it has no effect on the static production build (`output: "static"`).
   */
  security: {
    allowedDomains: [{}],
  },

  vite: {
    build: {
      cssMinify: "lightningcss",
    },
  },
});
