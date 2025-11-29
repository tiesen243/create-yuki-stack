import { db } from '@{{ name }}/db'
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
        const query = identifier.includes('@')
          ? { email: identifier }
          : { _id: identifier }
        const record = await db.user.findOne(query)

        return record
          ? { ...record.toObject(), id: record._id.toString() }
          : null
      },
      async create(data) {
        const result = await db.user.create(data)

        return { id: result._id.toString() }
      },
    },

    account: {
      async find(provider, accountId) {
        const record = await db.account.findOne({ provider, accountId })

        return record
          ? {
              ...record.toObject(),
              id: record._id.toString(),
              userId: record.userId.toString(),
            }
          : null
      },
      async create(data) {
        await db.account.create(data)
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
        const record = await db.session
          .findOne({ id })
          .populate('userId', '_id name email image')
        if (!record) return null

        const { userId, token, expiresAt, ipAddress, userAgent } = record
        return { user: userId, token, expiresAt, ipAddress, userAgent }
      },
      async create(data) {
        await db.session.create(data)
      },
      async update(id, data) {
        await db.session.findOneAndUpdate({ id }, data)
      },
      async delete(id) {
        await db.session.findOneAndDelete({ id })
      },
    },
  },
} as const satisfies AuthConfig
