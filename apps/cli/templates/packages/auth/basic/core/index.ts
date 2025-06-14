import type { Session } from './adapter'
import type { AuthOptions } from './types'
import {
  authenticateCredentials,
  getOrCreateUser,
  invalidateSessionToken,
  validateSessionToken,
} from './adapter'
import Cookies from './cookies'
import { generateRandomString } from './crypto'

export function Auth(opts: AuthOptions) {
  const options = {
    ...DEFAULT_OPTIONS,
    ...opts,
    cookieKeys: { ...DEFAULT_OPTIONS.cookieKeys, ...opts.cookieKeys },
    cookieOptions: { ...DEFAULT_OPTIONS.cookieOptions, ...opts.cookieOptions },
  } satisfies Required<AuthOptions>

  const { cookieKeys, cookieOptions, providers } = options

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
    const token = cookies.get(cookieKeys.token) ?? ''
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
    const token = cookies.get(cookieKeys.token) ?? ''
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
            const provider = pathname.split('/').pop() ?? ''
            const instance = providers[provider]
            if (!instance) throw new Error(`Provider ${provider} not found`)

            const state = generateRandomString()
            const codeVerifier = generateRandomString()
            const redirectUrl = searchParams.get('redirect_to') ?? '/'

            const callbackUrl = await instance.createAuthorizationUrl(
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
            const instance = options.providers[provider]
            if (!instance) throw new Error(`Provider ${provider} not found`)

            const code = searchParams.get('code') ?? ''
            const state = searchParams.get('state') ?? ''
            const storedState = cookies.get(cookieKeys.state) ?? ''
            const codeVerifier = cookies.get(cookieKeys.code) ?? ''
            const redirectTo = cookies.get(cookieKeys.redirect) ?? '/'
            if (state !== storedState || !code || !codeVerifier)
              throw new Error('Invalid state or code')

            const userData = await instance.fetchUserData(code, codeVerifier)
            const session = await getOrCreateUser({ ...userData, provider })

            const redirectUrl = new URL(redirectTo, request.url)
            response = new Response(null, {
              status: 302,
              headers: { Location: redirectUrl.toString() },
            })
            cookies.set(response, cookieKeys.token, session.token, {
              ...cookieOptions,
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
            const result = await authenticateCredentials(body)

            response = Response.json(result)
            cookies.set(response, cookieKeys.token, result.token, {
              ...cookieOptions,
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

function setCorsHeaders(response: Response): Response {
  response.headers.set('Access-Control-Allow-Origin', '*')
  response.headers.set('Access-Control-Request-Method', '*')
  response.headers.set('Access-Control-Allow-Methods', 'OPTIONS, GET, POST')
  response.headers.set('Access-Control-Allow-Headers', '*')
  return response
}

const DEFAULT_OPTIONS = {
  cookieKeys: {
    token: 'auth.token',
    state: 'auth.state',
    code: 'auth.code',
    redirect: 'auth.redirect',
  },
  cookieOptions: {
    path: '/',
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'Lax',
  },
  session: {
    expiresIn: 1000 * 60 * 60 * 24 * 30, // 30 days
    expiresThreshold: 1000 * 60 * 60 * 24, // 24 hours
  },
  providers: {},
} as const satisfies Required<AuthOptions>
