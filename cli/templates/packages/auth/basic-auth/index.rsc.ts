import { cache } from 'react'

import { authOptions } from '@/config'
import { Auth } from '@/core'

const { auth: uncachedAuth, signIn, signOut, handlers } = Auth(authOptions)

/**
 * This is the main way to get session data for your RSCs.
 * This will de-duplicate all calls to auth's default `auth()` function and only call it once per request
 */
const auth = cache(uncachedAuth)

export type { Session, User } from '@/types'
export {
  validateSessionToken,
  invalidateSessionToken,
  invalidateSessionTokens,
} from '@/config'
export { Password } from '@/core/password'
export { generateCsrfToken, verifyRequestOrigin } from '@/csrf'
export { TokenBucketRateLimit } from '@/rate-limit'
export { auth, signIn, signOut, handlers }
