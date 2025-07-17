import type { BetterAuthOptions } from 'better-auth'
import { prismaAdapter } from 'better-auth/adapters/prisma'

import { db } from '@{{ name }}/db'
import { env } from '@{{ name }}/validators/env'

const database = prismaAdapter(db, {
  provider: 'postgresql',
})

export const authOptions = {
  database,
  baseURL: getBaseUrl(),
  socialProviders: {
    discord: {
      clientId: env.AUTH_DISCORD_ID,
      clientSecret: env.AUTH_DISCORD_SECRET,
    },
  },
} satisfies BetterAuthOptions

function getBaseUrl() {
  if (env.VERCEL_PROJECT_PRODUCTION_URL)
    return `https://${env.VERCEL_PROJECT_PRODUCTION_URL}`
  else if (env.VERCEL_URL) return `https://${env.VERCEL_URL}`
  return `http://localhost:${process.env.PORT ?? 3000}`
}
