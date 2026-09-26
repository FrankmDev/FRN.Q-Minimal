import { defineCollection } from "astro:content";
import { glob } from "astro/loaders";
import { z } from "astro/zod";

// Solution categories. Values are prepared for the next cases without
// creating entries yet: ecommerce (KingBelt, D2C / Shopify) and
// b2b (Emilio Faraoni, portal / commerce B2B).
const categories = [
  "corporate",
  "platform",
  "product",
  "interactive",
  "ecommerce",
  "b2b",
] as const;

const statuses = ["live", "in-development", "archived"] as const;

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
      order: z.number().int().positive(),

      seo: z.object({
        description: z.string().max(160),
        keywords: z.array(z.string()),
      }),
    }),
});

export const collections = { projects };
