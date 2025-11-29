import { accounts, sessions, users } from '@{{ name }}/db/schema'
import { and, db, eq, or } from '@{{ name }}/db'
import { env } from '@{{ name }}/validators/env'

import type { AuthConfig } from '@/types'
import { Discord } from '@/providers/discord'

export const authOptions = {
  secret: env.AUTH_SECRET,

  providers: [
    new Discord(
      env.AUTH_DISCORD_ID,
      env.AUTH_DISCORD_SECRET,
    ),
  ],

  adapter: {
    user: {
      async find(identifier) {
        const [record] = await db
          .select()
          .from(users)
          .where(or(eq(users.id, identifier), eq(users.email, identifier)))
          .limit(1)

        return record ?? null
      },
      async create(data) {
        const [result] = await db
          .insert(users)
          .values(data)
          .returning({ id: users.id })
        if (!result) throw new Error('Failed to create user')

        return result
      },
    },

    account: {
      async find(provider, accountId) {
        const [record] = await db
          .select()
          .from(accounts)
          .where(
            and(
              eq(accounts.provider, provider),
              eq(accounts.accountId, accountId),
            ),
          )
          .limit(1)

        return record ?? null
      },
      async create(data) {
        await db.insert(accounts).values(data)
      },
    },

    /**
     * If you use JWT authentication, session management may not be necessary.
     * To disable sessions when using JWT, you can throw an error in the session methods:
     * ```ts
     * throw new Error("Sessions are not supported with JWT auth.");
     * ```
     */
    session: {
      async find(id) {
        const [record] = await db
          .select({
            user: {
              id: users.id,
              name: users.name,
              email: users.email,
              image: users.image,
            },
            token: sessions.token,
            expiresAt: sessions.expiresAt,
            ipAddress: sessions.ipAddress,
            userAgent: sessions.userAgent,
          })
          .from(sessions)
          .where(eq(sessions.id, id))
          .innerJoin(users, eq(sessions.userId, users.id))
          .limit(1)

        return record ?? null
      },
      async create(data) {
        await db.insert(sessions).values(data)
      },
      async update(id, data) {
        await db.update(sessions).set(data).where(eq(sessions.id, id))
      },
      async delete(id) {
        await db.delete(sessions).where(eq(sessions.id, id))
      },
    },
  },
} as const satisfies AuthConfig
