import { cache } from 'react'
import { createTRPCOptionsProxy } from '@trpc/tanstack-react-query'

import { appRouter, createCaller, createTRPCContext } from '@yuki/api'

import { createQueryClient } from '@/lib/trpc/query-client'

/**
 * This wraps the `createTRPCContext` helper and provides the required context for the tRPC API when
 * handling a tRPC call from a React Server Component.
 */
const createContext = cache(async (headers: Headers) => {
  const heads = new Headers(headers)
  heads.set('x-trpc-source', 'rsc')

  return createTRPCContext({ headers: heads })
})

const getQueryClient = cache(createQueryClient)

const api = (headers: Headers) => createCaller(() => createContext(headers))
const trpc = (headers: Headers) =>
  createTRPCOptionsProxy({
    ctx: () => createContext(headers),
    queryClient: getQueryClient,
    router: appRouter,
  })

export { api, trpc, getQueryClient }
