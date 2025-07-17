import type { ResponseHeadersPluginContext } from '@orpc/server/plugins'
import { createRouterClient, ORPCError, os } from '@orpc/server'

import { auth, validateSessionToken } from '@{{ name }}/auth'
import { db } from '@{{ name }}/db'

const isomorphicGetSession = async (headers: Headers) => {
  const authToken = headers.get('Authorization') ?? null
  if (authToken) return validateSessionToken(authToken)
  return auth()
}

const createORPCContext = async (opts: { headers: Headers }) => {
  const session = await isomorphicGetSession(opts.headers)

  console.log(
    '>>> oRPC Request from',
    opts.headers.get('x-orpc-source') ?? 'unknown',
    'by',
    session?.user?.name ?? 'anonymous',
  )

  return {
    db,
    session,
  }
}

const o = os.$context<
  Awaited<ReturnType<typeof createORPCContext>> & ResponseHeadersPluginContext
>()

const createCallerFactory = createRouterClient

const timingMiddleware = o.middleware(async ({ next, path }) => {
  const start = Date.now()
  const result = await next()
  const end = Date.now()
  console.log(`[oRPC] ${path} took ${end - start}ms to execute`)
  return result
})

const publicProcedure = o.use(timingMiddleware)
const protectedProcedure = o.use(timingMiddleware).use(({ context, next }) => {
  if (!context.session?.user) throw new ORPCError('UNAUTHORIZED')
  return next({
    context: {
      session: { ...context.session, user: context.session.user },
    },
  })
})

export {
  o,
  createCallerFactory,
  createORPCContext,
  publicProcedure,
  protectedProcedure,
}
