import type {
  Account,
  CredentialsOptions,
  ProviderUserData,
  Session,
  SessionResult,
  User,
} from '@/types'
import BaseAdapter from '@/adapters/base'
import { encodeHex, generateSecureString, hashSecret } from '@/core/crypto'
import { generateCuid } from '@/core/cuid'
import { Password } from '@/core/password'

export class MemoryAdapter extends BaseAdapter {
  private users: User[] = []
  private accounts: Account[] = []
  private sessions: {
    token: string
    expires: Date
    userId: string
  }[] = []

  override async createSession(userId: string): Promise<SessionResult> {
    const token = generateSecureString()
    const hashToken = await hashSecret(token)
    const expires = new Date(Date.now() + this.opts.expiresIn)

    this.sessions.push({
      token: encodeHex(hashToken),
      expires,
      userId,
    })

    return { token, expires }
  }

  override async validateSessionToken(token: string): Promise<Session> {
    const hashToken = encodeHex(await hashSecret(token))

    const session = this.sessions.find((session) => session.token === hashToken)
    const user = this.users.find((user) => user.id === session?.userId)

    if (!session || !user) return { user: null, expires: new Date() }

    const now = Date.now()
    if (now > session.expires.getTime()) {
      this.sessions = this.sessions.filter(
        (session) => session.token !== hashToken,
      )
      return { user: null, expires: new Date() }
    }

    if (now >= session.expires.getTime() - this.opts.expireThreshold) {
      const newExpires = new Date(now + this.opts.expireThreshold)
      this.sessions = this.sessions.map((session) =>
        session.token === hashToken
          ? { ...session, expires: newExpires }
          : session,
      )
      session.expires = newExpires
    }

    return { ...session, user }
  }

  override async invalidateSessionToken(token: string): Promise<void> {
    const hashToken = encodeHex(await hashSecret(token))
    this.sessions = this.sessions.filter(
      (session) => session.token !== hashToken,
    )
  }

  override invalidateSessionTokens(userId: string): Promise<void> {
    this.sessions = this.sessions.filter((session) => session.userId !== userId)
    return Promise.resolve()
  }

  override async authenticateCredentials(
    opts: CredentialsOptions,
  ): Promise<SessionResult> {
    const user = this.users.find((user) => user.email === opts.email)
    if (!user) throw new Error('Invalid credentials')

    const account = this.accounts.find(
      (account) =>
        account.provider === 'credentials' && account.accountId === user.id,
    )
    if (!account) throw new Error('Invalid credentials')

    const isValid = await new Password().verify(
      account.password ?? '',
      opts.password,
    )
    if (!isValid) throw new Error('Invalid credentials')

    return this.createSession(user.id)
  }

  override async getOrCreateUser(
    opts: ProviderUserData,
  ): Promise<SessionResult> {
    const { provider, accountId, ...userData } = opts

    const [existingAccount, existingUser] = await Promise.all([
      this.accounts.find(
        (account) =>
          account.provider === provider && account.accountId === accountId,
      ),
      this.users.find((user) => user.email === userData.email),
    ])

    if (existingAccount) return this.createSession(existingAccount.userId)

    let userId: string

    if (existingUser) userId = existingUser.id
    else {
      const user = this.users.find((user) => user.email === userData.email)

      if (user) userId = user.id
      else {
        const newUser: User = { id: generateCuid(), ...userData }
        this.users.push(newUser)
        userId = newUser.id
      }
    }

    this.accounts.push({
      accountId,
      provider,
      userId,
    })

    return this.createSession(userId)
  }
}
