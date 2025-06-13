import type { NextAuthConfig } from 'next-auth'
import { PrismaAdapter } from '@auth/prisma-adapter'
import Discord from 'next-auth/providers/discord'

import { db } from '@{{ name }}/db'

const adapter = PrismaAdapter(db)

const authOptions = {
  adapter,
  providers: [
    Discord({
      clientId: process.env.AUTH_DISCORD_ID ?? '',
      clientSecret: process.env.AUTH_DISCORD_SECRET ?? '',
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
