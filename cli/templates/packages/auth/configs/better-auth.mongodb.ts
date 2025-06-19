import type { BetterAuthOptions } from 'better-auth'
import { mongodbAdapter } from 'better-auth/adapters/mongodb'
import { MongoClient } from 'mongodb'

const client = new MongoClient(process.env.DATABASE_URL ?? '', {
  serverApi: { version: '1', strict: true, deprecationErrors: true },
})
const database = mongodbAdapter(client.db())

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
