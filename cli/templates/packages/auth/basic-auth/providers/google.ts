import type { OAuth2Token, OAuthAccount } from '@/types'
import { BaseProvider } from '@/providers/base'

export class Google extends BaseProvider {
  constructor(
    clientId: string,
    clientSecret: string,
    redirectUri: string = '',
  ) {
    super('google', clientId, clientSecret, redirectUri)
  }

  private authorizationEndpoint = 'https://accounts.google.com/o/oauth2/v2/auth'
  private tokenEndpoint = 'https://oauth2.googleapis.com/token'
  private apiEndpoint = 'https://openidconnect.googleapis.com/v1/userinfo'

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
      throw new Error(`Google API error: ${error}`)
    }

    const tokenData = (await tokenResponse.json()) as OAuth2Token
    const response = await fetch(this.apiEndpoint, {
      headers: { Authorization: `Bearer ${tokenData.access_token}` },
    })
    if (!response.ok) {
      const errorText = await response.text().catch(() => 'Unknown error')
      throw new Error(`Google API error (${response.status}): ${errorText}`)
    }

    const userData = (await response.json()) as GoogleUserResponse
    return {
      id: userData.sub,
      name: userData.name,
      email: userData.email,
      image: userData.picture,
    }
  }
}

interface GoogleUserResponse {
  sub: string
  name: string
  email: string
  picture: string
}
