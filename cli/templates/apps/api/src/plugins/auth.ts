import Elysia from 'elysia'

import { auth } from '@{{ name }}/auth'

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
