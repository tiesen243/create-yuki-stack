'use server'

import { sha256 } from '@oslojs/crypto/sha2'
import {
  encodeBase32LowerCaseNoPadding,
  encodeHexLowerCase,
} from '@oslojs/encoding'

import { and, db, eq } from '@yuki/db'
import { accounts, sessions, users } from '@yuki/db/schema'

import type { SessionResult } from '../types'
import { authOptions } from '../config'
import { Password } from './password'

async function createSession(
  userId: string,
): Promise<{ sessionToken: string; expires: Date }> {
  const bytes = new Uint8Array(20)
  crypto.getRandomValues(bytes)
  const sessionToken = encodeBase32LowerCaseNoPadding(bytes)

  const token = hashSHA256(sessionToken)
  const expires = new Date(Date.now() + authOptions.session.expires)

  // Store the hashed token in the database
  const [session] = await db
    .insert(sessions)
    .values({ token, expires, userId })
    .returning()

  if (!session) throw new Error('Failed to create session')

  // Return the unhashed token to the client along with expiration
  return { sessionToken, expires: session.expires }
}

async function validateToken(token: string): Promise<SessionResult> {
  const sessionToken = hashSHA256(token)

  // Lookup the session and associated user in the database
  const result = await db.query.sessions.findFirst({
    where: (sessions, { eq }) => eq(sessions.token, sessionToken),
    with: { user: true },
  })

  // Return early if session not found
  if (!result) return { expires: new Date() }

  const { user, ...session } = result
  const now = Date.now()

  // Check if session has expired
  if (now > session.expires.getTime()) {
    await db.delete(sessions).where(eq(sessions.token, sessionToken))
    return { expires: new Date() }
  }

  // Refresh session if it's beyond the refresh threshold
  if (now >= session.expires.getTime() - authOptions.session.expiresThreshold) {
    const newExpires = new Date(Date.now() + authOptions.session.expires)
    await db
      .update(sessions)
      .set({ expires: newExpires })
      .where(eq(sessions.token, sessionToken))
    session.expires = newExpires
  }

  return { user, expires: session.expires }
}

async function invalidateToken(token: string): Promise<void> {
  await db.delete(sessions).where(eq(sessions.token, hashSHA256(token)))
}

async function invalidateAllTokens(userId: string): Promise<void> {
  await db.delete(sessions).where(eq(sessions.userId, userId))
}

async function verifyCredentials(input: {
  email: string
  password: string
}): Promise<{ sessionToken: string; expires: Date }> {
  const [user] = await db
    .select({ id: users.id, password: accounts.password })
    .from(users)
    .where(eq(users.email, input.email))
    .innerJoin(
      accounts,
      and(eq(accounts.provider, 'credentials'), eq(accounts.userId, users.id)),
    )

  if (
    !user?.password ||
    !(await new Password().verify(user.password, input.password))
  )
    throw new Error('Invalid email or password')

  return createSession(user.id)
}

async function getOrCreateUserFromOAuth(data: {
  provider: string
  accountId: string
  name: string
  email: string
  image: string
}): Promise<typeof users.$inferSelect> {
  const { provider, accountId, email } = data

  const existingAccount = await db.query.accounts.findFirst({
    where: (accounts, { and, eq }) =>
      and(eq(accounts.provider, provider), eq(accounts.accountId, accountId)),
    with: { user: true },
  })
  if (existingAccount?.user) return existingAccount.user

  return await db.transaction(async (tx) => {
    const existingUser = await tx.query.users.findFirst({
      where: (user, { eq }) => eq(user.email, email),
    })

    if (existingUser) {
      await tx.insert(accounts).values({
        provider,
        accountId,
        userId: existingUser.id,
      })
      return existingUser
    }

    const [newUser] = await tx.insert(users).values(data).returning()
    if (!newUser) throw new Error('Failed to create user')

    await tx.insert(accounts).values({
      provider,
      accountId,
      userId: newUser.id,
    })

    return newUser
  })
}

function hashSHA256(str: string): string {
  return encodeHexLowerCase(sha256(new TextEncoder().encode(str)))
}

export {
  // Authentication
  verifyCredentials,
  getOrCreateUserFromOAuth,
  // Session management
  createSession,
  validateToken,
  invalidateToken,
  invalidateAllTokens,
}
