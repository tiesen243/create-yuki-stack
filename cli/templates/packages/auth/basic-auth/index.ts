import { authOptions } from '@/config'
import { Auth } from '@/core'

export type { SessionWithUser, User } from '@/types'
export { Password } from '@/core/password'
export const { auth, signIn, signOut, handler } = Auth(authOptions)
