import type { CookieOptions } from '@/types'

export default class Cookies {
  private _cookies: Record<string, string> = {}

  constructor(request: Request) {
    const cookieHeader = request.headers.get('cookie')
    if (cookieHeader) {
      for (const cookie of cookieHeader.split(';')) {
        const [key, value] = cookie.split('=').map((s) => s.trim()) as [
          string,
          string,
        ]
        this._cookies[key] = decodeURIComponent(value)
      }
    }
  }

  get(key: string): string | undefined {
    return this._cookies[key]
  }

  getAll(): Record<string, string> {
    return { ...this._cookies }
  }

  set(
    response: Response,
    key: string,
    value: string,
    options: CookieOptions = {},
  ): void {
    const cookieParts: string[] = [`${key}=${encodeURIComponent(value)}`]

    for (const [optKey, optValue] of Object.entries(options)) {
      if (optValue === true) cookieParts.push(optKey)
      else if (optValue !== false && optValue !== undefined)
        cookieParts.push(`${optKey}=${optValue as unknown}`)
    }

    response.headers.append('Set-Cookie', cookieParts.join('; '))
  }

  delete(response: Response, key: string): void {
    this.set(response, key, '', { 'Max-Age': -1, Path: '/' })
  }
}
