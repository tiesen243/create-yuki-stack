import * as z from 'zod/mini'

import { createEnv } from '@/lib/create-env'

export const env = createEnv({
  server: {
    NODE_ENV: z._default(z.enum(['development', 'production', 'test']), 'development'),
  },

  clientPrefix: 'NEXT_PUBLIC_',
  client: {
    NEXT_PUBLIC_API_URL: z.optional(z.string()),
    NEXT_PUBLIC_VERCEL_ENV: z.optional(z.enum(['production', 'preview', 'development'])),
    NEXT_PUBLIC_VERCEL_URL: z.optional(z.url()),
    NEXT_PUBLIC_VERCEL_PROJECT_PRODUCTION_URL: z.optional(z.url()),
  },

  runtimeEnv: {
    NEXT_PUBLIC_VERCEL_ENV: process.env.NEXT_PUBLIC_VERCEL_ENV,
    NEXT_PUBLIC_VERCEL_URL: process.env.NEXT_PUBLIC_VERCEL_URL,
    NEXT_PUBLIC_VERCEL_PROJECT_PRODUCTION_URL: process.env.NEXT_PUBLIC_VERCEL_PROJECT_PRODUCTION_URL,
  },

  skipValidation: true
})
