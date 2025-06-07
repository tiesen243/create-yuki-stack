export interface ProviderUserData {
  accountId: string
  name: string
  email: string
  image: string
}

export abstract class BaseProvider {
  protected abstract provider: unknown

  protected abstract readonly API_URL: string
  protected abstract readonly SCOPES: string[]

  abstract createAuthorizationURL(
    state: string,
    codeVerifier: string | null,
  ): URL

  abstract fetchUserData(
    code: string,
    codeVerifier: string | null,
  ): Promise<ProviderUserData>

  protected createCallbackUrl(provider: string) {
    let baseUrl = `http://localhost:${process.env.PORT ?? 3000}`
    if (process.env.VERCEL_PROJECT_PRODUCTION_URL)
      baseUrl = `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
    else if (process.env.VERCEL_URL)
      baseUrl = `https://${process.env.VERCEL_URL}`

    return `${baseUrl}/api/auth/${provider}/callback`
  }
}
