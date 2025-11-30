import { index, pgTable, uniqueIndex } from 'drizzle-orm/pg-core'

import { createId } from '@{{ name }}/lib/create-id'

export const users = pgTable(
  'users',
  (t) => ({
    id: t.varchar({ length: 24 }).$default(createId).primaryKey(),
    name: t.varchar({ length: 100 }).notNull(),
    email: t.varchar({ length: 255 }).notNull(),
    image: t.varchar({ length: 500 }),
    createdAt: t.timestamp({ mode: 'date' }).defaultNow().notNull(),
    updatedAt: t.timestamp({ mode: 'date' }).defaultNow().notNull(),
  }),
  (t) => [
    index('users_name_idx').on(t.name),
    uniqueIndex('users_email_uq_idx').on(t.email),
  ],
)

export const accounts = pgTable(
  'accounts',
  (t) => ({
    id: t.varchar({ length: 24 }).$default(createId).primaryKey(),
    userId: t
      .varchar({ length: 24 })
      .notNull()
      .references(() => users.id, { onDelete: 'cascade' }),
    provider: t.varchar({ length: 50 }).notNull(),
    accountId: t.varchar({ length: 100 }).notNull(),
    password: t.text(),
  }),
  (t) => [
    index('accounts_user_id_idx').on(t.userId),
    uniqueIndex('accounts_user_id_provider_uq_idx').on(t.userId, t.provider),
    uniqueIndex('accounts_provider_account_id_uq_idx').on(
      t.provider,
      t.accountId,
    ),
  ],
)

// Remove this table if you use JWT strategy
export const sessions = pgTable(
  'sessions',
  (t) => ({
    id: t.varchar({ length: 24 }).primaryKey(),
    userId: t
      .varchar({ length: 24 })
      .notNull()
      .references(() => users.id, { onDelete: 'cascade' }),
    token: t.varchar({ length: 64 }).notNull(),
    expiresAt: t.timestamp({ mode: 'date' }).notNull(),
    ipAddress: t.varchar({ length: 45 }),
    userAgent: t.text(),
  }),
  (t) => [
    index('sessions_user_id_idx').on(t.userId),
    uniqueIndex('sessions_id_token_uq_idx').on(t.id, t.token),
  ],
)
