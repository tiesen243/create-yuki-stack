import { cache } from 'react'
import { createRouterUtils } from '@orpc/react-query'
import { dehydrate, HydrationBoundary } from '@tanstack/react-query'

import {
  appRouter,
  createORPCContext,
  createRouterClient,
} from '@{{ name }}/api'

import { createQueryClient } from '@/orpc/query-client'

interface Options {
  headers: Headers
}

const createRscContext = cache((opts: Options) => {
  const heads = new Headers(opts.headers)
  heads.set('x-orpc-source', 'rsc')

  return createORPCContext({ headers: heads })
})

const getQueryClient = cache(createQueryClient)

const createORPC = (opts: Options) =>
  createRouterUtils(
    createRouterClient(appRouter, {
      context: createRscContext(opts),
    }),
  )

function HydrateClient({ children }: Readonly<{ children: React.ReactNode }>) {
  const queryClient = getQueryClient()

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      {children}
    </HydrationBoundary>
  )
}

export { createORPC, getQueryClient, HydrateClient }
