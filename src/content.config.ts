import { defineCollection } from "astro:content";
import { z as zod } from "astro/zod";
import { glob } from "astro/loaders";

/**
 * All site pages (EN + DE) as MDX content.
 *
 * Entry ids are derived from the file path relative to `base`:
 * - src/content/pages/about.mdx      -> "about"
 * - src/content/pages/index.mdx      -> "index"
 * - src/content/pages/de/faq.mdx     -> "de/faq"
 * - src/content/pages/de/index.mdx   -> "de"
 */
const pages = defineCollection({
  loader: glob({
    pattern: "**/*.mdx",
    base: "./src/content/pages",
  }),
  schema: zod.object({
    title: zod.string(),
    description: zod.string(),
  }),
});

export const collections = { pages };
