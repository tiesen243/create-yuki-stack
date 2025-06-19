import { db, eq } from '@{{ name }}/db'
import { accounts, sessions, users } from '@{{ name }}/db/schema'

import type { Session, SessionResult } from './types'
import { encodeHex, generateSecureString, hashSecret } from './crypto'
import { Password } from './password'

const SESSION_EXPIRES_IN = 1000 * 60 * 60 * 24 * 30 // 30 days in seconds
const SESSION_EXPIRES_THRESHOLD = 1000 * 60 * 60 * 24 * 7 // 24 hours in seconds

async function createSession(userId: string): Promise<SessionResult> {
  const token = generateSecureString()
  const hashToken = await hashSecret(token)
  const expires = new Date(Date.now() + SESSION_EXPIRES_IN)

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

  if (now >= result.expires.getTime() - SESSION_EXPIRES_THRESHOLD) {
    const newExpires = new Date(now + SESSION_EXPIRES_IN)
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

  const { userId } = await db.transaction(async (tx) => {
    let userId: string

    if (existingUser) userId = existingUser.id
    else {
      const userInTx = await tx.query.users.findFirst({
        where: (table, { eq }) => eq(table.email, userData.email),
      })

      if (userInTx) userId = userInTx.id
      else {
        const [newUser] = await tx
          .insert(users)
          .values(userData)
          .returning({ id: users.id })
        userId = newUser?.id ?? ''
      }
    }

    await tx.insert(accounts).values({ accountId, provider, userId })
    return { userId }
  })

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
