import * as z from 'zod';

export const categoryEnum = z.enum(['vision', 'takes', 'experiments', 'building', 'personal']);
export type Category = z.infer<typeof categoryEnum>;

// Category metadata mapping
export const categoryMeta: Record<Category, { label: string; icon: string }> = {
  vision: { label: 'Visionen', icon: '◎' },
  takes: { label: 'Takes', icon: '◆' },
  experiments: { label: 'Experimente', icon: '▲' },
  building: { label: 'Building', icon: '◻' },
  personal: { label: 'Persönlich', icon: '●' },
};
