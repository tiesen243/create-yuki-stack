import type { ProviderUserData } from '../core/types'
import BaseProvider from './base'

export default class Google extends BaseProvider {
  protected override authorizationUrl =
    'https://accounts.google.com/o/oauth2/v2/auth'
  protected override tokenUrl = 'https://oauth2.googleapis.com/token'
  protected override apiUrl = 'https://openidconnect.googleapis.com/v1/userinfo'
  protected override callbackUrl = this.createCallbackUrl('google')
  protected override scopes = ['openid', 'email', 'profile']

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
    if (!response.ok) {
      const errorText = await response.text().catch(() => 'Unknown error')
      throw new Error(`Google API error (${response.status}): ${errorText}`)
    }

    const userData = (await response.json()) as GoogleUserResponse

    return {
      accountId: userData.sub,
      email: userData.email,
      name: userData.name,
      image: userData.picture,
    }
  }
}

interface GoogleUserResponse {
  sub: string
  email: string
  name: string
  picture: string
}
