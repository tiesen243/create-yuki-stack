import type { OAuth2Token, OAuthAccount } from '@/types'
import { BaseProvider } from '@/providers/base'

export class Facebook extends BaseProvider {
  constructor(
    clientId: string,
    clientSecret: string,
    redirectUri = '',
  ) {
    super('facebook', clientId, clientSecret, redirectUri)
  }

  private authorizationEndpoint = 'https://www.facebook.com/v23.0/dialog/oauth'
  private tokenEndpoint = 'https://graph.facebook.com/v23.0/oauth/access_token'
  private apiEndpoint = 'https://graph.facebook.com/me'

  public override async createAuthorizationUrl(
    state: string,
    _codeVerifier: string,
  ): Promise<URL> {
    const url = await this.createAuthorizationUrlWithoutPkce(
      this.authorizationEndpoint,
      state,
      ['email', 'public_profile'],
    )

    return url
  }

  public override async fetchUserData(
    code: string,
    _codeVerifier: string,
  ): Promise<OAuthAccount> {
    const tokenResponse = await this.validateAuthorizationCode(
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
      id: userData.id,
      name: userData.name,
      email: userData.email,
      image: userData.picture.data.url,
    }
  }
}

interface FacebookUserResponse {
  id: string
  name: string
  email: string
  picture: { data: { url: string } }
}
