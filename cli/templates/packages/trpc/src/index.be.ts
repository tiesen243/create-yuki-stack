import { appRouter } from './routers/_app'
import { createTRPCContext } from './trpc'

export type { AppRouter, RouterInputs, RouterOutputs } from './routers/_app'
export { appRouter, createTRPCContext }
