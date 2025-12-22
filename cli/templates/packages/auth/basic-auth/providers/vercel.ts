import type { OAuth2Token, OAuthAccount } from '@/types'

import { BaseProvider } from '@/providers/base'

export class Vercel extends BaseProvider {
  constructor(clientId: string, clientSecret: string, redirectUri = '') {
    super('vercel', clientId, clientSecret, redirectUri)
  }

  private authorizationEndpoint = 'https://vercel.com/oauth/authorize'
  private tokenEndpoint = 'https://api.vercel.com/login/oauth/token'
  private apiEndpoint = 'https://api.vercel.com/login/oauth/userinfo'

  public override async createAuthorizationUrl(
    state: string,
    codeVerifier: string,
  ): Promise<URL> {
    const url = await this.createAuthorizationUrlWithPKCE(
      this.authorizationEndpoint,
      state,
      ['openid', 'email', 'profile'],
      codeVerifier,
    )

    return url
  }

  public override async fetchUserData(
    code: string,
    codeVerifier: string,
  ): Promise<OAuthAccount> {
    const tokenResponse = await this.validateAuthorizationCode(
      this.tokenEndpoint,
      code,
      codeVerifier,
    )
    if (!tokenResponse.ok) {
      const error = await tokenResponse.text().catch(() => 'Unknown error')
      throw new Error(`Vercel API error: ${error}`)
    }

    const tokenData = (await tokenResponse.json()) as OAuth2Token
    const response = await fetch(this.apiEndpoint, {
      headers: { Authorization: `Bearer ${tokenData.access_token}` },
    })
    if (!response.ok) {
      const errorText = await response.text().catch(() => 'Unknown error')
      throw new Error(`Vercel API error (${response.status}): ${errorText}`)
    }

    const userData = (await response.json()) as VercelUserResponse
    return {
      id: userData.sub,
      name: userData.name,
      email: userData.email,
      image: userData.picture,
    }
  }
}

interface VercelUserResponse {
  sub: string
  name: string
  email: string
  picture: string
  preferred_username: string
}
