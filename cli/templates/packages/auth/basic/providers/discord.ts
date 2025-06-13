import type { ProviderUserData } from './base'
import BaseProvider from './base'

export class Discord extends BaseProvider {
  private authorizationUrl = 'https://discord.com/oauth2/authorize'
  private tokenUrl = 'https://discord.com/api/oauth2/token'
  private callbackUrl = this.createCallbackUrl('discord')

  constructor(opts: { clientId: string; clientSecret: string }) {
    super(opts.clientId, opts.clientSecret)
  }

  override async getAuthorizationUrl(
    state: string,
    codeVerifier: string | null,
  ): Promise<URL> {
    const url = new URL(this.authorizationUrl)
    url.searchParams.set('response_type', 'code')
    url.searchParams.set('client_id', this.clientId)
    url.searchParams.set('scope', 'identify email')
    url.searchParams.set('state', state)
    url.searchParams.set('redirect_uri', this.callbackUrl)
    url.searchParams.set('integration_type', '0')
    if (codeVerifier) {
      const codeChallenge = await this.generateCodeChallenge(codeVerifier)
      url.searchParams.set('code_challenge', codeChallenge)
      url.searchParams.set('code_challenge_method', 'S256')
    }

    return url
  }
  override async fetchUserData(
    code: string,
    codeVerifier: string | null,
  ): Promise<ProviderUserData> {
    const body = new URLSearchParams()
    body.set('grant_type', 'authorization_code')
    body.set('code', code)
    body.set('redirect_uri', this.callbackUrl)
    if (codeVerifier) body.set('code_verifier', codeVerifier)

    const tokenResponse = await fetch(this.tokenUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        Authorization: `Basic ${this.encodeCredentials(this.clientId, this.clientSecret)}`,
      },
      body,
    })

    if (!tokenResponse.ok)
      throw new Error(
        `Failed to fetch access token: ${tokenResponse.statusText}`,
      )

    const { access_token: token } = (await tokenResponse.json()) as {
      access_token: string
      token_type: string
      expires_in: number
    }

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
