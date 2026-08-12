/**
 * content.ts — collection query helpers.
 *
 * Sections never call getCollection directly with ad-hoc filters; they use
 * these, so locale filtering and ordering behave identically everywhere.
 */

import { getCollection, type CollectionEntry, type CollectionKey } from "astro:content";
import { SITE } from "../config/site";
import type { Locale } from "../i18n/ui";

type Ordered = { order?: number };

/**
 * Entries for one locale, ordered.
 *
 * Falls back to the default locale when a collection has no entries for the
 * requested one — a half-translated site should show English content rather
 * than an empty section.
 */
export async function localized<K extends CollectionKey>(
  key: K,
  locale: Locale
): Promise<CollectionEntry<K>[]> {
  const all = await getCollection(key);
  const forLocale = all.filter((e) => (e.data as { lang: string }).lang === locale);
  const entries = forLocale.length
    ? forLocale
    : all.filter((e) => (e.data as { lang: string }).lang === SITE.defaultLocale);

  return entries.sort(
    (a, b) => ((a.data as Ordered).order ?? 0) - ((b.data as Ordered).order ?? 0)
  );
}

export interface MenuGroup {
  category: string;
  categoryOrder: number;
  items: CollectionEntry<"menu">[];
}

/**
 * Group menu entries by category, preserving each category's declared order.
 *
 * All three menu variants consume this, which is what makes switching layouts a
 * one-line change in a page (CLAUDE.md §10).
 */
export function groupMenu(entries: CollectionEntry<"menu">[]): MenuGroup[] {
  const groups = new Map<string, MenuGroup>();

  for (const entry of entries) {
    const { category, categoryOrder } = entry.data;
    const group = groups.get(category);
    if (group) {
      group.items.push(entry);
      // A category's order is the lowest any of its items declares.
      group.categoryOrder = Math.min(group.categoryOrder, categoryOrder);
    } else {
      groups.set(category, { category, categoryOrder, items: [entry] });
    }
  }

  return [...groups.values()]
    .sort((a, b) => a.categoryOrder - b.categoryOrder)
    .map((g) => ({
      ...g,
      items: g.items.sort((a, b) => a.data.order - b.data.order),
    }));
}

/** Featured entries first, then the rest, capped. */
export function featuredFirst<T extends { data: { featured?: boolean } }>(
  entries: T[],
  limit?: number
): T[] {
  const sorted = [...entries].sort(
    (a, b) => Number(b.data.featured ?? false) - Number(a.data.featured ?? false)
  );
  return limit ? sorted.slice(0, limit) : sorted;
}
