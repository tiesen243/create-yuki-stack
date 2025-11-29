import { cache } from 'react'

import { authOptions } from '@/config'
import { Auth } from '@/core'

const { auth: uncachedAuth, signIn, signOut, handler } = Auth(authOptions)

/**
 * This is the main way to get session data for your RSCs.
 * This will de-duplicate all calls to auth's default `auth()` function and only call it once per request
 */
const auth = cache(uncachedAuth)

export type { SessionWithUser } from '@/types'
export { Password } from '@/core/password'
export { auth, signIn, signOut, handler }
