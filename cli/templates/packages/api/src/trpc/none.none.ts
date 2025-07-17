import { initTRPC } from '@trpc/server'
import SuperJSON from 'superjson'

// eslint-disable-next-line @typescript-eslint/require-await
const createTRPCContext = async (opts: { headers: Headers }) => {
  console.log(
    '>>> tRPC Request from',
    opts.headers.get('x-trpc-source') ?? 'unknown',
    'by',
    'anonymous',
  )

  return {}
}

const t = initTRPC.context<typeof createTRPCContext>().create({
  transformer: SuperJSON,
  sse: {
    maxDurationMs: 1_000 * 60 * 5, // 5 minutes
    ping: { enabled: true, intervalMs: 3_000 },
    client: { reconnectAfterInactivityMs: 5_000 },
  },
})

const createCallerFactory = t.createCallerFactory

const createTRPCRouter = t.router

const timingMiddleware = t.middleware(async ({ next, path }) => {
  const start = Date.now()
  const result = await next()
  const end = Date.now()
  console.log(`[tRPC] ${path} took ${end - start}ms to execute`)
  return result
})

const publicProcedure = t.procedure.use(timingMiddleware)

export {
  createCallerFactory,
  createTRPCContext,
  createTRPCRouter,
  publicProcedure,
}
