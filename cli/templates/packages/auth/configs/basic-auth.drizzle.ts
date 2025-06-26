import { and, db, eq } from '@{{ name }}/db'
import { accounts, sessions, users } from '@{{ name }}/db/schema'

import type { AuthOptions } from './core/types'
import Discord from './providers/discord'

const adapter = {
  user: {
    async findOne(email) {
      const [user] = await db.select().from(users).where(eq(users.email, email))
      return user ?? null
    },
    async create(data) {
      const [user] = await db.insert(users).values(data).returning()
      return user ?? null
    },
    async update(email, data) {
      const [user] = await db
        .update(users)
        .set(data)
        .where(eq(users.email, email))
        .returning()
      return user ?? null
    },
    async delete(email) {
      const [user] = await db
        .delete(users)
        .where(eq(users.email, email))
        .returning()
      return user ?? null
    },
  },
  account: {
    async findOne(provider, accountId) {
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
    async create(data) {
      const [createdAccount] = await db
        .insert(accounts)
        .values(data)
        .returning()
      return createdAccount ?? null
    },
    async update(accountId, data) {
      const [account] = await db
        .update(accounts)
        .set(data)
        .where(
          and(
            eq(accounts.provider, data.provider ?? ''),
            eq(accounts.accountId, accountId),
          ),
        )
        .returning()
      return account ?? null
    },
    async delete(provider, accountId) {
      const [account] = await db
        .delete(accounts)
        .where(
          and(
            eq(accounts.provider, provider),
            eq(accounts.accountId, accountId),
          ),
        )
        .returning()
      return account ?? null
    },
  },
  session: {
    async findOne(token) {
      const [session] = await db
        .select({ user: users, expires: sessions.expires })
        .from(sessions)
        .where(eq(sessions.token, token))
        .innerJoin(users, eq(sessions.userId, users.id))
      return session ?? null
    },
    async create(data) {
      const [session] = await db.insert(sessions).values(data).returning()
      return session ?? null
    },
    async update(token, data) {
      const [session] = await db
        .update(sessions)
        .set(data)
        .where(eq(sessions.token, token))
        .returning()
      return session ?? null
    },
    async delete(token) {
      const [session] = await db
        .delete(sessions)
        .where(eq(sessions.token, token))
        .returning()
      return session ?? null
    },
  },
} satisfies AuthOptions['adapter']

export const authOptions = {
  adapter,
  session: {
    expiresIn: 60 * 60 * 24 * 30, // 30 days
    expiresThreshold: 60 * 60 * 24 * 7, // 7 days
  },
  providers: {
    discord: new Discord({
      clientId: process.env.AUTH_DISCORD_ID ?? '',
      clientSecret: process.env.AUTH_DISCORD_SECRET ?? '',
    }),
  },
} satisfies AuthOptions

export type Providers = keyof typeof authOptions.providers
