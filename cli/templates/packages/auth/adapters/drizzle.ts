'use server'

import { db, eq } from '@{{ name }}/db'
import { accounts, sessions, users } from '@{{ name }}/db/schema'

import { authOptions } from '../config'
import { encodeHex, generateSecureString, hashSecret } from './crypto'
import { Password } from './password'

export interface ValidSession {
  user: typeof users.$inferSelect
  expires: Date
}
export interface InvalidSession {
  user: null
  expires: Date
}
export type Session = ValidSession | InvalidSession

interface SessionResult {
  token: string
  expires: Date
}

async function createSession(userId: string): Promise<SessionResult> {
  const token = generateSecureString()
  const hashToken = await hashSecret(token)
  const expires = new Date(Date.now() + authOptions.session.expiresIn)

  await db.insert(sessions).values({
    token: encodeHex(hashToken),
    expires,
    userId,
  })

  return { token, expires }
}

async function validateSessionToken(token: string): Promise<Session> {
  const hashToken = encodeHex(await hashSecret(token))

  const result = await db.query.sessions.findFirst({
    where: (sessions, { eq }) => eq(sessions.token, hashToken),
    with: { user: true },
  })

  if (!result) return { user: null, expires: new Date() }

  const now = Date.now()
  if (now > result.expires.getTime()) {
    await db.delete(sessions).where(eq(sessions.token, hashToken))
    return { user: null, expires: new Date() }
  }

  if (now >= result.expires.getTime() - authOptions.session.updateInterval) {
    const newExpires = new Date(now + authOptions.session.expiresIn)
    await db
      .update(sessions)
      .set({ expires: newExpires })
      .where(eq(sessions.token, hashToken))
    result.expires = newExpires
  }

  return result
}

async function authenticateCredentials(opts: {
  email: string
  password: string
}): Promise<SessionResult> {
  const user = await db.query.users.findFirst({
    where: (table, { eq }) => eq(table.email, opts.email),
  })
  if (!user) throw new Error('Invalid credentials')
  const account = await db.query.accounts.findFirst({
    where: (table, { and, eq }) =>
      and(eq(table.provider, 'credentials'), eq(table.accountId, user.id)),
  })
  if (!account) throw new Error('Invalid credentials')

  const isValid = await new Password().verify(
    account.password ?? '',
    opts.password,
  )
  if (!isValid) throw new Error('Invalid credentials')

  return createSession(user.id)
}

async function getOrCreateUser(opts: {
  provider: string
  accountId: string
  email: string
  name: string
  image: string
}): Promise<SessionResult> {
  const { provider, accountId, ...userData } = opts

  const [existingAccount, existingUser] = await Promise.all([
    db.query.accounts.findFirst({
      where: (t, { and, eq }) =>
        and(eq(t.provider, provider), eq(t.accountId, accountId)),
    }),
    db.query.users.findFirst({
      where: (table, { eq }) => eq(table.email, userData.email),
    }),
  ])

  if (existingAccount) return createSession(existingAccount.userId)

  let userId: string
  if (existingUser) userId = existingUser.id
  else {
    const result = await db.transaction(async (tx) => {
      const userInTx = await tx.query.users.findFirst({
        where: (table, { eq }) => eq(table.email, userData.email),
      })

      if (userInTx) {
        return { userId: userInTx.id, isNewUser: false }
      }

      const [newUser] = await tx
        .insert(users)
        .values(userData)
        .returning({ id: users.id })
      return { userId: newUser?.id ?? '', isNewUser: true }
    })

    userId = result.userId
  }

  await db.insert(accounts).values({ accountId, provider, userId })
  return createSession(userId)
}

async function invalidateSessionToken(token: string) {
  const hashToken = encodeHex(await hashSecret(token))
  await db.delete(sessions).where(eq(sessions.token, hashToken))
}

async function invalidateSessionTokens(userId: string) {
  await db.delete(sessions).where(eq(sessions.userId, userId))
}

export {
  authenticateCredentials,
  createSession,
  getOrCreateUser,
  validateSessionToken,
  invalidateSessionToken,
  invalidateSessionTokens,
}
