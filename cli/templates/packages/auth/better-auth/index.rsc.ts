import { betterAuth } from 'better-auth'
import { cache } from 'react'

import { authOptions } from './config'

const { api, handler } = betterAuth(authOptions)

const auth = cache(async (opts: { headers: Headers }) => {
  const session = await api.getSession(opts)
  return { ...session?.session, user: session?.user }
})

export { api, auth, handler }
