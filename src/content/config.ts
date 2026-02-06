import { defineCollection, z } from 'astro:content';

const categoryEnum = z.enum(['vision', 'takes', 'experiments', 'building', 'personal']);
export type Category = z.infer<typeof categoryEnum>;

// Category metadata mapping
export const categoryMeta: Record<Category, { label: string; icon: string }> = {
  vision: { label: 'Visionen', icon: '◎' },
  takes: { label: 'Takes', icon: '◆' },
  experiments: { label: 'Experimente', icon: '▲' },
  building: { label: 'Building', icon: '◻' },
  personal: { label: 'Persönlich', icon: '●' },
};

const posts = defineCollection({
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
    audioSrc: z.string().optional(),
    draft: z.boolean().default(false),
  }),
});

export const collections = { posts };
