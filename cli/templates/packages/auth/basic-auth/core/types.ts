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
  user: {
    findOne: (email: string) => Promise<User | null>
    create: (data: Omit<User, 'id'>) => Promise<User | null>
    update: (email: string, data: Partial<User>) => Promise<User | null>
    delete: (email: string) => Promise<User | null>
  }
  account: {
    findOne: (provider: string, accountId: string) => Promise<Account | null>
    create: (data: Account) => Promise<Account | null>
    update: (
      accountId: string,
      data: Partial<Account>,
    ) => Promise<Account | null>
    delete: (provider:string, accountId: string) => Promise<Account | null>
  }
  session: {
    findOne: (token: string) => Promise<SessionResult | null>
    create: (data: Session) => Promise<Session | null>
    update: (token: string, data: Partial<Session>) => Promise<Session | null>
    delete: (token: string) => Promise<Session | null>
  }
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
