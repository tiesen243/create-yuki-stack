import * as z from 'zod/v4'

export const byIdSchema = z.object({
  id: z.uuid(),
})
