const isProd = process.env.NODE_ENV === 'production'

export function verifyRequestOrigin(
  request: Request,
  sessionToken?: string,
): boolean {
  // skip checks in development or for GET/HEAD requests
  if (!isProd || request.method === 'GET' || request.method === 'HEAD')
    return true

  // check for session token and CSRF token
  const csrfToken = request.headers.get('__csrf') ?? ''
  if (sessionToken && !verifyCsrfToken(sessionToken, csrfToken)) return false

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
  const randomBytes = new Uint8Array(32)
  crypto.getRandomValues(randomBytes)
  const randomPart = btoa(String.fromCharCode(...randomBytes))
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=/g, '')

  return `${randomPart}.${btoa(sessionToken).replace(/\+/g, '-').replace(/\//g, '_').replace(/=/g, '')}`
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

  return expectedSessionToken === encodedSessionToken
}
