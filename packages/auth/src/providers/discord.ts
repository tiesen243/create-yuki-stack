import { Discord } from 'arctic'

import type { ProviderUserData } from './base'
import { BaseProvider } from './base'

interface DiscordUserResponse {
  id: string
  username: string
  email: string
  avatar: string | null
}

export class DiscordProvider extends BaseProvider {
  protected provider = new Discord(
    process.env.DISCORD_CLIENT_ID ?? '',
    process.env.DISCORD_CLIENT_SECRET ?? '',
    this.createCallbackUrl('discord'),
  )

  protected readonly API_URL = 'https://discord.com/api/users/@me'
  protected readonly SCOPES = ['identify', 'email']

  public createAuthorizationURL(
    state: string,
    codeVerifier: string | null,
  ): URL {
    return this.provider.createAuthorizationURL(
      state,
      codeVerifier,
      this.SCOPES,
    )
  }

  public async fetchUserData(
    code: string,
    codeVerifier: string | null,
  ): Promise<ProviderUserData> {
    const tokens = await this.provider.validateAuthorizationCode(
      code,
      codeVerifier,
    )
    const accessToken = tokens.accessToken()

    const response = await fetch(this.API_URL, {
      headers: { Authorization: `Bearer ${accessToken}` },
    })

    if (!response.ok) {
      const errorText = await response.text().catch(() => 'Unknown error')
      throw new Error(`Discord API error (${response.status}): ${errorText}`)
    }

    const user = (await response.json()) as DiscordUserResponse

    const avatarUrl = user.avatar
      ? `https://cdn.discordapp.com/embed/avatars/${user.id}/${user.avatar}.png`
      : `https://cdn.discordapp.com/embed/avatars/${parseInt(user.id) % 5}.png`

    return {
      accountId: user.id,
      name: user.username,
      email: user.email,
      image: avatarUrl,
    }
  }
}
