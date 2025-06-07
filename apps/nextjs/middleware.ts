import type { MiddlewareConfig, NextRequest } from 'next/server'
import { NextResponse } from 'next/server'

import { auth } from '@yuki/auth'

const authRoutes: string[] = ['/login', '/register']
const protectedRoutes: string[] = []

export default async function middleware(req: NextRequest) {
  const { pathname } = new URL(req.url)
  const session = await auth(req)

  if (req.method === 'GET') {
    if (
      !session.user &&
      protectedRoutes.some((route) => pathname.startsWith(route))
    ) {
      const url = new URL('/login', req.url)
      url.searchParams.set('redirect_to', pathname)
      return NextResponse.redirect(url)
    }

    if (session.user && authRoutes.some((route) => pathname.startsWith(route)))
      return NextResponse.redirect(new URL('/', req.url))

    return NextResponse.next()
  }

  /**
   * CSRF Protection Implementation
   *
   * Provides protection against Cross-Site Request Forgery by:
   * - Comparing Origin header with Host header to verify same-origin requests
   * - Blocking requests with missing or mismatched headers (403 Forbidden)
   * - Bypassing protection for authenticated users
   *
   * Security approach:
   * - Validates Origin as proper URL and matches against request host
   * - Basic protection complemented by CSRF tokens and SameSite cookies
   *
   * Note: Consider additional validation for authenticated users or
   * implementing request-specific CSRF tokens for enhanced security.
   */

  if (session.user) return NextResponse.next()

  const originHeader = req.headers.get('Origin') ?? ''
  const hostHeader =
    req.headers.get('Host') ?? req.headers.get('X-Forwarded-Host') ?? ''
  if (!originHeader || !hostHeader)
    return new NextResponse(null, { status: 403 })

  let originUrl: URL
  try {
    originUrl = new URL(originHeader)
  } catch {
    return new NextResponse(null, { status: 403 })
  }
  if (originUrl.host !== hostHeader)
    return new NextResponse(null, { status: 403 })

  return NextResponse.next()
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico, sitemap.xml, robots.txt (metadata files)
     */
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    /*
     * Match all request paths starting with:
     * - api (API routes)
     */
    '/api/(.*)',
  ],
} satisfies MiddlewareConfig
