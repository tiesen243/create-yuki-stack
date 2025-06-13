import type { BetterAuthOptions } from 'better-auth'
import { drizzleAdapter } from 'better-auth/adapters/drizzle'

import { db } from '@{{ name }}/db'
import {
  accounts,
  sessions,
  users,
  verifications,
} from '@{{ name }}/db/schema'

const database = drizzleAdapter(db, {
  provider: 'pg',
  schema: {
    account: accounts,
    session: sessions,
    user: users,
    verification: verifications,
  },
})

export const authOptions = {
  database: database,
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
