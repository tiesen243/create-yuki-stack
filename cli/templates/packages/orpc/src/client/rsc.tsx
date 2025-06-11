import { cache } from 'react'
import { createRouterUtils } from '@orpc/tanstack-query'
import { dehydrate, HydrationBoundary } from '@tanstack/react-query'

import { createCallerFactory, createORPCContext } from '../orpc'
import { appRouter } from '../routers/_app'
import { createQueryClient } from './query-client'

interface Options {
  headers: Headers
}

/**
 * This wraps the `createORPCContext` helper and provides the required context for the oRPC API when
 * handling a oRPC call from a React Server Component.
 */
const createContext = cache((opts: Options) => {
  const heads = new Headers(opts.headers)
  heads.set('x-orpc-source', 'rsc')

  return createORPCContext({ headers: heads })
})

const getQueryClient = cache(createQueryClient)

const createApi = (opts: Options) =>
  createCallerFactory(appRouter, {
    context: createContext(opts),
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
