import { db } from '@{{ name }}/db'

import type { AuthOptions } from './core/types'
import Discord from './providers/discord'

const adapter = {
  user: {
    async findOne(email) {
      return db.user.findUnique({ where: { email } })
    },
    async create(data) {
      return db.user.create({ data })
    },
    async update(email, data) {
      return db.user.update({ where: { email }, data })
    },
    async delete(email) {
      return db.user.delete({ where: { email } })
    },
  },
  account: {
    async findOne(provider, accountId) {
      return await db.account.findUnique({
        where: { provider_accountId: { provider, accountId } },
      })
    },
    async create(data) {
      return db.account.create({ data })
    },
    async update(accountId, data) {
      return db.account.update({
        where: {
          provider_accountId: { provider: data.provider ?? '', accountId },
        },
        data,
      })
    },
    async delete(provider, accountId) {
      return db.account.delete({
        where: { provider_accountId: { provider, accountId } },
      })
    },
  },
  session: {
    async findOne(token) {
      return db.session.findUnique({
        where: { token },
        select: { user: true, expires: true },
      })
    },
    async create(data) {
      return db.session.create({ data })
    },
    async update(token, data) {
      return db.session.update({ where: { token }, data })
    },
    async delete(token) {
      return db.session.delete({ where: { token } })
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
