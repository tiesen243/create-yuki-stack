import type { QueryClient } from '@tanstack/react-query'
import type { TRPCClient } from '@trpc/client'
import type { TRPCOptionsProxy } from '@trpc/tanstack-react-query'
import * as React from 'react'
import { QueryClientProvider } from '@tanstack/react-query'
import {
  createTRPCClient,
  httpBatchStreamLink,
  httpSubscriptionLink,
  splitLink,
} from '@trpc/client'
import { createTRPCOptionsProxy } from '@trpc/tanstack-react-query'
import SuperJSON from 'superjson'

import type { AppRouter } from '@{{ name }}/api'

import { getBaseUrl } from '@/lib/utils'
import { createQueryClient } from '@/trpc/query-client'

let clientQueryClientSingleton: QueryClient | undefined = undefined
const getQueryClient = () => {
  if (typeof window === 'undefined') return createQueryClient()
  else return (clientQueryClientSingleton ??= createQueryClient())
}

const TRPCContext = React.createContext<
  | {
      trpc: TRPCOptionsProxy<AppRouter>
      trpcClient: TRPCClient<AppRouter>
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

  // eslint-disable-next-line @eslint-react/naming-convention/use-state
  const [trpcClient] = React.useState(() =>
    createTRPCClient<AppRouter>({
      links: [
        splitLink({
          condition: (op) => op.type === 'subscription',
          false: httpBatchStreamLink({
            transformer: SuperJSON,
            url: getBaseUrl() + '/api/trpc',
            headers() {
              const headers = new Headers()
              headers.set('x-trpc-source', '{{ app }}')
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
              headers.set('x-trpc-source', '{{ app }}')
              return { headers }
            },
          }),
        }),
      ],
    }),
  )

  const value = React.useMemo(
    () => ({
      trpc: createTRPCOptionsProxy<AppRouter>({
        client: trpcClient,
        queryClient,
      }),
      trpcClient,
      queryClient,
    }),
    [trpcClient, queryClient],
  )

  return (
    <QueryClientProvider client={queryClient}>
      <TRPCContext value={value}>{children}</TRPCContext>
    </QueryClientProvider>
  )
}

export { TRPCReactProvider, useTRPC }
