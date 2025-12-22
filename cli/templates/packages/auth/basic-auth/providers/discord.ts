import type { OAuth2Token, OAuthAccount } from '@/types'

import { BaseProvider } from '@/providers/base'

export class Discord extends BaseProvider {
  constructor(clientId: string, clientSecret: string, redirectUri = '') {
    super('discord', clientId, clientSecret, redirectUri)
  }

  private authorizationEndpoint = 'https://discord.com/oauth2/authorize'
  private tokenEndpoint = 'https://discord.com/api/oauth2/token'
  private apiEndpoint = 'https://discord.com/api/users/@me'

  public override async createAuthorizationUrl(
    state: string,
    codeVerifier: string,
  ): Promise<URL> {
    const url = await this.createAuthorizationUrlWithPKCE(
      this.authorizationEndpoint,
      state,
      ['identify', 'email'],
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
      id: userData.id,
      name: userData.username,
      email: userData.email,
      image: userData.avatar
        ? `https://cdn.discordapp.com/avatars/${userData.id}/${userData.avatar}.png`
        : '',
    }
  }
}

interface DiscordUserResponse {
  id: string
  username: string
  email: string
  avatar: string | null
}
