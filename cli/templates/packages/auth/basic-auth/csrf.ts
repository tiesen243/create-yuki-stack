import { constantTimeEqual } from './core/crypto'

const isProd = process.env.NODE_ENV === 'production'

export function verifyRequestOrigin(
  request: Request,
  sessionToken?: string,
): boolean {
  // skip checks in development or for GET/HEAD requests
  if (!isProd || request.method === 'GET' || request.method === 'HEAD')
    return true

  // check for session token and CSRF token
  const csrfToken = request.headers.get('auth.csrf') ?? ''
  if (sessionToken && csrfToken) return verifyCsrfToken(sessionToken, csrfToken)

  // check for origin header and host header
  const originHeader = request.headers.get('origin') ?? ''
  const hostHeader =
    request.headers.get('host') ?? request.headers.get('X-Forwarded-Host') ?? ''
  if (!originHeader || !hostHeader) return false

  let originUrl: URL
  try {
    originUrl = new URL(originHeader)
  } catch {
    return false
  }

  return originUrl.host === hostHeader
}

export function generateCsrfToken(sessionToken: string): string {
  if (!sessionToken)
    throw new Error('Session token is required to generate CSRF token')

  const randomBytes = new Uint8Array(32)
  crypto.getRandomValues(randomBytes)
  const randomPart = btoa(String.fromCharCode(...randomBytes))
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=/g, '')

  try {
    const encodedToken = btoa(sessionToken)
      .replace(/\+/g, '-')
      .replace(/\//g, '_')
      .replace(/=/g, '')
    return `${randomPart}.${encodedToken}`
  } catch {
    throw new Error('Failed to encode session token for CSRF token generation')
  }
}

export function verifyCsrfToken(
  sessionToken: string,
  csrfToken: string,
): boolean {
  const parts = csrfToken.split('.')
  if (parts.length !== 2) return false

  const [, encodedSessionToken] = parts
  const expectedSessionToken = btoa(sessionToken)
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=/g, '')

  const textEncoder = new TextEncoder()
  return constantTimeEqual(
    textEncoder.encode(encodedSessionToken),
    textEncoder.encode(expectedSessionToken),
  )
}
