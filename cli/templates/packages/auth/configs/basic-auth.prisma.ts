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
      return await db.user.findUnique({ where: { email } })
    },
    createUser: async (data) => {
      return await db.user.create({ data })
    },
    getAccount: async (provider, accountId) => {
      return await db.account.findUnique({
        where: { provider_accountId: { provider, accountId } },
      })
    },
    createAccount: async (data) => {
      return await db.account.create({ data })
    },
    getSessionAndUser: async (token) => {
      return await db.session.findUnique({
        where: { token },
        select: {
          user: true,
          expires: true,
        },
      })
    },
    createSession: async (data) => {
      return await db.session.create({ data })
    },
    updateSession: async (token, data) => {
      return await db.session.update({
        where: { token },
        data,
      })
    },
    deleteSession: async (token) => {
      await db.session.delete({ where: { token } })
    },
  }
}
