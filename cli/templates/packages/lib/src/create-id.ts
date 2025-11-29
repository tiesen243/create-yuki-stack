import { createHash, randomBytes } from 'node:crypto'

const createEntropy = (len = 24) => {
  return randomBytes(len)
    .toString('base64')
    .replace(/[^a-zA-Z0-9]/g, '')
    .slice(0, len)
}

const bufToBigInt = (buf: Buffer) => {
  let v = 0n
  for (const i of buf) v = (v << 8n) + BigInt(i)
  return v
}

const hash = (input: string) => {
  const hashBuf = createHash('sha3-512').update(input).digest()
  return bufToBigInt(hashBuf).toString(36)
}

export function createId(): string {
  const time = Date.now().toString(36)
  const salt = createEntropy(24)
  const hashInput = time + salt
  return `c${hash(hashInput).substring(1, 24)}`
}
