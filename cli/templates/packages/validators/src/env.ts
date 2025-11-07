import * as z from 'zod/v4-mini'

import { createEnv } from '@/lib/create-env'

export const env = createEnv({
  server: {
    NODE_ENV: z._default(z.enum(['development', 'production', 'test']), 'development'),

    // Vercel environment variables
    VERCEL: z.optional(z.string()),
    VERCEL_ENV: z.optional(z.enum(['production', 'preview', 'development'])),
    VERCEL_URL: z.optional(z.string()),
    VERCEL_PROJECT_PRODUCTION_URL: z.optional(z.string()),
  },

  clientPrefix: 'PUBLIC_',
  client: {
  },

  runtimeEnv: process.env,

  skipValidation:
    !!process.env.SKIP_ENV_VALIDATION ||
    !!process.env.CI ||
    process.env.npm_lifecycle_event === 'lint',
})
