import { cache } from 'react'
import NextAuth from 'next-auth'

import { authOptions } from './config'

const { auth: uncacedAuth, signIn, signOut, handlers } = NextAuth(authOptions)

const auth = cache(uncacedAuth)

export { auth, signIn, signOut, handlers }
export { validateSessionToken, invalidateSessionToken } from './config'
