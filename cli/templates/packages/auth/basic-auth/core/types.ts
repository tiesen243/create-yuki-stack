import type BaseProvider from '../providers/base'

export interface User {
  id: string
  email: string
  name: string
  image: string
}

export interface ProviderUserData {
  accountId: string
  email: string
  name: string
  image: string
}

export interface Session {
  user: User | null
  expires: Date
}

export interface SessionResult {
  token: string
  expires: Date
}

export interface OAuth2Token {
  access_token: string
  token_type: string
  expires_in: number
}

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

export interface AuthOptions {
  cookieKeys?: {
    token?: string
    state?: string
    code?: string
    redirect?: string
  }
  cookieOptions?: CookieOptions
  providers: Record<string, BaseProvider>
}
