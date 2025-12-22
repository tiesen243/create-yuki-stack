import { auth } from '@{{ name }}/auth'
import Elysia from 'elysia'

export const authPlugin = new Elysia({ name: 'auth' })
  .derive({ as: 'global' }, async ({ headers }) => {
    const session = await auth({ headers: new Headers(headers) })
    return { session }
  })
  .macro({
    protected: {
      resolve: ({ session, status }) => {
        if (!session.user) return status(401, 'Unauthorized')
        return {
          session: { ...session, user: session.user },
        }
      },
    },
  })
