/**
 * Cookie management utilities for authentication
 *
 * Implements secure cookie handling for authentication sessions following
 * best practices as recommended by Lucia Auth.
 *
 * @see https://lucia-auth.com/sessions/cookies
 */
import type { AuthOptions } from '../types'

function getCookie(key: string, request: Request): string | undefined {
  const cookies = request.headers
    .get('cookie')
    ?.split(';')
    .reduce((acc: Record<string, string>, cookie) => {
      const [key, value] = cookie.trim().split('=')
      if (key && value) acc[key] = decodeURIComponent(value)
      return acc
    }, {})
  return cookies?.[key]
}

function setCookie(
  key: string,
  value: string,
  options: Partial<AuthOptions['cookieOptions']> = {},
  response: Response,
): void {
  delete options.key

  // Format Date objects to UTC string if present
  if (options.expires instanceof Date)
    options.expires = options.expires.toUTCString() as never

  const cookieString = `${key}=${value}; ${Object.entries(options)
    .map(([k, v]) => `${k}=${v}`)
    .join('; ')}`

  response.headers.append('set-cookie', cookieString)
}

function deleteCookie(key: string, response: Response): void {
  response.headers.append(
    'set-cookie',
    `${key}=; Path=/; HttpOnly; SameSite=Lax; Max-Age=0`,
  )
}

export { getCookie, setCookie, deleteCookie }
