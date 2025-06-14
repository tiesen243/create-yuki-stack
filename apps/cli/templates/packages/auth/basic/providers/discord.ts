import type { ProviderUserData } from '../core/types'
import BaseProvider from './base'

export default class Discord extends BaseProvider {
  protected override authorizationUrl = 'https://discord.com/oauth2/authorize'
  protected override tokenUrl = 'https://discord.com/api/oauth2/token'
  protected override apiUrl = 'https://discord.com/api/users/@me'
  protected override callbackUrl = this.createCallbackUrl('discord')
  protected override scopes = ['identify', 'email']

  constructor(opts: {
    clientId: string
    clientSecret: string
    callbackUrl?: string
  }) {
    super(opts.clientId, opts.clientSecret)
    if (opts.callbackUrl) this.callbackUrl = opts.callbackUrl
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

    if (!response.ok)
      throw new Error(`Failed to fetch user data: ${response.statusText}`)
    const userData = (await response.json()) as DiscordUserResponse

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

