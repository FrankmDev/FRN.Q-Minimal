import { getCollection, type CollectionEntry } from "astro:content";

/**
 * Canonical project/case accessor. The content collection is the single
 * source of truth; the public slug is the entry id (markdown filename).
 */
export type Project = CollectionEntry<"projects">["data"] & { slug: string };

export async function getProjects(): Promise<Project[]> {
  const entries = await getCollection("projects");
  return entries
    .map((entry) => ({ ...entry.data, slug: entry.id }))
    .sort((a, b) => a.order - b.order);
}

export async function getFeaturedProjects(limit = 3): Promise<Project[]> {
  return (await getProjects())
    .filter((project) => project.status === "live")
    .slice(0, limit);
}

export const categoryLabels: Record<Project["category"], string> = {
  corporate: "Web corporativa",
  web: "Web",
  website: "Web",
  product: "Producto digital",
  interactive: "Experiencia interactiva",
  // Prepared for the next cases: KingBelt (D2C / Shopify) and
  // Emilio Faraoni (portal / commerce B2B). No entries created yet.
  ecommerce: "E-commerce D2C",
  b2b: "Portal / Commerce B2B",
};

export const statusLabels: Record<Project["status"], string> = {
  live: "Publicado",
  "in-development": "En desarrollo",
  archived: "Archivado",
};

export function casePath(slug: string): string {
  return `/casos/${slug}/`;
}
