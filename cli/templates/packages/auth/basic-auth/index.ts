import { authOptions } from '@/config'
import { Auth } from '@/core'

export type { Session, User } from '@/types'
export {
  validateSessionToken,
  invalidateSessionToken,
  invalidateSessionTokens,
} from '@/config'
export { Password } from '@/core/password'
export { generateCsrfToken, verifyRequestOrigin } from '@/csrf'
export { TokenBucketRateLimit } from '@/rate-limit'
export const { auth, signIn, signOut, handlers } = Auth(authOptions)
