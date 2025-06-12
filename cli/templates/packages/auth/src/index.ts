import { authOptions } from './config'
import { Auth } from './core'

export type { Session } from './core/adapter'
export const { auth, signIn, signOut, handlers } = Auth(authOptions)
export { Password } from './core/password/index'
export {
  validateSessionToken,
  invalidateSessionToken,
  invalidateSessionTokens,
} from './core/adapter'
