import { Google } from 'arctic'

import type { ProviderUserData } from './base'
import { BaseProvider } from './base'

interface GoogleUserResponse {
  sub: string
  email: string
  name: string
  picture: string
}

export class GoogleProvider extends BaseProvider {
  protected provider = new Google(
    process.env.GOOGLE_CLIENT_ID ?? '',
    process.env.GOOGLE_CLIENT_SECRET ?? '',
    this.createCallbackUrl('google'),
  )

  protected readonly API_URL =
    'https://openidconnect.googleapis.com/v1/userinfo'
  protected readonly SCOPES = ['openid', 'profile', 'email']

  public createAuthorizationURL(
    state: string,
    codeVerifier: string | null,
  ): URL {
    return this.provider.createAuthorizationURL(
      state,
      codeVerifier ?? '',
      this.SCOPES,
    )
  }

  public async fetchUserData(
    code: string,
    codeVerifier: string | null,
  ): Promise<ProviderUserData> {
    const tokens = await this.provider.validateAuthorizationCode(
      code,
      codeVerifier ?? '',
    )
    const accessToken = tokens.accessToken()

    const response = await fetch(this.API_URL, {
      headers: { Authorization: `Bearer ${accessToken}` },
    })
    if (!response.ok) {
      const errorText = await response.text().catch(() => 'Unknown error')
      throw new Error(`Google API error (${response.status}): ${errorText}`)
    }

    const user = (await response.json()) as GoogleUserResponse

    return {
      accountId: user.sub,
      name: user.name,
      email: user.email,
      image: user.picture,
    }
  }
}
