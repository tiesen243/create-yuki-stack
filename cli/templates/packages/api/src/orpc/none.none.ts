import type { ResponseHeadersPluginContext } from '@orpc/server/plugins'
import { os } from '@orpc/server'

// eslint-disable-next-line @typescript-eslint/require-await
const createORPCContext = async (opts: { headers: Headers }) => {
  console.log(
    '>>> oRPC Request from',
    opts.headers.get('x-orpc-source') ?? 'unknown',
    'by',
    'anonymous',
  )

  return {}
}

const o = os.$context<
  Awaited<ReturnType<typeof createORPCContext>> & ResponseHeadersPluginContext
>()

const timingMiddleware = o.middleware(async ({ next, path }) => {
  const start = Date.now()
  const result = await next()
  const end = Date.now()
  console.log(`[oRPC] ${path} took ${end - start}ms to execute`)
  return result
})

const publicProcedure = o.use(timingMiddleware)

export { o, createORPCContext, publicProcedure }
