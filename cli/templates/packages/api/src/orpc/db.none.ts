import type { ResponseHeadersPluginContext } from '@orpc/server/plugins'
import { createRouterClient, os } from '@orpc/server'

import { db } from '@{{ name }}/db'

const createORPCContext = async (opts: { headers: Headers }) => {
  console.log(
    '>>> oRPC Request from',
    opts.headers.get('x-trpc-source') ?? 'unknown',
    'by',
    'anonymous',
  )

  return {
    db,
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

export {
  o,
  createCallerFactory,
  createORPCContext,
  publicProcedure,
}
