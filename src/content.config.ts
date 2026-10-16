import { defineCollection } from "astro:content";
import { glob } from "astro/loaders";
import { z } from "astro/zod";

// Solution categories. "web" covers commercial website builds; "website"
// is the equivalent for professional / portfolio-web cases. Prepared for
// publicly selected cases: ecommerce (KingBelt, D2C) and B2B (Emilio Faraoni).
const categories = [
  "corporate",
  "web",
  "website",
  "product",
  "interactive",
  "ecommerce",
  "b2b",
] as const;

const statuses = ["live", "in-development", "archived"] as const;
const solutionIds = ["ecommerce", "b2b", "sistemas"] as const;

const projects = defineCollection({
  loader: glob({ pattern: "**/*.md", base: "./src/content/projects" }),
  schema: ({ image }) =>
    z.object({
      // Client / project identity
      title: z.string(),
      client: z.string(),
      category: z.enum(categories),
      sector: z.string(),
      year: z.string().regex(/^\d{4}$/),

      // Commercial narrative
      tagline: z.string().max(160),
      /**
       * Compact business reading, rendered before the long case narrative so a
       * non-technical visitor can grasp business, problem, delivered scope, the
       * key decision and the verifiable outcome in one block. Kept short on
       * purpose; the detailed sections below stay the full explanation.
       */
      summary: z.object({
        business: z.string().max(260),
        challenge: z.string().max(260),
        delivered: z.string().max(260),
        decision: z.string().max(260),
        outcome: z.string().max(260),
      }),
      context: z.string(),
      problem: z.string(),
      objective: z.string(),
      scope: z.array(z.string()).min(1),
      solution: z.string(),
      features: z
        .array(z.object({ title: z.string(), description: z.string() }))
        .min(1),
      decisions: z
        .array(z.object({ title: z.string(), description: z.string() }))
        .min(1),

      // Observable, non-invented outcome. Metrics are optional and only
      // included when they can be verified.
      result: z.string(),
      metrics: z
        .array(
          z.object({
            label: z.string(),
            value: z.string(),
            note: z.string().optional(),
          }),
        )
        .optional(),

      // Technologies are secondary evidence, not the headline.
      technologies: z.array(z.string()).min(1),

      // Media
      cover: z.object({ src: image(), alt: z.string() }),
      images: z
        .array(
          z.object({
            src: image(),
            alt: z.string(),
            caption: z.string().optional(),
          }),
        )
        .min(1),

      // Links & state
      url: z.url().optional(),
      urlLabel: z.string().default("Ver proyecto"),
      status: z.enum(statuses).default("live"),
      // In-progress cases require explicit editorial consent before appearing publicly.
      publicPreview: z.boolean().default(false),
      order: z.number().int().positive(),
      serviceArea: z.enum(solutionIds).optional(),

      seo: z.object({
        title: z.string().max(65),
        description: z.string().max(160),
        keywords: z.array(z.string()),
      }),
    }),
});

/**
 * Guides ("/guias/"): lightweight editorial articles that answer a concrete
 * decision a business faces before hiring. They are not a blog: no categories
 * archive, no pagination, no author pages, no CMS. Each guide carries its own
 * metadata, a short summary of decisions, its explicit limits, contrastable
 * references and a single CTA towards the matching service.
 *
 * The Markdown body holds the article; the frontmatter holds the metadata the
 * page renders around it, so copy is authored once and never duplicated.
 */
const guias = defineCollection({
  loader: glob({ pattern: "**/*.md", base: "./src/content/guias" }),
  schema: z.object({
    title: z.string(),
    h1: z.string(),
    category: z.string(),
    /** Editorial dates as ISO calendar days to avoid timezone drift. */
    published: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
    updated: z.string().regex(/^\d{4}-\d{2}-\d{2}$/).optional(),
    readingTime: z.string(),
    order: z.number().int().positive(),
    lead: z.string(),
    /** Practical takeaway, rendered as a ruled summary before the article. */
    keyPoints: z.array(z.string()).min(2),
    /** Explicit boundaries of the advice; rendered as an inverted panel. */
    limits: z.array(z.string()).min(2),
    cta: z.object({
      label: z.string(),
      href: z.string(),
      note: z.string(),
    }),
    /** Contrastable, public sources. Optional per article. */
    references: z
      .array(
        z.object({
          label: z.string(),
          url: z.url(),
          note: z.string().optional(),
        }),
      )
      .default([]),
    related: z
      .array(z.object({ label: z.string(), href: z.string() }))
      .default([]),
    seo: z.object({
      title: z.string().max(65),
      description: z.string().max(160),
    }),
  }),
});

export const collections = { projects, guias };
