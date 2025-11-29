import type { OAuth2Token, OAuthAccount } from '@/types'
import { BaseProvider } from '@/providers/base'

export class Figma extends BaseProvider {
  constructor(
    clientId: string,
    clientSecret: string,
    redirectUri = '',
  ) {
    super('figma', clientId, clientSecret, redirectUri)
  }

  private authorizationEndpoint = 'https://www.figma.com/oauth'
  private tokenEndpoint = 'https://api.figma.com/v1/oauth/token'
  private apiEndpoint = 'https://api.figma.com/v1/me'

  public override async createAuthorizationUrl(
    state: string,
    codeVerifier: string,
  ): Promise<URL> {
    const url = await this.createAuthorizationUrlWithPKCE(
      this.authorizationEndpoint,
      state,
      ['current_user:read'],
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
      throw new Error(`Figma API error: ${error}`)
    }

    const tokenData = (await tokenResponse.json()) as OAuth2Token
    const userResponse = await fetch(this.apiEndpoint, {
      headers: { Authorization: `Bearer ${tokenData.access_token}` },
    })
    if (!userResponse.ok) {
      const error = await userResponse.text().catch(() => 'Unknown error')
      throw new Error(`Figma API error: ${error}`)
    }

    const userData = (await userResponse.json()) as FigmaUserResponse
    return {
      id: userData.id,
      name: userData.handle,
      email: userData.email,
      image: userData.img_url,
    }
  }
}

interface FigmaUserResponse {
  id: string
  handle: string
  email: string
  img_url: string
}
