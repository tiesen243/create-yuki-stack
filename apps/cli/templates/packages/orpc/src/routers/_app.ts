import type {
  InferRouterInputs,
  InferRouterOutputs,
  RouterClient,
} from '@orpc/server'

import { orpc, publicProcedure } from '../orpc'

const appRouter = orpc.router({
  health: publicProcedure.handler(() => {
    return { status: 'ok' }
  }),
})

/**
 * Export type definition of API
 */
type AppRouter = RouterClient<typeof appRouter>

/**
 * Inference helpers for input types
 * @example
 * type PostByIdInput = RouterInputs['post']['byId']
 *      ^? { id: number }
 **/
type RouterInputs = InferRouterInputs<typeof appRouter>

/**
 * Inference helpers for output types
 * @example
 * type AllPostsOutput = RouterOutputs['post']['all']
 *      ^? Post[]
 **/
type RouterOutputs = InferRouterOutputs<typeof appRouter>

export type { AppRouter, RouterInputs, RouterOutputs }
export { appRouter }
