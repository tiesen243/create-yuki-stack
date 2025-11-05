import type { OAuth2Token, OauthAccount } from '@/types'
import BaseProvider, { OAuthClient } from '@/providers/base'

export default class Github extends BaseProvider {
  private client: OAuthClient

  private authorizationEndpoint = 'https://github.com/login/oauth/authorize'
  private tokenEndpoint = 'https://github.com/login/oauth/access_token'
  private apiEndpoint = 'https://api.github.com/user'

  constructor(opts: {
    clientId: string
    clientSecret: string
    redirectUrl?: string
  }) {
    super()
    this.client = new OAuthClient(
      opts.clientId,
      opts.clientSecret,
      opts.redirectUrl ?? this.createCallbackUrl('github'),
    )
  }

  public override async createAuthorizationUrl(
    state: string,
    codeVerifier: string,
  ): Promise<URL> {
    const url = await this.client.createAuthorizationUrlWithPKCE(
      this.authorizationEndpoint,
      state,
      ['read:user', 'user:email'],
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
      accountId: userData.id,
      email: userData.email,
      name: userData.name,
      image: userData.avatar_url,
    }
  }
}

interface GithubUserResponse {
  id: string
  email: string
  name: string
  avatar_url: string
}
