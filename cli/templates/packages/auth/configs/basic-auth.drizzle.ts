import { and, db, eq } from '@{{ name }}/db'
import { accounts, sessions, users } from '@{{ name }}/db/schema'

import type { AuthOptions } from './core/types'
import { encodeHex, hashSecret } from './core/crypto'
import Discord from './providers/discord'

import { env } from '@{{ name }}/validators/env'

const adapter = getAdapter()
export const authOptions = {
  adapter,
  session: {
    expiresIn: 60 * 60 * 24 * 30, // 30 days
    expiresThreshold: 60 * 60 * 24 * 7, // 7 days
  },
  providers: {
    discord: new Discord({
      clientId: env.AUTH_DISCORD_ID ?? '',
      clientSecret: env.AUTH_DISCORD_SECRET ?? '',
    }),
  },
} satisfies AuthOptions

export type Providers = keyof typeof authOptions.providers

export async function validateSessionToken(token: string) {
  const hashToken = encodeHex(await hashSecret(token))
  return await adapter.getSessionAndUser(hashToken)
}

export async function invalidateSessionToken(token: string) {
  const hashToken = encodeHex(await hashSecret(token))
  await adapter.deleteSession(hashToken)
}

function getAdapter(): AuthOptions['adapter'] {
  return {
    getUserByEmail: async (email) => {
      const [user] = await db.select().from(users).where(eq(users.email, email))
      return user ?? null
    },
    createUser: async (data) => {
      const [user] = await db.insert(users).values(data).returning()
      return user ?? null
    },
    getAccount: async (provider, accountId) => {
      const [account] = await db
        .select()
        .from(accounts)
        .where(
          and(
            eq(accounts.provider, provider),
            eq(accounts.accountId, accountId),
          ),
        )
      return account ?? null
    },
    createAccount: async (data) => {
      await db.insert(accounts).values(data)
    },
    getSessionAndUser: async (token) => {
      const [session] = await db
        .select({
          user: users,
          expires: sessions.expires,
        })
        .from(sessions)
        .where(eq(sessions.token, token))
        .innerJoin(users, eq(sessions.userId, users.id))
      return session ?? null
    },
    createSession: async (data) => {
      await db.insert(sessions).values(data)
    },
    updateSession: async (token, data) => {
      await db.update(sessions).set(data).where(eq(sessions.token, token))
    },
    deleteSession: async (token) => {
      await db.delete(sessions).where(eq(sessions.token, token))
    },
  }
}

declare module './core/types.d.ts' {
  type IUser = typeof users.$inferInsert
  type ISession = typeof sessions.$inferInsert

  interface User extends IUser {
    id: string
  }
  interface Session extends ISession {}
}
