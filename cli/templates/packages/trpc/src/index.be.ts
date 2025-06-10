import { appRouter } from './routers/_app'
import { createCallerFactory, createTRPCContext } from './trpc'

/**
 * Create a server-side caller for the tRPC API
 * @example
 * const trpc = createCaller(createContext);
 * const res = await trpc.post.all();
 *       ^? Post[]
 */
const createCaller = createCallerFactory(appRouter)

export type { AppRouter, RouterInputs, RouterOutputs } from './routers/_app'
export { appRouter, createCaller, createTRPCContext }
