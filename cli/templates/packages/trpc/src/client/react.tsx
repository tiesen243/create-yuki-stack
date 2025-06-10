'use client'

import type { QueryClient } from '@tanstack/react-query'
import * as React from 'react'
import { useState } from 'react'
import { env } from '@{{ name }}/env'
import { QueryClientProvider } from '@tanstack/react-query'
import {
  createTRPCClient,
  httpBatchStreamLink,
  httpSubscriptionLink,
  loggerLink,
  splitLink,
} from '@trpc/client'
import { createTRPCOptionsProxy } from '@trpc/tanstack-react-query'
import SuperJSON from 'superjson'

import type { AppRouter } from '../index'
import { createQueryClient } from './query-client'

let clientQueryClientSingleton: QueryClient | undefined = undefined
const getQueryClient = () => {
  if (typeof window === 'undefined') return createQueryClient()
  else return (clientQueryClientSingleton ??= createQueryClient())
}

const TRPCContext = React.createContext<
  | {
      trpc: ReturnType<typeof createTRPCOptionsProxy<AppRouter>>
      trpcClient: ReturnType<typeof createTRPCClient<AppRouter>>
      queryClient: QueryClient
    }
  | undefined
>(undefined)

const useTRPC = () => {
  const context = React.use(TRPCContext)
  if (!context) throw new Error('useTRPC must be used within a TRPCProvider')
  return context
}

function TRPCReactProvider({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const queryClient = getQueryClient()

  const [trpcClient] = useState(() =>
    createTRPCClient<AppRouter>({
      links: [
        loggerLink({
          enabled: (op) =>
            process.env.NODE_ENV === 'development' ||
            (op.direction === 'down' && op.result instanceof Error),
        }),
        splitLink({
          condition: (op) => op.type === 'subscription',
          false: httpBatchStreamLink({
            transformer: SuperJSON,
            url: getBaseUrl() + '/api/trpc',
            headers() {
              const headers = new Headers()
              headers.set('x-trpc-source', 'react')
              return headers
            },
            fetch(input, init) {
              return fetch(input, { ...init, credentials: 'include' })
            },
          }),
          true: httpSubscriptionLink({
            transformer: SuperJSON,
            url: getBaseUrl() + '/api/trpc',
            eventSourceOptions() {
              const headers = new Headers()
              headers.set('x-trpc-source', 'react')
              return {
                headers,
              }
            },
          }),
        }),
      ],
    }),
  )

  const [trpc] = useState(() =>
    createTRPCOptionsProxy<AppRouter>({ client: trpcClient, queryClient }),
  )

  const value = React.useMemo(
    () => ({ trpc, trpcClient, queryClient }),
    [trpc, trpcClient, queryClient],
  )

  return (
    <QueryClientProvider client={queryClient}>
      <TRPCContext value={value}>{children}</TRPCContext>
    </QueryClientProvider>
  )
}

export { useSubscription } from '@trpc/tanstack-react-query'
export { useQuery, useSuspenseQuery, useMutation } from '@tanstack/react-query'
export { TRPCReactProvider, useTRPC }

function getBaseUrl() {
  if (typeof window !== 'undefined') return window.location.origin
  if (env.VERCEL_PROJECT_PRODUCTION_URL)
    return `https://${env.VERCEL_PROJECT_PRODUCTION_URL}`
  if (env.VERCEL_URL) return `https://${env.VERCEL_URL}`

  return `http://localhost:${process.env.PORT ?? {{ port }}}`
}
