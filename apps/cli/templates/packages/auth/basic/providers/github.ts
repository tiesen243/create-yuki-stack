import type { OAuth2Token, ProviderUserData } from '../core/types'
import BaseProvider from './base'

export default class Github extends BaseProvider {
  protected override authorizationUrl =
    'https://github.com/login/oauth/authorize'
  protected override tokenUrl = 'https://github.com/login/oauth/access_token'
  protected override apiUrl = 'https://api.github.com/user'
  protected override callbackUrl = this.createCallbackUrl('github')
  protected override scopes = ['user:email']

  constructor(opts: {
    clientId: string
    clientSecret: string
    callbackUrl?: string
  }) {
    super(opts.clientId, opts.clientSecret)
    if (opts.callbackUrl) this.callbackUrl = opts.callbackUrl
  }

  protected override async validateAuthorizationCode(
    code: string,
    codeVerifier: string | null,
  ): Promise<OAuth2Token> {
    const response = await this.fetchToken(code, codeVerifier)
    const json = new URLSearchParams(await response.text())
    return {
      access_token: json.get('access_token') ?? '',
      token_type: json.get('token_type') ?? 'Bearer',
      expires_in: parseInt(json.get('expires_in') ?? '0', 10),
    }
  }

  override async fetchUserData(
    code: string,
    codeVerifier: string | null,
  ): Promise<ProviderUserData> {
    const { access_token } = await this.validateAuthorizationCode(
      code,
      codeVerifier,
    )

    const response = await fetch(this.apiUrl, {
      headers: { Authorization: `Bearer ${access_token}` },
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
