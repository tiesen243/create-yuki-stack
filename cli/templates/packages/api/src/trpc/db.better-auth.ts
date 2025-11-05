import { initTRPC, TRPCError } from '@trpc/server'
import SuperJSON from 'superjson'

import { auth } from '@{{ name }}/auth'
import { db } from '@{{ name }}/db'

interface TRPCMeta {
  message?: string
}

interface TRPCContext {
  headers: Headers
  session: Awaited<ReturnType<typeof auth>> | null
  db: typeof db
}

const createTRPCContext = async (opts: { headers: Headers }): TRPCContext => {
  const session = await auth(opts)

  return {
    headers: opts.headers,
    session,
    db,
  }
}

const t = initTRPC
  .meta<TRPCMeta>()
  .context<TRPCContext>()
  .create({
    transformer: SuperJSON,
    errorFormatter({ type, path, shape }) {
      if (shape.message !== `No procedure found on path "${path}"`)
        console.error(
          `[tRPC] <<< [${type}] ${path} ${shape.data.httpStatus}: ${shape.message}`,
        )

      if (shape.message.startsWith('Failed query: '))
        shape.message =
          'An error occurred. Please try again later or contact the administrator.'
      return shape
    },
  })

const createCallerFactory = t.createCallerFactory

const createTRPCRouter = t.router

const loggingMiddleware = t.middleware(
  async ({ ctx, next, type, path, meta }) => {
    console.log(
      '[tRPC] >>> Request from',
      ctx.headers.get('x-trpc-source') ?? 'unknown',
      'by',
      ctx.session.user?.name ?? 'guest',
      `at ${path}`,
    )

    const start = performance.now()
    const result = await next()
    const end = performance.now()
    console.log(`[tRPC] took ${(end - start).toFixed(2)}ms to execute`)

    if (result.ok) {
      const codeMap = { query: 200, mutation: 201, subscription: 200 } as const
      console.log(
        `[tRPC] <<< [${type}] ${path} ${codeMap[type]}: ${meta?.message ?? 'Success'}`,
      )
    }

    return result
  },
)

const publicProcedure = t.procedure.use(loggingMiddleware)
const protectedProcedure = t.procedure
  .use(loggingMiddleware)
  .use(({ ctx, next }) => {
    if (!ctx.session.user) throw new TRPCError({ code: 'UNAUTHORIZED' })
    return next({
      ctx: {
        session: { ...ctx.session, user: ctx.session.user },
      },
    })
  })

export type { TRPCMeta, TRPCContext }
export {
  createCallerFactory,
  createTRPCContext,
  createTRPCRouter,
  publicProcedure,
  protectedProcedure,
}
