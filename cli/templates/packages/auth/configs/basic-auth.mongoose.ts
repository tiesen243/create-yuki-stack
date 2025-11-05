import { db } from '@{{ name }}/db'
import { env } from '@{{ name }}/validators/env'

import type { AuthOptions } from '@/types'
import { encodeHex, hashSecret } from '@/core/crypto'
import Discord from '@/providers/discord'

const adapter = getAdapter()
export const authOptions = {
  adapter,
  session: {
    expiresIn: 60 * 60 * 24 * 30, // 30 days
    expiresThreshold: 60 * 60 * 24 * 7, // 7 days
  },
  providers: {
    discord: new Discord({
      clientId: env.AUTH_DISCORD_ID,
      clientSecret: env.AUTH_DISCORD_SECRET,
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

export async function invalidateSessionTokens(userId: string) {
  await adapter.deleteSessionsByUserId(userId)
}

function getAdapter(): AuthOptions['adapter'] {
  return {
    getUserByEmail: async (email) => {
      const user = await users.findOne({ email })
      if (!user) return null
      return { ...user.toObject(), id: user._id }
    },

    createUser: async (data) => {
      const user = await users.create(data)
      return { ...user.toObject(), id: user._id }
    },

    getAccount: async (provider, accountId) => {
      const account = await accounts.findOne({ provider, accountId })
      if (!account) return null
      return {
        ...account.toObject(),
        password: account.password ?? null,
        id: account._id,
      }
    },

    createAccount: async (data) => {
      await accounts.create(data)
    },

    getSessionAndUser: async (token) => {
      const session = await sessions.findOne({ token })
      if (!session) return null
      const user = await users.findById(session.userId)
      if (!user) return null

      return {
        user: { ...user.toObject(), id: user._id },
        expires: session.expires,
      }
    },

    createSession: async (data) => {
      await sessions.create(data)
    },

    updateSession: async (token, data) => {
      await sessions.findOneAndUpdate({ token }, { $set: data }, { new: true })
    },

    deleteSession: async (token) => {
      await sessions.deleteOne({ token })
    },

    deleteSessionsByUserId: async (userId) => {
      await sessions.deleteMany({ userId })
    }
  }
}
