import { betterAuth } from 'better-auth'

import { authOptions } from './config'

const { api, handler } = betterAuth(authOptions)

const auth = async (opts: { headers: Headers }) => {
  const session = await api.getSession(opts)
  return { ...session?.session, user: session?.user }
}

export { api, auth, handler }
