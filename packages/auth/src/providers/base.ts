export interface ProviderUserData {
  accountId: string
  email: string
  name: string
  image: string
}

export interface OAuth2Token {
  access_token: string
  token_type: string
  expires_in: number
}

export default abstract class BaseProvider {
  protected abstract authorizationUrl: string
  protected abstract tokenUrl: string
  protected abstract apiUrl: string
  protected abstract callbackUrl: string
  protected abstract scopes: string[]

  constructor(
    protected readonly clientId: string,
    protected readonly clientSecret: string,
  ) {}

  async createAuthorizationUrl(
    state: string,
    _codeVerifier: string | null,
  ): Promise<URL> {
    const url = new URL(this.authorizationUrl)
    url.searchParams.set('response_type', 'code')
    url.searchParams.set('client_id', this.clientId)
    url.searchParams.set('redirect_uri', this.callbackUrl)
    url.searchParams.set('state', state)
    url.searchParams.set('scope', this.scopes.join(' '))
    // if (codeVerifier) {
    //   const codeChallenge = await this.generateCodeChallenge(codeVerifier)
    //   url.searchParams.set('code_challenge', codeChallenge)
    //   url.searchParams.set('code_challenge_method', 'S256')
    // }

    return Promise.resolve(url)
  }

  abstract fetchUserData(
    code: string,
    codeVerifier: string | null,
  ): Promise<ProviderUserData>

  protected async validateAuthorizationCode(
    code: string,
    _codeVerifier: string | null,
  ): Promise<OAuth2Token> {
    const body = new URLSearchParams()
    body.set('grant_type', 'authorization_code')
    body.set('code', code)
    body.set('redirect_uri', this.callbackUrl)
    // if (codeVerifier) body.set('code_verifier', codeVerifier)

    const tokenResponse = await fetch(this.tokenUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        Authorization: `Basic ${this.encodeCredentials(this.clientId, this.clientSecret)}`,
      },
      body,
    })

    if (!tokenResponse.ok) {
      const errorText = await tokenResponse.text().catch(() => 'Unknown error')
      console.error(`OAuth2 token error: ${errorText}`)
      throw new Error(
        `Failed to fetch access token: ${tokenResponse.statusText}`,
      )
    }

    return (await tokenResponse.json()) as OAuth2Token
  }

  protected encodeCredentials(username: string, password: string): string {
    const bytes = new TextEncoder().encode(`${username}:${password}`)
    return btoa(String.fromCharCode(...bytes))
  }

  protected async generateCodeChallenge(codeVerifier: string): Promise<string> {
    const encoder = new TextEncoder()
    const data = encoder.encode(codeVerifier)
    const digest = await crypto.subtle.digest('SHA-256', data)
    const base64String = btoa(String.fromCharCode(...new Uint8Array(digest)))
    return base64String
      .replace(/\+/g, '-')
      .replace(/\//g, '_')
      .replace(/=/g, '')
  }

  protected createCallbackUrl(provider: string) {
    let baseUrl = `http://localhost:${process.env.PORT ?? 3000}`
    if (process.env.VERCEL_PROJECT_PRODUCTION_URL)
      baseUrl = `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
    else if (process.env.VERCEL_URL)
      baseUrl = `https://${process.env.VERCEL_URL}`

    return `${baseUrl}/api/auth/callback/${provider}`
  }
}

export function generateSecureString(): string {
  const randomValues = new Uint8Array(32)
  crypto.getRandomValues(randomValues)
  return btoa(String.fromCharCode(...randomValues))
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=/g, '')
}
