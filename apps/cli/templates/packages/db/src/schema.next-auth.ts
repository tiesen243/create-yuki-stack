import { pgTable, primaryKey } from 'drizzle-orm/pg-core'

export const users = pgTable('user', (t) => ({
  id: t
    .text('id')
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  name: t.text('name'),
  email: t.text('email').unique(),
  emailVerified: t.timestamp('emailVerified', { mode: 'date' }),
  image: t.text('image'),
}))

export const accounts = pgTable(
  'account',
  (t) => ({
    userId: t
      .text('userId')
      .notNull()
      .references(() => users.id, { onDelete: 'cascade' }),
    type: t.text('type').notNull(),
    provider: t.text('provider').notNull(),
    providerAccountId: t.text('providerAccountId').notNull(),
    refresh_token: t.text('refresh_token'),
    access_token: t.text('access_token'),
    expires_at: t.integer('expires_at'),
    token_type: t.text('token_type'),
    scope: t.text('scope'),
    id_token: t.text('id_token'),
    session_state: t.text('session_state'),
  }),
  (account) => [
    {
      compoundKey: primaryKey({
        columns: [account.provider, account.providerAccountId],
      }),
    },
  ],
)

export const sessions = pgTable('session', (t) => ({
  sessionToken: t.text('sessionToken').primaryKey(),
  userId: t
    .text('userId')
    .notNull()
    .references(() => users.id, { onDelete: 'cascade' }),
  expires: t.timestamp('expires', { mode: 'date' }).notNull(),
}))

export const verificationTokens = pgTable(
  'verificationToken',
  (t) => ({
    identifier: t.text('identifier').notNull(),
    token: t.text('token').notNull(),
    expires: t.timestamp('expires', { mode: 'date' }).notNull(),
  }),
  (verificationToken) => [
    {
      compositePk: primaryKey({
        columns: [verificationToken.identifier, verificationToken.token],
      }),
    },
  ],
)

export const authenticators = pgTable(
  'authenticator',
  (t) => ({
    credentialID: t.text('credentialID').notNull().unique(),
    userId: t
      .text('userId')
      .notNull()
      .references(() => users.id, { onDelete: 'cascade' }),
    providerAccountId: t.text('providerAccountId').notNull(),
    credentialPublicKey: t.text('credentialPublicKey').notNull(),
    counter: t.integer('counter').notNull(),
    credentialDeviceType: t.text('credentialDeviceType').notNull(),
    credentialBackedUp: t.boolean('credentialBackedUp').notNull(),
    transports: t.text('transports'),
  }),
  (authenticator) => [
    {
      compositePK: primaryKey({
        columns: [authenticator.userId, authenticator.credentialID],
      }),
    },
  ],
)
