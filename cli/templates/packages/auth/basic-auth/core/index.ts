import type { AuthConfig, Session, SessionWithUser } from '@/types'
import {
  constantTimeEqual,
  decodeHex,
  encodeHex,
  generateSecureString,
  generateStateOrCode,
  hashSecret,
} from '@/core/crypto'
import { Password } from '@/core/password'

const PATH_REGEXS = {
  getSession: /^(?:\/([^/]+))?\/api\/auth\/get-session$/,
  signIn: /^(?:\/([^/]+))?\/api\/auth\/sign-in$/,
  signOut: /^(?:\/([^/]+))?\/api\/auth\/sign-out$/,
  oauth: /^(?:\/([^/]+))?\/api\/auth\/([^/]+)$/,
} as const

export function Auth(config: AuthConfig) {
  const finalConfig = {
    ...config,
    session: { ...defaultConfig.session, ...config.session },
    keys: { ...defaultConfig.keys, ...config.keys },
    cookie: { ...defaultConfig.cookie, ...config.cookie },
  } satisfies AuthConfig
  const { adapter, providers = [], session, keys, cookie } = finalConfig

  async function createSession(
    userId: string,
    opts: Pick<Session, 'ipAddress' | 'userAgent'>,
  ): Promise<{ token: string; expiresAt: Date }> {
    const id = generateSecureString()
    const secret = generateSecureString()
    const hashedSecret = await hashSecret(secret)

    const token = `${id}.${secret}`
    const expiresAt = new Date(Date.now() + session.expiresIn * 1000)
    await adapter.session.create({
      ...opts,
      id,
      userId,
      token: encodeHex(hashedSecret),
      expiresAt,
    })

    return { token, expiresAt }
  }

  async function auth(opts: { headers: Headers }): Promise<SessionWithUser> {
    const cookies = parseCookies(opts.headers.get('Cookie'))
    const token =
      cookies[keys.token] ??
      opts.headers.get('Authorization')?.replace('Bearer ', '') ??
      ''

    try {
      const [id, secret] = token.split('.')
      if (!id || !secret) throw new Error('Invalid token format')

      const result = await adapter.session.find(id)
      if (!result) throw new Error('Session not found')

      const hashedSecret = await hashSecret(secret)
      const decodedToken = decodeHex(result.token)
      const isValid = constantTimeEqual(hashedSecret, decodedToken)

      const now = Date.now()
      const expiresTime = result.expiresAt.getTime()

      if (
        !isValid ||
        expiresTime < now // implement additional checks if needed
        //session.ipAddress !== opts.headers.get('X-Forwarded-For') ||
        //session.userAgent !== opts.headers.get('User-Agent')
      ) {
        await adapter.session.delete(token)
        throw new Error('Session expired')
      }

      // Extend session if it's close to expiration
      //if (now >= expiresTime - session.expiresThreshold * 1000) {
      //  const newExpires = new Date(now + session.expiresIn * 1000)
      //  await adapter.session.update(id, { expiresAt: newExpires })
      //  result.expiresAt = newExpires
      //}

      return result
    } catch {
      return {
        token: '',
        user: null,
        expiresAt: new Date(0),
        ipAddress: null,
        userAgent: null,
      }
    }
  }

  async function signIn(
    data: { email: string; password: string },
    opts: Pick<Session, 'ipAddress' | 'userAgent'> = {
      ipAddress: null,
      userAgent: null,
    },
  ): Promise<{ token: string; expiresAt: Date }> {
    const user = await adapter.user.find(data.email)
    if (!user) throw new Error('Invalid credentials')

    const account = await adapter.account.find('credentials', user.id)
    if (!account?.password) throw new Error('Invalid credentials')

    if (!(await new Password().verify(account.password, data.password)))
      throw new Error('Invalid credentials')

    return createSession(user.id, opts)
  }

  async function signOut(opts: { headers: Headers }): Promise<void> {
    const cookies = parseCookies(opts.headers.get('Cookie'))
    const token =
      cookies[keys.token] ??
      opts.headers.get('Authorization')?.replace('Bearer ', '') ??
      ''
    const [id] = token.split('.')
    if (id) await adapter.session.delete(id)
  }

  const handleGet = async (request: Request): Promise<Response> => {
    let response: Response = new Response('Not Found', { status: 404 })
    const { pathname, searchParams } = new URL(request.url)

    try {
      /*
       * [GET] /auth/get-session
       * - Retrieves the current authenticated user's session.
       */
      if (PATH_REGEXS.getSession.test(pathname)) {
        const session = await auth({ headers: request.headers })
        response = Response.json(session)
      }

      /*
       * [GET] /auth/:provider
       * - Handles OAuth provider callback after user authentication.
       */
      const match = PATH_REGEXS.oauth.exec(pathname)
      if (match && ['get-session'].every((p) => p !== match[2])) {
        const [, , provider = ''] = match
        const inst = providers.find((p) => p.providerName === provider)
        if (!inst) throw new Error(`Provider "${provider}" is not configured`)

        const cookies = parseCookies(request.headers.get('Cookie'))
        const state = searchParams.get('state') ?? ''
        const storedState = cookies[keys.state] ?? ''
        const code = searchParams.get('code') ?? ''
        const storedCode = cookies[keys.codeVerifier] ?? ''
        const redirectUri = cookies[keys.redirectUri] ?? '/'

        if (state !== storedState || !code || !storedCode)
          throw new Error('Invalid OAuth callback parameters')

        const userData = await inst.fetchUserData(code, storedCode)
        const existingUser = await adapter.user.find(userData.email)

        let userId: string
        if (existingUser) {
          userId = existingUser.id

          const account = await adapter.account.find(provider, userData.id)
          if (!account)
            await adapter.account.create({
              userId,
              provider: inst.providerName,
              accountId: userData.id,
              password: null,
            })
        } else {
          const { id: _, ...rest } = userData
          const newUser = await adapter.user.create(rest)
          userId = newUser.id

          await adapter.account.create({
            userId,
            provider: inst.providerName,
            accountId: userData.id,
            password: null,
          })
        }

        const result = await createSession(userId, {
          ipAddress: request.headers.get('X-Forwarded-For'),
          userAgent: request.headers.get('User-Agent'),
        })

        response = new Response(null, { status: 302 })
        response.headers.set('Location', redirectUri)
        response.headers.append(
          'Set-Cookie',
          serializeCookie(keys.token, result.token, {
            ...cookie,
            expires: result.expiresAt.toUTCString(),
          }),
        )
      }
    } catch (e) {
      response = new Response(
        e instanceof Error ? e.message : 'Internal Server Error',
        { status: 400 },
      )
    }

    return response
  }

  const handlePost = async (request: Request): Promise<Response> => {
    let response: Response = new Response('Not Found', { status: 404 })
    const { origin, pathname, searchParams } = new URL(request.url)

    try {
      /*
       * [POST] /auth/sign-in
       * - Authenticates a user using credentials.
       */
      if (PATH_REGEXS.signIn.test(pathname)) {
        let data
        const contentType = request.headers.get('Content-Type') ?? ''
        if (contentType.includes('application/json'))
          data = await request.json()
        else if (contentType.includes('application/x-www-form-urlencoded')) {
          const formData = await request.formData()
          data = Object.fromEntries(formData.entries())
        } else throw new Error('Unsupported content type')

        const result = await signIn(data as never, {
          ipAddress: request.headers.get('X-Forwarded-For'),
          userAgent: request.headers.get('User-Agent'),
        })
        response = contentType.includes('application/json')
          ? Response.json(result)
          : new Response(null, {
              status: 302,
              headers: { Location: new URL('/', origin).toString() },
            })
        response.headers.set(
          'Set-Cookie',
          serializeCookie(keys.token, result.token, {
            ...cookie,
            expires: result.expiresAt.toUTCString(),
          }),
        )
      }

      /*
       * [POST] /auth/sign-out
       * - Terminates the current user's session.
       */
      if (PATH_REGEXS.signOut.test(pathname)) {
        await signOut({ headers: request.headers })
        response = new Response(null, { status: 204 })
        response.headers.set(
          'Set-Cookie',
          serializeCookie(keys.token, '', { ...cookie, maxAge: 0 }),
        )
      }

      /*
       * POST /auth/:provider
       * - Initiates OAuth authentication with the specified provider.
       */
      const match = PATH_REGEXS.oauth.exec(pathname)
      if (match && ['sign-in', 'sign-out'].every((p) => p !== match[2])) {
        const [, , provider = ''] = match
        const inst = providers.find((p) => p.providerName === provider)
        if (!inst) throw new Error(`Provider "${provider}" is not configured`)

        const state = generateStateOrCode()
        const code = generateStateOrCode()
        const redirectUri = searchParams.get('redirect_to') ?? '/'
        const authorizationUrl = await inst.createAuthorizationUrl(state, code)
        response = new Response(null, { status: 302 })
        response.headers.set('Location', authorizationUrl.toString())
        response.headers.append(
          'Set-Cookie',
          serializeCookie(keys.state, state, { maxAge: 300 }),
        )
        response.headers.append(
          'Set-Cookie',
          serializeCookie(keys.codeVerifier, code, { maxAge: 300 }),
        )
        response.headers.append(
          'Set-Cookie',
          serializeCookie(keys.redirectUri, redirectUri, { maxAge: 300 }),
        )
      }
    } catch (e) {
      response = new Response(
        e instanceof Error ? e.message : 'Internal Server Error',
        { status: 400 },
      )
    }

    return response
  }

  async function handler(request: Request): Promise<Response> {
    let response: Response
    if (request.method === 'OPTIONS')
      response = new Response(null, { status: 204 })
    else if (request.method === 'GET') response = await handleGet(request)
    else if (request.method === 'POST') response = await handlePost(request)
    else response = new Response('Method Not Allowed', { status: 405 })

    response.headers.set('Access-Control-Allow-Origin', '*')
    response.headers.set('Access-Control-Allow-Headers', '*')
    response.headers.set('Access-Control-Request-Method', '*')
    response.headers.set('Access-Control-Allow-Methods', 'GET, POST, OPTIONS')
    return response
  }

  return { auth, signIn, signOut, handler }
}

function parseCookies(cookieHeader: string | null): Record<string, string> {
  const cookies: Record<string, string> = {}
  if (!cookieHeader) return cookies
  const pairs = cookieHeader.split(';')
  for (const pair of pairs) {
    const [key, value] = pair.trim().split('=')
    cookies[key] = decodeURIComponent(value)
  }
  return cookies
}

function serializeCookie(
  name: string,
  value: string,
  options: Record<string, string | number | boolean>,
): string {
  let cookieString = `${name}=${encodeURIComponent(value)}`
  for (const [key, val] of Object.entries(options)) {
    if (val === true) cookieString += `; ${key}`
    else cookieString += `; ${key}=${val}`
  }
  return cookieString
}

const defaultConfig = {
  session: {
    expiresIn: 60 * 60 * 24 * 7, // 7 days
    expiresThreshold: 60 * 60 * 24, // 1 day
  },
  cookie: {
    path: '/',
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
  },
  keys: {
    token: 'auth.token',
    state: 'auth.state',
    codeVerifier: 'auth.code_verifier',
    redirectUri: 'auth.redirect_uri',
  },
} satisfies Omit<AuthConfig, 'adapter' | 'providers'>
