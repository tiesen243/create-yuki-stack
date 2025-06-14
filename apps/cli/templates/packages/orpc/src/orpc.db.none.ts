/**
 * YOU PROBABLY DON'T NEED TO EDIT THIS FILE, UNLESS:
 * 1. You want to modify request context (see Part 1)
 * 2. You want to create a new middleware or type of procedure (see Part 3)
 *
 * tl;dr - this is where all the oRPC server stuff is created and plugged in.
 * The pieces you will need to use are documented accordingly near the end
 */

import { createRouterClient, os } from '@orpc/server'

import { db } from '@{{ name }}/db'

/**
 * 1. CONTEXT
 *
 * This section defines the "contexts" that are available in the backend API.
 *
 * These allow you to access things when processing a request, like the database, the session, etc.
 *
 * This helper generates the "internals" for a oRPC context. The API handler and RSC clients each
 * wrap this and provides the required context.
 *
 * @see https://orpc.unnoq.com/docs/context
 */
const createORPCContext = async (opts: { headers: Headers }) => {
  await new Promise((resolve) => setTimeout(resolve, 100))

  console.log(
    '>>> oRPC Request from',
    opts.headers.get('x-orpc-source') ?? 'unknown',
    'by',
    'anonymous',
  )

  return {
    db
  }
}

const o = os.$context<Awaited<ReturnType<typeof createORPCContext>>>().$config({
  dedupeLeadingMiddlewares: true,
})

/**
 * Create a server-side caller
 * @see https://orpc.unnoq.com/docs/client/server-side
 */
const createCallerFactory = createRouterClient

/**
 * 3. ROUTER & PROCEDURE (THE IMPORTANT BIT)
 *
 * These are the pieces you use to build your oRPC API. You should import these
 * a lot in the /src/routers folder
 *
 * This is how you create new routers and subrouters in your oRPC API
 * @see https://orpc.unnoq.com/docs/router 
 */

/**
 * Middleware for timing procedure execution and adding an articifial delay in development.
 *
 * You can remove this if you don't like it, but it can help catch unwanted waterfalls by simulating
 * network latency that would occur in production but not in local development.
 */
const timingMiddleware = o.middleware(async ({ next, path }) => {
  const start = Date.now()

  if (process.env.NODE_ENV === 'development') {
    // artificial delay in dev 100-500ms
    const waitMs = Math.floor(Math.random() * 400) + 100
    await new Promise((resolve) => setTimeout(resolve, waitMs))
  }

  const result = await next()

  const end = Date.now()
  console.log(`[ORPC] ${path.join('.')} took ${end - start}ms to execute`)
  return result
})

/**
 * Public (unauthed) procedure
 *
 * This is the base piece you use to build new queries and mutations on your
 * oRPC API. It does not guarantee that a user querying is authorized, but you
 * can still access user session data if they are logged in
 */
const publicProcedure = o.use(timingMiddleware)

export {
  o as orpc,
  createCallerFactory,
  createORPCContext,
  publicProcedure,
}
