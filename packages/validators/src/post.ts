import * as z from 'zod/v4'

export const byIdSchema = z.object({
  id: z.uuid(),
})

export const createPostSchema = z.object({
  title: z.string().min(1, { error: 'Title is required' }),
  content: z.string().min(1, { error: 'Content is required' }),
})
