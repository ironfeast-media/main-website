import { defineCollection, z } from 'astro:content';

const blog = defineCollection({
  type: 'content',
  schema: ({ image }) => z.object({
    title: z.string(),
    description: z.string().optional(),
    summary: z.string().optional(),
    date: z.string().optional(),
    pubDate: z.coerce.date().optional(),
    updatedDate: z.coerce.date().optional(),
    category: z.string().optional(),
    type: z.string().optional(),
    tags: z.array(z.string()).optional(),
    author: z.string().optional(),
    company: z.string().optional(),
    'estimated-reading-time': z.string().optional(),
    heroImage: image().optional(),
    images: z.record(z.string(), image()).optional(),
  }).transform((data) => {
    // If pubDate is missing but date exists, use date as pubDate
    if (!data.pubDate && data.date) {
      data.pubDate = new Date(data.date);
    }
    // If description is missing but summary exists, use summary as description
    if (!data.description && data.summary) {
      data.description = data.summary;
    }
    return data;
  }),
});

export const collections = { blog };