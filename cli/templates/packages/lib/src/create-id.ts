import { createHash } from 'node:crypto'

const createRandom = () => {
  if (
    typeof globalThis !== 'undefined' &&
    typeof globalThis.crypto.getRandomValues === 'function'
  ) {
    return () => {
      const buffer = new Uint32Array(1)
      globalThis.crypto.getRandomValues(buffer)
      return (buffer.at(0) ?? 0) / 0x100000000
    }
  }

  return Math.random
}

const random = createRandom()

const createEntropy = (length = 4, rand = random) => {
  let entropy = ''

  while (entropy.length < length)
    entropy = entropy + Math.floor(rand() * 36).toString(36)

  return entropy
}

const bufToBigInt = (buf: Buffer) => {
  let v = 0n
  for (const i of buf) v = (v << 8n) + BigInt(i)
  return v
}

const hash = (input: string) => {
  const hashBuf = createHash('sha3-512').update(input).digest()
  return bufToBigInt(hashBuf).toString(36).slice(1)
}

const createFingerprint = ({
  globalObj = globalThis,
  random: rand = random,
}) => {
  const globals = Object.keys(globalObj).toString()
  const sourceString = globals.length
    ? globals + createEntropy(32, rand)
    : createEntropy(32, rand)

  return hash(sourceString).substring(0, 32)
}

const createCounter = (count: number) => () => {
  return count++
}

export function createId(rand = random): string {
  const time = Date.now().toString(36)
  const count = createCounter(Math.floor(rand() * 476782367))().toString(36)
  const fingerprint = createFingerprint({ random: rand })

  const salt = createEntropy(24, rand)
  const hashInput = `${time}${salt}${count}${fingerprint}`

  return `c${hash(hashInput).substring(1, 24)}`
}
