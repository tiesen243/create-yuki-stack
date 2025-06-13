import type { ProviderUserData } from './base'
import BaseProvider from './base'

export default class Facebook extends BaseProvider {
  protected override authorizationUrl =
    'https://www.facebook.com/v23.0/dialog/oauth'
  protected override tokenUrl =
    'https://graph.facebook.com/v23.0/oauth/access_token'
  protected override apiUrl = 'https://graph.facebook.com/me'
  protected override callbackUrl = this.createCallbackUrl('facebook')
  protected override scopes = ['email', 'public_profile']

  constructor(opts: { clientId: string; clientSecret: string }) {
    super(opts.clientId, opts.clientSecret)
  }

  override async createAuthorizationUrl(
    state: string,
    _codeVerifier: string | null,
  ): Promise<URL> {
    return super.createAuthorizationUrl(state, null)
  }

  override async fetchUserData(
    code: string,
    _codeVerifier: string | null,
  ): Promise<ProviderUserData> {
    const { access_token } = await this.validateAuthorizationCode(code, null)

    const searchParams = new URLSearchParams()
    searchParams.set('access_token', access_token)
    searchParams.set('fields', ['id', 'name', 'picture', 'email'].join(','))
    const response = await fetch(`${this.apiUrl}?${searchParams.toString()}`)
    if (!response.ok) {
      const errorText = await response.text().catch(() => 'Unknown error')
      throw new Error(`Facebook API error (${response.status}): ${errorText}`)
    }

    const userData = (await response.json()) as FacebookUserResponse

    return {
      accountId: userData.id,
      email: userData.email,
      name: userData.name,
      image: userData.picture.data.url,
    }
  }
}

interface FacebookUserResponse {
  id: string
  email: string
  name: string
  picture: { data: { url: string } }
}
