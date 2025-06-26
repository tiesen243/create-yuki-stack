import { authOptions } from './config'
import { Auth } from './core'

export type { Session, User } from './core/types'
export { Password } from './core/password/index'
export const {
  auth,
  signIn,
  signOut,
  validateSessionToken,
  invalidateSessionToken,
  handlers,
} = Auth(authOptions)
