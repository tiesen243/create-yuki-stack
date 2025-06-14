function generateSecureString(): string {
  const alphabet = 'abcdefghijklmnpqrstuvwxyz23456789'

  const bytes = new Uint8Array(24)
  crypto.getRandomValues(bytes)

  let id = ''
  for (const b of bytes) id += alphabet[b >> 3] ?? ''

  return id
}

async function hashSecret(secret: string): Promise<Uint8Array> {
  const secretBytes = new TextEncoder().encode(secret)
  const secretHashBuffer = await crypto.subtle.digest('SHA-256', secretBytes)
  return new Uint8Array(secretHashBuffer)
}

function encodeHex(bytes: Uint8Array): string {
  return Array.from(bytes, (byte) => byte.toString(16).padStart(2, '0')).join(
    '',
  )
}

function decodeHex(hex: string): Uint8Array {
  if (hex.length % 2 !== 0) throw new Error('Invalid hex string')

  const bytes = new Uint8Array(hex.length / 2)
  for (let i = 0; i < hex.length; i += 2)
    bytes[i / 2] = parseInt(hex.slice(i, i + 2), 16)

  return bytes
}

function constantTimeEqual(a: Uint8Array, b: Uint8Array): boolean {
  if (a.byteLength !== b.byteLength) return false

  let c = 0
  // @ts-expect-error - TypeScript doesn't recognize that Uint8Array is iterable
  for (let i = 0; i < a.byteLength; i++) c |= a[i] ^ b[i]
  return c === 0
}

export {
  constantTimeEqual,
  decodeHex,
  encodeHex,
  generateSecureString,
  hashSecret,
}
