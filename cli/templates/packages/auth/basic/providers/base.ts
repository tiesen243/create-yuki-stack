export interface ProviderUserData {
  accountId: string
  email: string
  name: string
  image: string
}

export default abstract class BaseProvider {
  constructor(
    protected readonly clientId: string,
    protected readonly clientSecret: string,
  ) {}

  abstract getAuthorizationUrl(
    state: string,
    codeVerifier: string | null,
  ): Promise<URL>

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

    return `${baseUrl}/api/auth/callback/${provider}`
  }
}
