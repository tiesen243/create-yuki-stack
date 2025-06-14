import os from 'os'

let counter = 0

export function generateCuid(): string {
  const timestamp = Date.now().toString(36)
  const count = (counter++).toString(36).padStart(4, '0')
  const fingerprint = getFingerprint()
  const randomBlock = () => Math.random().toString(36).slice(2, 6)

  return `c${timestamp}${count}${fingerprint}${randomBlock()}`
}

function getFingerprint(): string {
  const pid = process.pid.toString(36)
  const hostname = os.hostname()
  const hostHash = hashString(hostname).slice(0, 4)
  return pid.slice(0, 2) + hostHash
}

function hashString(str: string): string {
  let hash = 0
  for (let i = 0; i < str.length; i++) {
    hash = (hash << 5) - hash + str.charCodeAt(i)
    hash |= 0
  }
  return Math.abs(hash).toString(36)
}
