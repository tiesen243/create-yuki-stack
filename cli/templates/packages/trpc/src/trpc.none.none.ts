/**
 * YOU PROBABLY DON'T NEED TO EDIT THIS FILE, UNLESS:
 * 1. You want to modify request context (see Part 1)
 * 2. You want to create a new middleware or type of procedure (see Part 3)
 *
 * tl;dr - this is where all the tRPC server stuff is created and plugged in.
 * The pieces you will need to use are documented accordingly near the end
 */

import { initTRPC } from '@trpc/server'
import superjson from 'superjson'

/**
 * 1. CONTEXT
 *
 * This section defines the "contexts" that are available in the backend API.
 *
 * These allow you to access things when processing a request, like the database, the session, etc.
 *
 * This helper generates the "internals" for a tRPC context. The API handler and RSC clients each
 * wrap this and provides the required context.
 *
 * @see https://trpc.io/docs/server/context
 */
const createTRPCContext = (opts: { headers: Headers }) => {
  console.log(
    '>>> tRPC Request from',
    opts.headers.get('x-trpc-source') ?? 'unknown',
    'by',
    'anonymous',
  )

  return {}
}

/**
 * 2. INITIALIZATION
 *
 * This is where the trpc api is initialized, connecting the context and
 * transformer
 */
const t = initTRPC.context<typeof createTRPCContext>().create({
  transformer: superjson,
  sse: {
    maxDurationMs: 5 * 60 * 1_000, // 5 minutes
    ping: { enabled: true, intervalMs: 3_000 },
    client: { reconnectAfterInactivityMs: 5_000 },
  },
  errorFormatter: ({ shape }) => ({
    ...shape,
  }),
})

/**
 * Create a server-side caller
 * @see https://trpc.io/docs/server/server-side-calls
 */
const createCallerFactory = t.createCallerFactory

/**
 * 3. ROUTER & PROCEDURE (THE IMPORTANT BIT)
 *
 * These are the pieces you use to build your tRPC API. You should import these
 * a lot in the /src/routers folder
 *
 * This is how you create new routers and subrouters in your tRPC API
 * @see https://trpc.io/docs/router
 */

/**
 * Middleware for timing procedure execution.
 *
 * You can remove this if you don't like it, but it can help catch unwanted waterfalls by simulating
 * network latency that would occur in production but not in local development.
 */
const timingMiddleware = t.middleware(async ({ next, path }) => {
  const start = Date.now()

  if (t._config.isDev) {
    // artificial delay in dev 100-500ms
    const waitMs = Math.floor(Math.random() * 400) + 100
    await new Promise((resolve) => setTimeout(resolve, waitMs))
  }

  const result = await next()

  const end = Date.now()
  console.log(`[tRPC] ${path} took ${end - start}ms to execute`)

  return result
})

/**
 * Public (unauthed) procedure
 *
 * This is the base piece you use to build new queries and mutations on your
 * tRPC API. It does not guarantee that a user querying is authorized, but you
 * can still access user session data if they are logged in
 */
const publicProcedure = t.procedure.use(timingMiddleware)

export {
  t as trpc,
  createCallerFactory,
  createTRPCContext,
  publicProcedure,
}
