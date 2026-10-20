import { defineContentConfig, defineCollection, z } from '@nuxt/content'

export default defineContentConfig({
  collections: {
    blog: defineCollection({
      type: 'page',
      source: 'blog/**/*.md',
      schema: z.object({
        title: z.string(),
        titleId: z.string().optional(),
        excerpt: z.string().optional(),
        excerptId: z.string().optional(),
        category: z.string().optional(),
        date: z.string(),
        readTime: z.number().optional(),
        tags: z.array(z.string()).optional(),
        featured: z.boolean().optional(),
        ogImage: z.string().optional()
      })
    })
  }
})
