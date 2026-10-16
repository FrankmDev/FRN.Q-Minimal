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

export async function getPublishedProjects(): Promise<Project[]> {
  return (await getProjects()).filter(
    (project) =>
      project.status === "live" ||
      (project.status === "in-development" && project.publicPreview),
  );
}

export async function getFeaturedProjects(limit = 4): Promise<Project[]> {
  return (await getPublishedProjects()).slice(0, limit);
}

export const categoryLabels: Record<Project["category"], string> = {
  corporate: "Web corporativa",
  web: "Web",
  website: "Web",
  product: "Producto digital",
  interactive: "Experiencia interactiva",
  // KingBelt and Emilio Faraoni are public in-development references.
  ecommerce: "E-commerce D2C",
  b2b: "Portal / Commerce B2B",
};

export const statusLabels: Record<Project["status"], string> = {
  live: "Publicado",
  "in-development": "En desarrollo",
  archived: "Archivado",
};

/**
 * Case archive grouping. Projects are listed by commercial type following the
 * service hierarchy (ecommerce, B2B, web and own product, interactive work), so
 * a visitor identifies the kind of project before reading anything. `web` and
 * `website` share one group.
 */
export interface CaseGroup {
  id: string;
  label: string;
  /** Short description of what this type of project delivers. */
  short: string;
  /** Case categories collected under this group. */
  categories: Project["category"][];
  /** Priority treatment mirroring the commercial hierarchy. */
  emphasis?: "primary" | "secondary";
}

export const caseGroups: CaseGroup[] = [
  {
    id: "ecommerce",
    label: "E-commerce D2C",
    short: "Tienda online con catálogo, variantes y compra directa.",
    categories: ["ecommerce"],
    emphasis: "primary",
  },
  {
    id: "b2b",
    label: "Portal / Commerce B2B",
    short: "Clientes profesionales, precios privados y pedidos.",
    categories: ["b2b"],
    emphasis: "secondary",
  },
  {
    id: "web",
    label: "Web y proyectos a medida",
    short: "Webs corporativas, portfolios y productos digitales propios.",
    categories: ["corporate", "web", "website", "product"],
  },
  {
    id: "interactive",
    label: "Experiencia interactiva",
    short: "Navegación visual donde la obra o el material son el contenido.",
    categories: ["interactive"],
  },
];

export function casePath(slug: string): string {
  return `/casos/${slug}/`;
}
