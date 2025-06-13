import { pgTable } from 'drizzle-orm/pg-core'

export const users = pgTable('user', (t) => ({
  id: t.text().primaryKey().notNull(),
  name: t.text().notNull(),
  email: t.text().notNull(),
  emailVerified: t.boolean().default(false),
  image: t.text(),
  createdAt: t.timestamp().notNull(),
  updatedAt: t.timestamp().notNull(),
}))

export const sessions = pgTable('session', (t) => ({
  id: t.text().primaryKey().notNull(),
  userId: t.text().notNull(),
  token: t.text().notNull(),
  expiresAt: t.timestamp().notNull(),
  ipAddress: t.text(),
  userAgent: t.text(),
  createdAt: t.timestamp().notNull(),
  updatedAt: t.timestamp().notNull(),
}))

export const accounts = pgTable('account', (t) => ({
  id: t.text().primaryKey().notNull(),
  userId: t.text().notNull(),
  accountId: t.text().notNull(),
  providerId: t.text().notNull(),
  accessToken: t.text(),
  refreshToken: t.text(),
  accessTokenExpiresAt: t.timestamp(),
  refreshTokenExpiresAt: t.timestamp(),
  scope: t.text(),
  idToken: t.text(),
  password: t.text(),
  createdAt: t.timestamp().notNull(),
  updatedAt: t.timestamp().notNull(),
}))

export const verifications = pgTable('verification', (t) => ({
  id: t.text().primaryKey().notNull(),
  identifier: t.text().notNull(),
  value: t.text().notNull(),
  expiresAt: t.timestamp().notNull(),
  createdAt: t.timestamp().notNull(),
  updatedAt: t.timestamp().notNull(),
}))
