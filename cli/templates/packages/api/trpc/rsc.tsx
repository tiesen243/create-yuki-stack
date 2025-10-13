import { cache } from 'react'
import { dehydrate, HydrationBoundary } from '@tanstack/react-query'
import { createTRPCOptionsProxy } from '@trpc/tanstack-react-query'

import {
  appRouter,
  createCallerFactory,
  createTRPCContext,
} from '@{{ name }}/api'

import { createQueryClient } from '@/trpc/query-client'

interface Options {
  headers: Headers
}

const createRscContext = cache((opts: Options) => {
  const heads = new Headers(opts.headers)
  heads.set('x-trpc-source', 'rsc')

  return createTRPCContext({ headers: heads })
})

const getQueryClient = cache(createQueryClient)

const createApi = (opts: Options) =>
  createCallerFactory(appRouter)(() => createRscContext(opts))

const createTRPC = (opts: Options) =>
  createTRPCOptionsProxy({
    ctx: () => createRscContext(opts),
    queryClient: getQueryClient,
    router: appRouter,
  })

function HydrateClient({ children }: Readonly<{ children: React.ReactNode }>) {
  const queryClient = getQueryClient()

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      {children}
    </HydrationBoundary>
  )
}

export { createApi, createTRPC, getQueryClient, HydrateClient }
