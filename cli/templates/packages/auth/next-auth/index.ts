import NextAuth from 'next-auth'

import { authOptions } from './config'

export const { auth, signIn, signOut, handlers } = NextAuth(authOptions)
export { validateSessionToken, invalidateSessionToken } from './config'
