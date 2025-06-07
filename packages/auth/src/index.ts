import { authOptions } from './config'
import { Auth } from './core'

export type * from './types'
export const { auth, signIn, signOut, handlers } = Auth(authOptions)
export {
  validateToken,
  invalidateToken,
  invalidateAllTokens,
} from './core/queries'
export { Password } from './core/password'
