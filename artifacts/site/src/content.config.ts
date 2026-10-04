import { defineCollection } from "astro:content";
import { glob } from "astro/loaders";
import { z } from "astro/zod";

const product = z.enum(["kids", "babynaming", "brand"]);

// Evergreen guides and product stories. The file name is the URL slug.
const journal = defineCollection({
  loader: glob({ pattern: "**/*.md", base: "./src/content/journal" }),
  schema: z.object({
    title: z.string(),
    description: z.string().max(170),
    publishedAt: z.coerce.date(),
    updatedAt: z.coerce.date().optional(),
    author: z.string().default("Petit Mokus"),
    category: z.enum(["guides", "product-stories", "brand"]),
    tags: z.array(z.string()).default([]),
    heroImage: z.object({ src: z.string(), alt: z.string() }).optional(),
    draft: z.boolean().default(false),
    locale: z.literal("en"),
    relatedProduct: product.optional(),
  }),
});

// Short, dated release notes.
const updates = defineCollection({
  loader: glob({ pattern: "**/*.md", base: "./src/content/updates" }),
  schema: z.object({
    title: z.string(),
    description: z.string().max(170),
    publishedAt: z.coerce.date(),
    draft: z.boolean().default(false),
    locale: z.literal("en"),
    relatedProduct: product,
  }),
});

export const collections = { journal, updates };
