import { db } from '@{{ name }}/db'

import type { AuthOptions } from './core/types'
import { encodeHex, hashSecret } from './core/crypto'
import Discord from './providers/discord'

const adapter = getAdapter()
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
      const user = await db.users.findOne({ email })
      if (!user) return null
      return { ...user.toObject(), id: user._id }
    },
    createUser: async (data) => {
      const user = await db.users.create(data)
      return { ...user.toObject(), id: user._id }
    },
    getAccount: async (provider, accountId) => {
      const account = await db.accounts.findOne({ provider, accountId })
      if (!account) return null
      return {
        ...account.toObject(),
        password: account.password ?? null,
      }
    },
    createAccount: async (data) => {
      const account = await db.accounts.create(data)
      return {
        ...account.toObject(),
        password: account.password ?? null,
      }
    },
    getSessionAndUser: async (token) => {
      const session = await db.sessions.findOne({ token })
      if (!session) return null
      const user = await db.users.findById(session.userId)
      if (!user) return null
      return {
        user: { ...user.toObject(), id: user._id },
        expires: session.expires,
      }
    },
    createSession: async (data) => {
      const session = await db.sessions.create(data)
      return session.toObject()
    },
    updateSession: async (token, data) => {
      const session = await db.sessions.findOneAndUpdate(
        { token },
        { $set: data },
        { new: true },
      )
      if (!session) return null
      return session.toObject()
    },
    deleteSession: async (token) => {
      await db.sessions.deleteOne({ token })
    },
  }
}
