import { env } from '@{{ name }}/validators/env'

import type { OAuthAccount } from '@/types'
import { generateCodeChallenge } from '@/core/crypto'

export abstract class BaseProvider {
  constructor(
    public readonly providerName: string,
    protected readonly clientId: string,
    protected readonly clientSecret: string,
    protected readonly redirectUri = '',
  ) {
    if (!this.redirectUri) this.redirectUri = this.createCallbackUrl()
  }

  public abstract createAuthorizationUrl(
    state: string,
    codeVerifier: string,
  ): Promise<URL>

  public abstract fetchUserData(
    code: string,
    codeVerifier: string,
  ): Promise<OAuthAccount>

  protected createCallbackUrl() {
    let baseUrl = `http://localhost:${process.env.PORT ?? 3000}`
    if (env.VERCEL_PROJECT_PRODUCTION_URL)
      baseUrl = `https://${env.VERCEL_PROJECT_PRODUCTION_URL}`
    return `${baseUrl}/api/auth/${this.providerName}`
  }

  protected async createAuthorizationUrlWithoutPkce(
    endpoint: string,
    state: string,
    scopes: string[],
  ): Promise<URL> {
    const url = new URL(endpoint)
    url.searchParams.set('response_type', 'code')
    url.searchParams.set('client_id', this.clientId)
    url.searchParams.set('state', state)

    if (scopes.length > 0) url.searchParams.set('scope', scopes.join(' '))
    url.searchParams.set('redirect_uri', this.redirectUri)

    return Promise.resolve(url)
  }

  protected async createAuthorizationUrlWithPKCE(
    endpoint: string,
    state: string,
    scopes: string[],
    codeVerifier: string,
    codeChallengeMethod: 'S256' | 'plain' = 'S256',
  ): Promise<URL> {
    const url = await this.createAuthorizationUrlWithoutPkce(
      endpoint,
      state,
      scopes,
    )

    if (codeChallengeMethod === 'S256') {
      const codeChallenge = await generateCodeChallenge(codeVerifier)
      url.searchParams.set('code_challenge', codeChallenge)
      url.searchParams.set('code_challenge_method', 'S256')
    } else {
      url.searchParams.set('code_challenge', codeVerifier)
      url.searchParams.set('code_challenge_method', 'plain')
    }

    return url
  }

  protected async validateAuthorizationCode(
    endpoint: string,
    code: string,
    codeVerifier: string | null = null,
  ): Promise<Response> {
    const body = new URLSearchParams()
    body.set('grant_type', 'authorization_code')
    body.set('redirect_uri', this.redirectUri)
    body.set('client_id', this.clientId)
    body.set('code', code)

    if (codeVerifier) body.set('code_verifier', codeVerifier)

    const request = this.createRequest(endpoint, body)
    request.headers.set(
      'Authorization',
      `Basic ${this.encodeCredentials(this.clientId, this.clientSecret)}`,
    )

    return await fetch(request)
  }

  private createRequest(enpoint: string, body: URLSearchParams) {
    const bodyBytes = new TextEncoder().encode(body.toString())
    const request = new Request(enpoint, { method: 'POST', body: bodyBytes })

    request.headers.set('Content-Type', 'application/x-www-form-urlencoded')
    request.headers.set('Accept', 'application/json')
    request.headers.set('User-Agent', 'yuki-auth')
    request.headers.set('Content-Length', bodyBytes.byteLength.toString())

    return request
  }

  private encodeCredentials(clientId: string, clientSecret: string): string {
    const credentials = `${clientId}:${clientSecret}`
    const bytes = new TextEncoder().encode(credentials)
    return btoa(String.fromCharCode(...bytes))
      .replace(/\+/g, '-')
      .replace(/\//g, '_')
      .replace(/=/g, '')
  }
}
