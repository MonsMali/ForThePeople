import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const sourceSchema = z.object({
  label: z.string(),
  url: z.string().url(),
  evidenceImage: z.string().optional(),
});

const factpackSchema = z.object({
  title: z.string(),
  translationKey: z.string(),
  summary: z.string(),
  claim: z.string(),
  verdict: z.enum(['false', 'misleading', 'missing-context', 'mixed', 'true']),
  verdictSummary: z.string(),
  tags: z.array(z.string()),
  publishedDate: z.coerce.date(),
  lastUpdated: z.coerce.date().optional(),
  revisionNote: z.string().optional(),
  sources: z.array(sourceSchema),
  ogImage: z.string().optional(),
  draft: z.boolean().default(false),
});

export type Factpack = z.infer<typeof factpackSchema>;
export type Source = z.infer<typeof sourceSchema>;

const factpacks_en = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/data/factpacks/en' }),
  schema: factpackSchema,
});

const factpacks_pt = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/data/factpacks/pt' }),
  schema: factpackSchema,
});

export const collections = { factpacks_en, factpacks_pt };
