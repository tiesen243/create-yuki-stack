import { cache } from 'react'

import { authOptions } from './config'
import { Auth } from './core'

const { auth: uncachedAuth, signIn, signOut, handlers } = Auth(authOptions)

/**
 * React-cached authentication function
 *
 * @description
 * This memoized version of auth() ensures that multiple calls within the same
 * React Server Component request will only perform the authentication check once,
 * improving performance in components that need session data.
 */
const auth = cache(uncachedAuth)

export type * from './types'
export { auth, signIn, signOut, handlers }
export {
  validateToken,
  invalidateToken,
  invalidateAllTokens,
} from './core/queries'
export { Password } from './core/password'
