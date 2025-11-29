import { BaseProvider } from '@/providers/base'

export interface User {
  id: string
  name: string
  email: string
  image: string | null
  createdAt: Date
  updatedAt: Date
}

export interface Account {
  id: string
  userId: string
  provider: string
  accountId: string
  password: string | null
}

export interface Session {
  id: string
  userId: string
  token: string
  expiresAt: Date
  ipAddress: string | null
  userAgent: string | null
}

export type SessionWithUser = Pick<
  Session,
  'token' | 'expiresAt' | 'ipAddress' | 'userAgent'
> & {
  user: Pick<User, 'id' | 'name' | 'email' | 'image'> | null
}

export interface OAuthAccount {
  id: string
  name: string
  email: string
  image: string | null
}

export interface OAuth2Token {
  access_token: string
  token_type: string
  expires_in: number
}

export interface AuthConfig {
  providers?: BaseProvider[]
  secret?: string

  session?: {
    expiresIn?: number
    expiresThreshold?: number
  }

  keys?: {
    token?: string
    state?: string
    codeVerifier?: string
    redirectUri?: string
  }

  cookie?: {
    domain?: string
    path?: string
    httpOnly?: boolean
    secure?: boolean
    sameSite?: 'lax' | 'strict' | 'none'
    maxAge?: number
  }

  adapter: {
    user: {
      find(identifier: string): Promise<User | null>
      create(
        data: Pick<User, 'name' | 'email' | 'image'>,
      ): Promise<Pick<User, 'id'>>
    }
    account: {
      find(
        provider: string,
        accountId: string,
      ): Promise<Pick<Account, 'id' | 'userId' | 'password'> | null>
      create(data: Omit<Account, 'id'>): Promise<Pick<Account, 'id'>>
    }
    session: {
      find(id: string): Promise<SessionWithUser | null>
      create(data: Session): Promise<void>
      update(
        token: string,
        data: Partial<Omit<Session, 'id' | 'token' | 'userId'>>,
      ): Promise<void>
      delete(id: string): Promise<void>
    }
  }
}
