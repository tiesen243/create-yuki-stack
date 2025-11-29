import type { OAuth2Token, OAuthAccount } from '@/types'
import { BaseProvider } from '@/providers/base'

export class Github extends BaseProvider {
  constructor(
    clientId: string,
    clientSecret: string,
    redirectUri: string = '',
  ) {
    super('github', clientId, clientSecret, redirectUri)
  }

  private authorizationEndpoint = 'https://github.com/login/oauth/authorize'
  private tokenEndpoint = 'https://github.com/login/oauth/access_token'
  private apiEndpoint = 'https://api.github.com/user'

  public override async createAuthorizationUrl(
    state: string,
    codeVerifier: string,
  ): Promise<URL> {
    const url = await this.createAuthorizationUrlWithPKCE(
      this.authorizationEndpoint,
      state,
      ['read:user', 'user:email'],
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
      throw new Error(`GitHub API error: ${error}`)
    }

    const tokenData = (await tokenResponse.json()) as OAuth2Token
    const response = await fetch(this.apiEndpoint, {
      headers: { Authorization: `Bearer ${tokenData.access_token}` },
    })

    if (!response.ok) {
      const errorText = await response.text().catch(() => 'Unknown error')
      throw new Error(`GitHub API error (${response.status}): ${errorText}`)
    }
    const userData = (await response.json()) as GithubUserResponse
    return {
      id: userData.id,
      name: userData.name,
      email: userData.email,
      image: userData.avatar_url,
    }
  }
}

interface GithubUserResponse {
  id: string
  name: string
  email: string
  avatar_url: string
}
