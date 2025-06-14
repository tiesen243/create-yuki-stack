import { constantTimeEqual, decodeHex, encodeHex } from '../crypto'
import { scrypt } from './scrypt'

export class Password {
  private N: number
  private r: number
  private p: number
  private dkLen: number

  constructor(options?: {
    N?: number
    r?: number
    p?: number
    dkLen?: number
  }) {
    this.N = options?.N ?? 16384
    this.r = options?.r ?? 16
    this.p = options?.p ?? 1
    this.dkLen = options?.dkLen ?? 64
  }

  async hash(password: string): Promise<string> {
    const salt = encodeHex(crypto.getRandomValues(new Uint8Array(16)))
    const key = await this.generateKey(password.normalize('NFKC'), salt)
    return `${salt}:${encodeHex(key)}`
  }

  async verify(hash: string, password: string): Promise<boolean> {
    const parts = hash.split(':')
    if (parts.length !== 2) return false

    const [salt, key] = parts
    const targetKey = await this.generateKey(password.normalize('NFKC'), salt)
    return constantTimeEqual(targetKey, decodeHex(key ?? ''))
  }

  private async generateKey(data: string, salt?: string): Promise<Uint8Array> {
    const textEncoder = new TextEncoder()
    const keyUint8Array = await scrypt(
      textEncoder.encode(data),
      textEncoder.encode(salt),
      { N: this.N, r: this.r, p: this.p, dkLen: this.dkLen },
    )

    return new Uint8Array(keyUint8Array)
  }
}
