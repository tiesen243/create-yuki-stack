import type { OAuth2Token, OauthAccount } from '../core/types'
import BaseProvider, { OAuthClient } from './base'

export default class Google extends BaseProvider {
  private client: OAuthClient

  private authorizationEndpoint = 'https://accounts.google.com/o/oauth2/v2/auth'
  private tokenEndpoint = 'https://oauth2.googleapis.com/token'
  private apiEndpoint = 'https://openidconnect.googleapis.com/v1/userinfo'

  constructor(opts: {
    clientId: string
    clientSecret: string
    redirectUrl?: string
  }) {
    super()
    this.client = new OAuthClient(
      opts.clientId,
      opts.clientSecret,
      opts.redirectUrl ?? this.createCallbackUrl('google'),
    )
  }

  public override async createAuthorizationUrl(
    state: string,
    codeVerifier: string,
  ): Promise<URL> {
    const url = await this.client.createAuthorizationUrlWithPKCE(
      this.authorizationEndpoint,
      state,
      ['openid', 'email', 'profile'],
      codeVerifier,
    )

    return url
  }

  override async fetchUserData(
    code: string,
    codeVerifier: string | null,
  ): Promise<OauthAccount> {
    const tokenResponse = await this.client.validateAuthorizationCode(
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
      accountId: userData.sub,
      email: userData.email,
      name: userData.name,
      image: userData.picture,
    }
  }
}

interface GoogleUserResponse {
  sub: string
  email: string
  name: string
  picture: string
}
