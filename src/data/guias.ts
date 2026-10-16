import { getCollection, type CollectionEntry } from "astro:content";

/**
 * Canonical accessor for the `guias` collection. The public slug is the entry
 * id (markdown filename). Guides are ordered editorially, never by date.
 */
export type Guide = CollectionEntry<"guias">["data"] & { slug: string };

export async function getGuides(): Promise<Guide[]> {
  const entries = await getCollection("guias");
  return entries
    .map((entry) => ({ ...entry.data, slug: entry.id }))
    .sort((a, b) => a.order - b.order);
}

export function guidePath(slug: string): string {
  return `/guias/${slug}/`;
}

const MONTHS = [
  "enero",
  "febrero",
  "marzo",
  "abril",
  "mayo",
  "junio",
  "julio",
  "agosto",
  "septiembre",
  "octubre",
  "noviembre",
  "diciembre",
] as const;

/**
 * Formats an ISO calendar day (`YYYY-MM-DD`) as visible editorial copy.
 * Parsed as plain parts to avoid any timezone shift in the output.
 */
export function formatEditorialDate(iso: string): string {
  const [year, month, day] = iso.split("-").map(Number);
  const monthName = MONTHS[(month ?? 1) - 1] ?? "";
  return `${day} de ${monthName} de ${year}`;
}
