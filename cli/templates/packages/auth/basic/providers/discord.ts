import { Discord as Provider } from 'arctic'

import type { ProviderUserData } from './base'
import BaseProvider from './base'

export class Discord extends BaseProvider {
  private provider: Provider

  constructor(opts: { clientId: string; clientSecret: string }) {
    super(opts.clientId, opts.clientSecret)
    this.provider = new Provider(
      opts.clientId,
      opts.clientSecret,
      this.createCallbackUrl('discord'),
    )
  }

  override getAuthorizationUrl(
    state: string,
    codeVerifier: string | null,
  ): Promise<URL> {
    const url = this.provider.createAuthorizationURL(state, codeVerifier, [
      'identify',
      'email',
    ])
    return Promise.resolve(url)
  }
  override async fetchUserData(
    code: string,
    codeVerifier: string | null,
  ): Promise<ProviderUserData> {
    const t = await this.provider.validateAuthorizationCode(code, codeVerifier)
    const token = t.accessToken()

    const response = await fetch('https://discord.com/api/users/@me', {
      headers: { Authorization: `Bearer ${token}` },
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
