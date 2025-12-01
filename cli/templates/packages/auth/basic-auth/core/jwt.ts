import { decodeBase64Url, encodeBase64Url } from '@/core/crypto'

export type JWTAlgorithm = 'HS256' | 'HS384' | 'HS512'

export interface JWTOptions {
  headers?: Record<string, unknown>
  expiresIn?: number
  issuer?: string
  subject?: string
  audiences?: string | string[]
  notBefore?: Date
  includeIssuedTimestamp?: boolean
  jwtId?: string
}

export interface JWTHeader {
  exp: number
  aud?: string | string[]
  iat?: number
  iss?: string
  jti?: string
  nbf?: number
  sub?: string
  [key: string]: unknown
}

export class JWT<TValue extends Record<string, unknown>> {
  constructor(
    private readonly secret = '',
    private readonly algorithm: JWTAlgorithm = 'HS256',
  ) {}

  public async sign(
    payloadClaims: TValue,
    options: JWTOptions = {},
  ): Promise<string> {
    const header = {
      alg: this.algorithm,
      typ: 'JWT',
      ...options.headers,
    }

    const payload = { ...payloadClaims } as Record<string, unknown>
    payload.exp = Math.floor(Date.now() / 1000) + (options.expiresIn ?? 3600)

    if (options.audiences) payload.aud = options.audiences
    if (options.subject) payload.sub = options.subject
    if (options.issuer) payload.iss = options.issuer
    if (options.jwtId) payload.jti = options.jwtId
    if (options.notBefore)
      payload.nbf = Math.floor(options.notBefore.getTime() / 1000)
    if (options.includeIssuedTimestamp)
      payload.iat = Math.floor(Date.now() / 1000)

    const textEncoder = new TextEncoder()
    const headerPart = encodeBase64Url(
      textEncoder.encode(JSON.stringify(header)),
    )
    const payloadPart = encodeBase64Url(
      textEncoder.encode(JSON.stringify(payload)),
    )

    const data = textEncoder.encode(`${headerPart}.${payloadPart}`)
    const signature = await this.signData(data)
    const signaturePart = encodeBase64Url(new Uint8Array(signature))

    return `${headerPart}.${payloadPart}.${signaturePart}`
  }

  public async verify(token: string): Promise<TValue & JWTHeader> {
    const [headerPart, payloadPart, signaturePart] = token.split('.')
    if (!headerPart || !payloadPart || !signaturePart)
      throw new Error('Invalid token format')

    const textEncoder = new TextEncoder()
    const data = textEncoder.encode(`${headerPart}.${payloadPart}`)

    const expectedSignature = await this.signData(data)

    const expectedSignaturePart = encodeBase64Url(
      new Uint8Array(expectedSignature),
    )
    if (expectedSignaturePart !== signaturePart)
      throw new Error('Invalid token signature')

    const payloadJson = new TextDecoder().decode(decodeBase64Url(payloadPart))
    const headerJson = new TextDecoder().decode(decodeBase64Url(headerPart))

    const payload = JSON.parse(payloadJson) as TValue & JWTHeader
    const header = JSON.parse(headerJson) as Record<string, unknown>

    const currentTime = Math.floor(Date.now() / 1000)
    if (payload.exp && currentTime >= payload.exp)
      throw new Error('Token has expired')
    if (payload.nbf && currentTime < payload.nbf)
      throw new Error('Token not valid yet')

    return { ...payload, ...header }
  }

  private async signData(data: Uint8Array): Promise<ArrayBuffer> {
    const algMap = {
      HS256: { name: 'SHA-256' },
      HS384: { name: 'SHA-384' },
      HS512: { name: 'SHA-512' },
    } as const

    const key = await crypto.subtle.importKey(
      'raw',
      new TextEncoder().encode(this.secret),
      { name: 'HMAC', hash: algMap[this.algorithm] },
      false,
      ['sign'],
    )

    return crypto.subtle.sign('HMAC', key, data as Uint8Array<ArrayBuffer>)
  }
}
