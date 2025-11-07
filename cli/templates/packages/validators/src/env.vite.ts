import * as z from 'zod/v4-mini'

import { createEnv } from '@/lib/create-env'

export const env = createEnv({
  server: {},

  clientPrefix: 'VITE_',
  client: {
    VITE_VERCEL_ENV: z.optional(z.enum(['production', 'preview', 'development'])),
    VITE_VERCEL_URL: z.optional(z.url()),
    VITE_VERCEL_PROJECT_PRODUCTION_URL: z.optional(z.url()),
  },

  runtimeEnv: {
    VITE_VERCEL_ENV: import.meta.env.VITE_VERCEL_ENV,
    VITE_VERCEL_URL: import.meta.env.VITE_VERCEL_URL,
    VITE_VERCEL_PROJECT_PRODUCTION_URL: import.meta.env.VITE_VERCEL_PROJECT_PRODUCTION_URL,
  },

  skipValidation: true
})

declare global {
  interface ImportMeta {
    readonly env: Record<string, string | undefined>
  }
}
