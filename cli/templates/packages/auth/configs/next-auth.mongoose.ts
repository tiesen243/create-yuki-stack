import type { NextAuthConfig } from 'next-auth'
import { MongoDBAdapter } from '@auth/mongodb-adapter'
import { MongoClient } from 'mongodb'
import Discord from 'next-auth/providers/discord'

import { env } from '@{{ name }}/validators/env'

const client = new MongoClient(process.env.DATABASE_URL ?? '', {
  serverApi: { version: '1', strict: true, deprecationErrors: true },
})

const adapter = MongoDBAdapter(client)

const authOptions = {
  adapter,
  providers: [
    Discord({
      clientId: env.AUTH_DISCORD_ID ?? '',
      clientSecret: env.AUTH_DISCORD_SECRET ?? '',
    }),
  ],
} satisfies NextAuthConfig

async function validateSessionToken(token: string) {
  const session = await adapter.getSessionAndUser?.(token)
  return session
    ? {
        user: { ...session.user },
        expires: session.session.expires.toISOString(),
      }
    : null
}

async function invalidateSessionToken(token: string) {
  await adapter.deleteSession?.(token)
}

export { authOptions, validateSessionToken, invalidateSessionToken }
