import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

// Every file in content/pages/*.md is a page (tab). Order is set in content/site.yaml.
const pages = defineCollection({
  loader: glob({ pattern: '*.md', base: './content/pages' }),
  schema: z.object({ title: z.string().optional() }),
});

// The bio shown in the header on every page.
const bio = defineCollection({
  loader: glob({ pattern: 'bio.md', base: './content' }),
  schema: z.object({}).passthrough(),
});

export const collections = { pages, bio };
