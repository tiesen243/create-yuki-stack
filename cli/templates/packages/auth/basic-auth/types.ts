import type BaseProvider from '@/providers/base'

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

export interface User  {
  id: string
  name: string
  email: string
}

export interface Account {
  id: string
  userId: string
  provider: string
  accountId: string
  password: string | null
}

export interface NewAccount {
  id?: string
  userId: string
  provider: string
  accountId: string
}

export interface Session {
  token: string
  user: User | null
  expires: Date 
}

export interface NewSession extends Session {
  token: string
}

export interface OauthAccount {
  accountId: string
  email: string
  name: string
  image: string
}

export interface DatabaseAdapter {
  getUserByEmail(email: string): Promise<Pick<User, 'id'> | null>
  createUser(data: Omit<OauthAccount, 'accountId'>): Promise<User['id'] | null>

  getAccount(provider: string, accountId: string): Promise<Account | null>
  createAccount(data: NewAccount): Promise<void>

  getSessionAndUser(token: string): Promise<Omit<Session, 'token'> | null>
  createSession(data: NewSession): Promise<void>
  updateSession(token: string, data: Partial<NewSession>): Promise<void>
  deleteSession(token: string): Promise<void>
  deleteSessionsByUserId(userId: string): Promise<void>
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
