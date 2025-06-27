import { authOptions } from './config'
import { Auth } from './core'

export type { Session, SessionResult, User } from './core/types'
export { validateSessionToken, invalidateSessionToken } from './config'
export { Password } from './core/password'
export const { auth, signIn, signOut, handlers } = Auth(authOptions)
