import type BaseAdapter from '@/adapters/base'
import type { CookieOptions } from '@/core/cookies'
import type BaseProvider from '@/providers/base'
import type { CredentialsOptions, Session } from '@/types'
import { MemoryAdapter } from '@/adapters/memory'
import Cookies from '@/core/cookies'
import { generateSecureString } from './crypto'

export interface AuthOptions {
  adapter?: BaseAdapter
  cookieKeys?: {
    token?: string
    state?: string
    code?: string
    redirect?: string
  }
  cookieOptions?: CookieOptions
  providers: Record<string, BaseProvider>
}

export const YukiAuth = (opts: AuthOptions) => {
  const options = {
    ...DEFAULT_OPTIONS,
    ...opts,
    cookieKeys: { ...DEFAULT_OPTIONS.cookieKeys, ...opts.cookieKeys },
  }
  const { adapter, cookieKeys } = options

  const auth = async (opts: { headers: Headers }): Promise<Session> => {
    const cookies = new Cookies(opts as Request)
    const token = cookies.get(cookieKeys.token) ?? ''
    return await adapter.validateSessionToken(token)
  }

  const signOut = async (opts: { headers: Headers }): Promise<void> => {
    const cookies = new Cookies(opts as Request)
    const token = cookies.get(cookieKeys.token) ?? ''
    await adapter.invalidateSessionToken(token)
  }

  return {
    auth,

    signIn: (opts: CredentialsOptions) => adapter.authenticateCredentials(opts),

    signOut,

    handlers: {
      GET: async (request: Request) => {
        let response = new Response(null, { status: 404 })
        const { pathname, searchParams } = new URL(request.url)
        const cookies = new Cookies(request)

        try {
          if (pathname === '/api/auth/get-session') {
            const session = await auth(request)
            response = Response.json(session)
          } else if (/^\/api\/auth\/[^/]+$/.test(pathname)) {
            const providerName = pathname.split('/').pop() ?? ''
            const provider = options.providers[providerName]
            if (!provider) throw new Error(`Provider ${providerName} not found`)

            const state = generateSecureString()
            const codeVerifier = generateSecureString()
            const redirectUrl = searchParams.get('redirect_to') ?? '/'

            const callbackUrl = await provider.createAuthorizationUrl(
              state,
              codeVerifier,
            )
            response = new Response(null, {
              status: 302,
              headers: { Location: callbackUrl.toString() },
            })

            const opts = { Path: '/', MaxAge: 1000 * 60 * 5 }
            cookies.set(response, cookieKeys.state, state, opts)
            cookies.set(response, cookieKeys.code, codeVerifier, opts)
            cookies.set(response, cookieKeys.redirect, redirectUrl, opts)
          } else if (/^\/api\/auth\/callback\/[^/]+$/.test(pathname)) {
            const provider = pathname.split('/').pop() ?? ''
            const pIns = options.providers[provider]
            if (!pIns) throw new Error(`Provider ${provider} not found`)

            const code = searchParams.get('code') ?? ''
            const state = searchParams.get('state') ?? ''
            const storedState = cookies.get(cookieKeys.state) ?? ''
            const codeVerifier = cookies.get(cookieKeys.code) ?? ''
            const redirectTo = cookies.get(cookieKeys.redirect) ?? '/'
            if (state !== storedState || !code || !codeVerifier)
              throw new Error('Invalid state or code')

            const userData = await pIns.fetchUserData(code, codeVerifier)
            const session = await adapter.getOrCreateUser({
              ...userData,
              provider,
            })

            const redirectUrl = new URL(redirectTo, request.url)
            response = new Response(null, {
              status: 302,
              headers: { Location: redirectUrl.toString() },
            })
            cookies.set(response, options.cookieKeys.token, session.token, {
              ...options.cookieOptions,
              expires: session.expires,
            })
            cookies.delete(response, cookieKeys.state)
            cookies.delete(response, cookieKeys.code)
            cookies.delete(response, cookieKeys.redirect)
          }
        } catch (error) {
          if (error instanceof Error)
            response = new Response(error.message, { status: 500 })
          else response = new Response('Internal Server Error', { status: 500 })
        }

        return setCorsHeaders(response)
      },
      POST: async (request: Request) => {
        let response = new Response(null, { status: 404 })
        const cookies = new Cookies(request)
        const { pathname } = new URL(request.url)

        try {
          if (pathname === '/api/auth/sign-in') {
            const body = (await request.json()) as never
            const result = await adapter.authenticateCredentials(body)

            response = Response.json(result)
            cookies.set(response, cookieKeys.token, result.token, {
              ...options.cookieOptions,
              expires: result.expires,
            })
          } else if (pathname === '/api/auth/sign-out') {
            await signOut(request)
            response = Response.json({ error: 'Signed out successfully' })
            cookies.delete(response, cookieKeys.token)
          }
        } catch (error) {
          if (error instanceof Error)
            response = Response.json({ error: error.message }, { status: 500 })
          else
            response = Response.json(
              { error: 'Internal Server Error' },
              { status: 500 },
            )
        }

        return setCorsHeaders(response)
      },
    },
  }
}

const DEFAULT_OPTIONS = {
  adapter: new MemoryAdapter(),
  cookieKeys: {
    token: 'auth.token',
    state: 'auth.state',
    code: 'auth.code',
    redirect: 'auth.redirect',
  },
  cookieOptions: {
    Path: '/',
    HttpOnly: true,
    Secure: process.env.NODE_ENV === 'production',
    SameSite: 'Lax',
  },
  providers: {},
} satisfies Required<AuthOptions>

function setCorsHeaders(response: Response): Response {
  response.headers.set('Access-Control-Allow-Origin', '*')
  response.headers.set('Access-Control-Request-Method', '*')
  response.headers.set('Access-Control-Allow-Methods', 'OPTIONS, GET, POST')
  response.headers.set('Access-Control-Allow-Headers', '*')
  return response
}
