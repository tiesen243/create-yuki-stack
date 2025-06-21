import type {
  InferRouterInputs,
  InferRouterOutputs,
  RouterClient,
} from '@orpc/server'

import { o, publicProcedure } from '../orpc'

const appRouter = o.router({
  health: publicProcedure.handler(() => ({ message: 'OK' })),
})

type AppRouter = RouterClient<typeof appRouter>

type RouterInputs = InferRouterInputs<typeof appRouter>
type RouterOutputs = InferRouterOutputs<typeof appRouter>

export type { AppRouter, RouterInputs, RouterOutputs }
export { appRouter }
