import { appRouter } from '@/routers/_app'
import { createCallerFactory } from '@/trpc'

const createCaller = createCallerFactory(appRouter)

export type { AppRouter, RouterInputs, RouterOutputs } from '@/routers/_app'
export type { TRPCMeta, TRPCContext } from '@/trpc'
export { createTRPCContext } from '@/trpc'
export { appRouter, createCaller }
