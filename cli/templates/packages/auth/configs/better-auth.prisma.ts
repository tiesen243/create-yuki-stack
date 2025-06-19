import type { BetterAuthOptions } from 'better-auth'
import { prismaAdapter } from 'better-auth/adapters/prisma'

import { db } from '@{{ name }}/db'

const database = prismaAdapter(db, {
  provider: 'postgresql',
})

export const authOptions = {
  database,
  baseURL: getBaseUrl(),
  socialProviders: {
    discord: {
      clientId: process.env.AUTH_DISCORD_ID ?? '',
      clientSecret: process.env.AUTH_DISCORD_SECRET ?? '',
    },
  },
} satisfies BetterAuthOptions

function getBaseUrl() {
  if (process.env.VERCEL_PROJECT_PRODUCTION_URL)
    return `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
  else if (process.env.VERCEL_URL) return `https://${process.env.VERCEL_URL}`
  return `http://localhost:${process.env.PORT ?? 3000}`
}
