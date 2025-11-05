import { relations } from 'drizzle-orm'
import { pgTable, primaryKey } from 'drizzle-orm/pg-core'

export const users = pgTable('user', (t) => ({
  id: t.uuid().primaryKey().defaultRandom().notNull(),
  name: t.varchar({ length: 255 }).notNull(),
  email: t.varchar({ length: 255 }).unique().notNull(),
  image: t.varchar({ length: 255 }).notNull(),
  createdAt: t.timestamp().defaultNow().notNull(),
  updatedAt: t
    .timestamp({ mode: 'date', withTimezone: true })
    .defaultNow()
    .$onUpdateFn(() => new Date())
    .notNull(),
}))

export const usersRelations = relations(users, ({ many }) => ({
  accounts: many(accounts),
  sessions: many(sessions),
}))

export const accounts = pgTable(
  'account',
  (t) => ({
    id: t.uuid().primaryKey().defaultRandom().notNull(),
    provider: t.varchar({ length: 255 }).notNull(),
    accountId: t.varchar({ length: 255 }).notNull(),
    userId: t
      .uuid()
      .notNull()
      .references(() => users.id, { onDelete: 'cascade' }),
    password: t.varchar({ length: 255 }),
  }),
  (account) => [primaryKey({ columns: [account.provider, account.accountId] })],
)

export const accountsRelations = relations(accounts, ({ one }) => ({
  user: one(users, { fields: [accounts.userId], references: [users.id] }),
}))

export const sessions = pgTable('session', (t) => ({
  token: t.varchar({ length: 255 }).primaryKey().notNull(),
  expires: t.timestamp({ mode: 'date', withTimezone: true }).notNull(),
  userId: t
    .uuid()
    .notNull()
    .references(() => users.id, { onDelete: 'cascade' }),
}))

export const sessionRelations = relations(sessions, ({ one }) => ({
  user: one(users, { fields: [sessions.userId], references: [users.id] }),
}))
