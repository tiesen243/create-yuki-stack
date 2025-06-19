import { db } from '@{{ name }}/db'

import type { Session, SessionResult } from './types'
import { authOptions } from '../config'
import { encodeHex, generateSecureString, hashSecret } from './crypto'
import { Password } from './password'

async function createSession(userId: string): Promise<SessionResult> {
  const token = generateSecureString()
  const hashToken = await hashSecret(token)
  const expires = new Date(Date.now() + authOptions.session.expiresIn)

  await db.sessions.create({
    token: encodeHex(hashToken),
    expires,
    userId,
  })

  return { token, expires }
}

async function validateSessionToken(token: string): Promise<Session> {
  const hashToken = encodeHex(await hashSecret(token))

  const session = await db.sessions.findOne({ token: hashToken })
  const user = await db.users.findOne({ _id: session?.userId })

  if (!session || !user) return { user: null, expires: new Date() }

  const now = Date.now()
  if (now > session.expires.getTime()) {
    await db.sessions.deleteOne({ token: hashToken })
    return { user: null, expires: new Date() }
  }

  if (now >= session.expires.getTime() - authOptions.session.expiresThreshold) {
    const newExpires = new Date(now + authOptions.session.expiresIn)
    await db.sessions.updateOne({ token: hashToken }, { expires: newExpires })
    session.expires = newExpires
  }

  return { user, expires: session.expires }
}

async function authenticateCredentials(opts: {
  email: string
  password: string
}): Promise<SessionResult> {
  const user = await db.users.findOne({ email: opts.email })
  if (!user) throw new Error('Invalid credentials')

  const account = await db.accounts.findOne({
    provider: 'credentials',
    accountId: user._id,
  })
  if (!account) throw new Error('Invalid credentials')

  const isValid = await new Password().verify(
    account.password ?? '',
    opts.password,
  )
  if (!isValid) throw new Error('Invalid credentials')

  return createSession(user._id)
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
    db.accounts.findOne({ provider, accountId }),
    db.users.findOne({ email: userData.email }),
  ])

  if (existingAccount) return createSession(existingAccount.userId)

  let userId: string

  if (existingUser) userId = existingUser._id
  else {
    const userInTx = await db.users.findOne({ email: userData.email })

    if (userInTx) userId = userInTx._id
    else {
      const newUser = await db.users.create(userData)
      userId = newUser._id
    }
  }

  await db.accounts.create({ accountId, provider, userId })

  return createSession(userId)
}

async function invalidateSessionToken(token: string) {
  const hashToken = encodeHex(await hashSecret(token))
  await db.sessions.deleteOne({ where: { token: hashToken } })
}

async function invalidateSessionTokens(userId: string) {
  await db.sessions.deleteMany({ userId })
}

export {
  authenticateCredentials,
  createSession,
  getOrCreateUser,
  validateSessionToken,
  invalidateSessionToken,
  invalidateSessionTokens,
}

