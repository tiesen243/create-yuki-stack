import { db } from '@{{ name }}/db'

import type { AuthOptions } from './core/types'
import Discord from './providers/discord'

const adapter = {
  user: {
    async findOne(email) {
      const user = await db.users.findOne({ email })
      return user ? { ...user.toObject(), id: user._id } : null
    },
    async create(data) {
      const user = await db.users.create(data)
      return { ...user.toObject(), id: user._id }
    },
    async update(email, data) {
      const user = await db.users.findOneAndUpdate(
        { email },
        { $set: data },
        { new: true },
      )
      return user ? { ...user.toObject(), id: user._id } : null
    },
    async delete(email) {
      const user = await db.users.findOneAndDelete({ email }, { new: true })
      return user ? { ...user.toObject(), id: user._id } : null
    },
  },
  account: {
    async findOne(provider, accountId) {
      const account = await db.accounts.findOne({ provider, accountId })
      const password = account?.password ?? null
      return account
        ? { ...account.toObject(), id: account._id, password }
        : null
    },
    async create(data) {
      const account = await db.accounts.create(data)
      return { ...account.toObject(), id: account._id, password: null }
    },
    async update(accountId, data) {
      const account = await db.accounts.findOneAndUpdate(
        { accountId },
        { $set: data },
        { new: true },
      )
      return account
        ? { ...account.toObject(), id: account._id, password: null }
        : null
    },
    async delete(provider, accountId) {
      const account = await db.accounts.findOneAndDelete(
        { provider, accountId },
        { new: true },
      )
      return account
        ? { ...account.toObject(), id: account._id, password: null }
        : null
    },
  },
  session: {
    async findOne(token) {
      const session = await db.sessions.findOne({ token })
      const user = await db.users.findOne({ _id: session?.userId })
      return {
        user: user ? { ...user.toObject(), id: user._id } : null,
        expires: new Date(session?.expires ?? 0),
      }
    },
    async create(data) {
      const session = await db.sessions.create(data)
      return { ...session.toObject(), id: session._id }
    },
    async update(token, data) {
      const session = await db.sessions.findOneAndUpdate(
        { token },
        { $set: data },
        { new: true },
      )
      return session ? { ...session.toObject(), id: session._id } : null
    },
    async delete(token) {
      const session = await db.sessions.findOneAndDelete(
        { token },
        { new: true },
      )
      return session ? { ...session.toObject(), id: session._id } : null
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
