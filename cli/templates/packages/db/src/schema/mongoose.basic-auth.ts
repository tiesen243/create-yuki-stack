import mongoose, { Schema, Document } from 'mongoose'

export interface IUser extends Document {
  name: string
  email: string
  image: string | null
  createdAt: Date
  updatedAt: Date
}

const UserSchema = new Schema<IUser>({
  name: { type: String, required: true, maxlength: 100 },
  email: { type: String, required: true, maxlength: 255, unique: true },
  image: { type: String, maxlength: 500, default: null },
  createdAt: { type: Date, default: Date.now, required: true },
  updatedAt: { type: Date, default: Date.now, required: true },
})

export const user =
  mongoose.models.User ?? mongoose.model<IUser>('User', UserSchema)

export interface IAccount extends Document {
  userId: mongoose.Types.ObjectId
  provider: string
  accountId: string
  password: string | null
}

const AccountSchema = new Schema<IAccount>({
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  provider: { type: String, required: true, maxlength: 50 },
  accountId: { type: String, required: true, maxlength: 100 },
  password: { type: String, default: null },
})

AccountSchema.index({ provider: 1, accountId: 1 }, { unique: true })

export const account =
  mongoose.models.Account ?? mongoose.model<IAccount>('Account', AccountSchema)

// Remove this model if you use JWT strategy
export interface ISession extends Document {
  id: string
  userId: mongoose.Types.ObjectId
  token: string
  expiresAt: Date
  ipAddress: string | null
  userAgent: string | null
}

const SessionSchema = new Schema<ISession>({
  id: { type: String, required: true, unique: true },
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  token: { type: String, required: true, maxlength: 64, unique: true },
  expiresAt: { type: Date, required: true },
  ipAddress: { type: String, maxlength: 45, default: null },
  userAgent: { type: String, default: null },
})

export const session =
  mongoose.models.Session ?? mongoose.model<ISession>('Session', SessionSchema)
