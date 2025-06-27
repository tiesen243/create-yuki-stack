import type BaseProvider from '../providers/base'

export interface CookieOptions {
  domain?: string
  expires?: Date | string | number
  httpOnly?: boolean
  maxAge?: number
  path?: string
  sameSite?: 'Strict' | 'Lax' | 'None'
  secure?: boolean
  [key: string]: unknown
}

export interface OAuth2Token {
  access_token: string
  token_type: string
  expires_in: number
}

export interface User {
  id: string
  email: string
  name: string
  image: string
}

export interface Account {
  provider: string
  accountId: string
  userId: string
  password: string | null
}

export interface OauthAccount {
  accountId: string
  email: string
  name: string
  image: string
}

export interface Session {
  token: string
  userId: string
  expires: Date
}

export interface SessionResult {
  user: User | null
  expires: Date
}

export interface DatabaseAdapter {
  getUserByEmail(email: string): Promise<User | null>
  createUser(data: Omit<User, 'id'>): Promise<User | null>

  getAccount(provider: string, accountId: string): Promise<Account | null>
  createAccount(data: Account): Promise<Account | null>

  getSessionAndUser(token: string): Promise<SessionResult | null>
  createSession(data: Session): Promise<Session | null>
  updateSession(token: string, data: Partial<Session>): Promise<Session | null>
  deleteSession(token: string): Promise<void>
}

export interface AuthOptions {
  adapter: DatabaseAdapter
  providers: Record<string, BaseProvider>
  session: {
    expiresIn: number
    expiresThreshold: number
  }
  cookieKeys?: {
    token?: string
    state?: string
    code?: string
    redirect?: string
  }
  cookieOptions?: CookieOptions
}
