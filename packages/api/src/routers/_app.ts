import type { inferRouterInputs, inferRouterOutputs } from '@trpc/server'

import { createTRPCRouter } from '../trpc'
import { authRouter } from './auth'
import { postRouter } from './post'

const appRouter = createTRPCRouter({
  auth: authRouter,
  post: postRouter,
})

/**
 * Export type definition of API
 */
type AppRouter = typeof appRouter

/**
 * Inference helpers for input types
 * @example
 * type PostByIdInput = RouterInputs['post']['byId']
 *      ^? { id: number }
 **/
type RouterInputs = inferRouterInputs<AppRouter>

/**
 * Inference helpers for output types
 * @example
 * type AllPostsOutput = RouterOutputs['post']['all']
 *      ^? Post[]
 **/
type RouterOutputs = inferRouterOutputs<AppRouter>

export type { AppRouter, RouterInputs, RouterOutputs }
export { appRouter }
