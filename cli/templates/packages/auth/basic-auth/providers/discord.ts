import type { OAuth2Token, ProviderUserData } from '../core/types'
import BaseProvider, { OAuthClient } from './base'

export default class Discord extends BaseProvider {
  private client: OAuthClient

  private authorizationEndpoint = 'https://discord.com/oauth2/authorize'
  private tokenEndpoint = 'https://discord.com/api/oauth2/token'
  private apiEndpoint = 'https://discord.com/api/users/@me'

  constructor(opts: {
    clientId: string
    clientSecret: string
    redirectUrl?: string
  }) {
    super()
    this.client = new OAuthClient(
      opts.clientId,
      opts.clientSecret,
      opts.redirectUrl ?? this.createCallbackUrl('discord'),
    )
  }

  public override async createAuthorizationUrl(
    state: string,
    codeVerifier: string,
  ): Promise<URL> {
    const url = await this.client.createAuthorizationUrlWithPKCE(
      this.authorizationEndpoint,
      state,
      ['identify', 'email'],
      codeVerifier,
    )

    return url
  }

  public override async fetchUserData(
    code: string,
    codeVerifier: string | null,
  ): Promise<ProviderUserData> {
    const tokenResponse = await this.client.validateAuthorizationCode(
      this.tokenEndpoint,
      code,
      codeVerifier,
    )

    if (!tokenResponse.ok) {
      const error = await tokenResponse.text().catch(() => 'Unknown error')
      throw new Error(`Discord API error: ${error}`)
    }

    const tokenData = (await tokenResponse.json()) as OAuth2Token
    const userResponse = await fetch(this.apiEndpoint, {
      headers: { Authorization: `Bearer ${tokenData.access_token}` },
    })
    if (!userResponse.ok) {
      const error = await userResponse.text().catch(() => 'Unknown error')
      throw new Error(`Discord API error: ${error}`)
    }

    const userData = (await userResponse.json()) as DiscordUserResponse
    return {
      accountId: userData.id,
      email: userData.email,
      name: userData.username,
      image: userData.avatar
        ? `https://cdn.discordapp.com/avatars/${userData.id}/${userData.avatar}.png`
        : '',
    }
  }
}

interface DiscordUserResponse {
  id: string
  email: string
  username: string
  avatar: string
}
