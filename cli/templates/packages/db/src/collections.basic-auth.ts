import type { Model } from 'mongoose'
import mongoose from 'mongoose'

export interface User {
  _id: string
  name: string
  email: string
  image: string
  createdAt: Date
  updatedAt: Date
}

const userSchema = new mongoose.Schema<User>(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    image: { type: String, required: true },
  },
  { timestamps: { createdAt: 'createdAt', updatedAt: 'updatedAt' } },
)

export const users: Model<User> =
  mongoose.models.user ?? mongoose.model<User>('user', userSchema)

export interface Account {
  provider: string
  accountId: string
  password?: string
  userId: string
}

const accountSchema = new mongoose.Schema<Account>({
  provider: { type: String, required: true },
  accountId: { type: String, required: true },
  password: { type: String, required: false },
  userId: { type: String, required: true },
})

accountSchema.index({ provider: 1, accountId: 1 }, { unique: true })

export const accounts: Model<Account> =
  mongoose.models.account ?? mongoose.model<Account>('account', accountSchema)

export interface Session {
  token: string
  expires: Date
  userId: string
}

const sessionSchema = new mongoose.Schema<Session>({
  token: { type: String, required: true, unique: true },
  expires: { type: Date, required: true },
  userId: { type: String, required: true },
})

export const sessions: Model<Session> =
  mongoose.models.session ?? mongoose.model<Session>('session', sessionSchema)

