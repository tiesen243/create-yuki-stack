import { cache } from 'react'
import { dehydrate, HydrationBoundary } from '@tanstack/react-query'
import { createTRPCOptionsProxy } from '@trpc/tanstack-react-query'

import { appRouter, createTRPCContext } from '../index'
import { createCallerFactory } from '../trpc'
import { createQueryClient } from './query-client'

interface Options {
  headers: Headers
}

/**
 * This wraps the `createTRPCContext` helper and provides the required context for the tRPC API when
 * handling a tRPC call from a React Server Component.
 */
const createContext = cache((opts: Options) => {
  const heads = new Headers(opts.headers)
  heads.set('x-trpc-source', 'rsc')

  return createTRPCContext({ headers: heads })
})

const getQueryClient = cache(createQueryClient)

const createApi = (opts: Options) =>
  createCallerFactory(appRouter)(() => createContext(opts))

const createTRPC = (opts: Options) =>
  createTRPCOptionsProxy({
    ctx: () => createContext(opts),
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

