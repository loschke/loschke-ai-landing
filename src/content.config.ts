import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import * as z from 'zod';
import { categoryEnum } from '@content/categories';

const posts = defineCollection({
  loader: glob({ pattern: '**/*.mdoc', base: './src/content/posts' }),
  schema: ({ image }) => z.object({
    title: z.string(),
    excerpt: z.string().optional(),
    summary: z.string().optional(),
    metaTitle: z.string().optional(),
    metaDescription: z.string().optional(),
    pubDate: z.coerce.date().optional(),
    category: categoryEnum.default('takes'),
    featured: z.boolean().default(false),
    heroImage: image().optional(),
    tags: z.array(z.string()).default([]),
    readTime: z.string().optional(),
    ogImage: z.string().optional(),
    audioSrc: z.string().optional(),
    draft: z.boolean().default(false),
  }),
});

export const collections = { posts };
