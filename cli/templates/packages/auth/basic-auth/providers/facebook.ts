import type { OAuth2Token, OauthAccount } from '../core/types'
import BaseProvider, { OAuthClient } from './base'

export default class Facebook extends BaseProvider {
  private client: OAuthClient

  private authorizationEndpoint = 'https://www.facebook.com/v23.0/dialog/oauth'
  private tokenEndpoint = 'https://graph.facebook.com/v23.0/oauth/access_token'
  private apiEndpoint = 'https://graph.facebook.com/me'

  constructor(opts: {
    clientId: string
    clientSecret: string
    redirectUrl?: string
  }) {
    super()
    this.client = new OAuthClient(
      opts.clientId,
      opts.clientSecret,
      opts.redirectUrl ?? this.createCallbackUrl('facebook'),
    )
  }

  override async createAuthorizationUrl(
    state: string,
    _codeVerifier: string | null,
  ): Promise<URL> {
    const url = await this.client.createAuthorizationUrl(
      this.authorizationEndpoint,
      state,
      ['email', 'public_profile'],
    )

    return url
  }

  override async fetchUserData(
    code: string,
    _codeVerifier: string | null,
  ): Promise<OauthAccount> {
    const tokenResponse = await this.client.validateAuthorizationCode(
      this.tokenEndpoint,
      code,
    )
    if (!tokenResponse.ok) {
      const error = await tokenResponse.text().catch(() => 'Unknown error')
      throw new Error(`Facebook API error: ${error}`)
    }

    const tokenData = (await tokenResponse.json()) as OAuth2Token
    const searchParams = new URLSearchParams()
    searchParams.set('access_token', tokenData.access_token)
    searchParams.set('fields', ['id', 'name', 'picture', 'email'].join(','))
    const userResponse = await fetch(
      `${this.apiEndpoint}?${searchParams.toString()}`,
    )
    if (!userResponse.ok) {
      const error = await userResponse.text().catch(() => 'Unknown error')
      throw new Error(`Facebook API error: ${error}`)
    }

    const userData = (await userResponse.json()) as FacebookUserResponse
    return {
      accountId: userData.id,
      email: userData.email,
      name: userData.name,
      image: userData.picture.data.url,
    }
  }
}

interface FacebookUserResponse {
  id: string
  email: string
  name: string
  picture: { data: { url: string } }
}
