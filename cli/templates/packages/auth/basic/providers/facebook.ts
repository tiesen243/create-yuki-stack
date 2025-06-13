import type { ProviderUserData } from './base'
import BaseProvider from './base'

export default class Facebook extends BaseProvider {
  private authorizationUrl = 'https://www.facebook.com/v23.0/dialog/oauth'
  private tokenUrl = 'https://graph.facebook.com/v23.0/oauth/access_token'
  private apiUrl = 'https://graph.facebook.com/me'
  private callbackUrl = this.createCallbackUrl('facebook')

  constructor(opts: { clientId: string; clientSecret: string }) {
    super(opts.clientId, opts.clientSecret)
  }

  override getAuthorizationUrl(
    state: string,
    _codeVerifier: string | null,
  ): Promise<URL> {
    const url = new URL(this.authorizationUrl)
    url.searchParams.set('client_id', this.clientId)
    url.searchParams.set('redirect_uri', this.callbackUrl)
    url.searchParams.set('state', state)
    url.searchParams.set('response_type', 'code')
    url.searchParams.set('scope', 'email public_profile')

    return Promise.resolve(url)
  }
  override async fetchUserData(
    code: string,
    _codeVerifier: string | null,
  ): Promise<ProviderUserData> {
    const body = new URLSearchParams()
    body.set('client_id', this.clientId)
    body.set('client_secret', this.clientSecret)
    body.set('redirect_uri', this.callbackUrl)
    body.set('code', code)

    const tokenResponse = await fetch(this.tokenUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
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

    const searchParams = new URLSearchParams()
    searchParams.set('access_token', token)
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
