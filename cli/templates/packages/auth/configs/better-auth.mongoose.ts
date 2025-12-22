import type { BetterAuthOptions } from 'better-auth'

import { env } from '@{{ name }}/validators/env'
import { mongodbAdapter } from 'better-auth/adapters/mongodb'
import { MongoClient } from 'mongodb'

const client = new MongoClient(env.DATABASE_URL ?? '', {
  serverApi: { version: '1', strict: true, deprecationErrors: true },
})
const database = mongodbAdapter(client.db())

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
