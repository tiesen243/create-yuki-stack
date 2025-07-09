import { cache } from 'react'
import { createRouterUtils } from '@orpc/tanstack-query'
import { dehydrate, HydrationBoundary } from '@tanstack/react-query'

import {
  appRouter,
  createCallerFactory,
  createORPCContext,
} from '@{{ name }}/api'

import { createQueryClient } from '@/orpc/query-client'

interface Options {
  headers: Headers
}

/**
 * This wraps the `createORPCContext` helper and provides the required context for the oRPC API when
 * handling a oRPC call from a React Server Component.
 */
const createRscContext = cache((opts: Options) => {
  const heads = new Headers(opts.headers)
  heads.set('x-orpc-source', 'rsc')

  return createORPCContext({ headers: heads })
})

const getQueryClient = cache(createQueryClient)

const createApi = (opts: Options) =>
  createCallerFactory(appRouter, {
    context: createRscContext(opts),
  })

const createORPC = (opts: Options) => createRouterUtils(createApi(opts))

function HydrateClient({ children }: Readonly<{ children: React.ReactNode }>) {
  const queryClient = getQueryClient()

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      {children}
    </HydrationBoundary>
  )
}

export { createApi, createORPC, getQueryClient, HydrateClient }
