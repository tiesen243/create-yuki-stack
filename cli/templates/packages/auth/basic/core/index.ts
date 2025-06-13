import { generateCodeVerifier, generateState } from 'arctic'

import type BaseProvider from '../providers/base'
import type { Session } from './adapter'
import type { CookieOptions } from './cookies'
import {
  authenticateCredentials,
  getOrCreateUser,
  invalidateSessionToken,
  validateSessionToken,
} from './adapter'
import Cookies from './cookies'

export interface AuthOptions {
  cookieKey?: string
  cookieOptions?: CookieOptions
  session?: { expiresIn: number; updateInterval: number }
  providers: Record<string, BaseProvider>
}

export function Auth(opts: AuthOptions) {
  const options = {
    ...DEFAULT_OPTIONS,
    ...opts,
  } satisfies Required<AuthOptions>

  /**
   * Auth
   * Returns the current session if it exists.
   *
   * @param opts - Options object containing request headers
   * @param opts.headers - HTTP headers from the incoming request
   * @returns Promise that resolves to a Session object (either valid with user data or invalid with null user)
   */
  const auth = async (opts: { headers: Headers }): Promise<Session> => {
    const cookies = new Cookies(opts as Request)
    const token = cookies.get(options.cookieKey) ?? ''
    return await validateSessionToken(token)
  }

  /**
   * Sign Out
   * Invalidates the current session token and removes it from cookies.
   *
   * @param opts - Options object containing request headers
   * @param opts.headers - HTTP headers from the incoming request
   * @returns Promise that resolves to a success message or throws an error if the token is invalid
   */
  const signOut = async (opts: { headers: Headers }): Promise<void> => {
    const cookies = new Cookies(opts as Request)
    const token = cookies.get(options.cookieKey) ?? ''
    await invalidateSessionToken(token)
  }

  return {
    auth,
    signIn: authenticateCredentials,
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

            const state = generateState()
            const codeVerifier = generateCodeVerifier()
            const redirectUrl = searchParams.get('redirect_to') ?? '/'

            const callbackUrl = await provider.getAuthorizationUrl(
              state,
              codeVerifier,
            )
            response = new Response(null, {
              status: 302,
              headers: { Location: callbackUrl.toString() },
            })

            const opts = { Path: '/', MaxAge: 1000 * 60 * 5 }
            cookies.set(response, 'auth:state', state, opts)
            cookies.set(response, 'auth:code', codeVerifier, opts)
            cookies.set(response, 'auth:redirect', redirectUrl, opts)
          } else if (/^\/api\/auth\/callback\/[^/]+$/.test(pathname)) {
            const provider = pathname.split('/').pop() ?? ''
            const pIns = options.providers[provider]
            if (!pIns) throw new Error(`Provider ${provider} not found`)

            const code = searchParams.get('code') ?? ''
            const state = searchParams.get('state') ?? ''
            const storedState = cookies.get('auth:state') ?? ''
            const codeVerifier = cookies.get('auth:code') ?? ''
            const redirectTo = cookies.get('auth:redirect') ?? '/'
            if (state !== storedState || !code || !codeVerifier)
              throw new Error('Invalid state or code')

            const userData = await pIns.fetchUserData(code, codeVerifier)
            const session = await getOrCreateUser({ ...userData, provider })

            const redirectUrl = new URL(redirectTo, request.url)
            response = new Response(null, {
              status: 302,
              headers: { Location: redirectUrl.toString() },
            })
            cookies.set(response, options.cookieKey, session.token, {
              ...options.cookieOptions,
              expires: session.expires,
            })
            cookies.delete(response, 'auth:state')
            cookies.delete(response, 'auth:code')
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
            const result = await authenticateCredentials(body)

            response = Response.json(result)
            cookies.set(response, options.cookieKey, result.token, {
              ...options.cookieOptions,
              expires: result.expires,
            })
          } else if (pathname === '/api/auth/sign-out') {
            await signOut(request)
            response = Response.json({ error: 'Signed out successfully' })
            cookies.delete(response, options.cookieKey)
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

function setCorsHeaders(response: Response): Response {
  response.headers.set('Access-Control-Allow-Origin', '*')
  response.headers.set('Access-Control-Request-Method', '*')
  response.headers.set('Access-Control-Allow-Methods', 'OPTIONS, GET, POST')
  response.headers.set('Access-Control-Allow-Headers', '*')
  return response
}

const DEFAULT_OPTIONS: Required<AuthOptions> = {
  cookieKey: 'auth:token',
  cookieOptions: {
    path: '/',
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'Lax',
  },
  session: {
    expiresIn: 1000 * 60 * 60 * 24 * 30, // 30 days
    updateInterval: 1000 * 60 * 60 * 24, // 24 hours
  },
  providers: {},
}
