import { defaultShouldDehydrateQuery, QueryClient } from '@tanstack/react-query'
import { createTRPCClient, httpBatchLink, loggerLink } from '@trpc/client'
import { createTRPCOptionsProxy } from '@trpc/tanstack-react-query'
import SuperJSON from 'superjson'

import type { AppRouter } from '@yuki/api'

import { getToken } from '@/lib/session'
import { getBaseUrl } from '@/lib/utils'

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      // With SSR, we usually want to set some default staleTime
      // above 0 to avoid refetching immediately on the client
      staleTime: 60 * 1000,
    },
    dehydrate: {
      serializeData: SuperJSON.serialize,
      shouldDehydrateQuery: (query) =>
        defaultShouldDehydrateQuery(query) || query.state.status === 'pending',
    },
    hydrate: {
      deserializeData: SuperJSON.deserialize,
    },
  },
})

const trpcClient = createTRPCClient<AppRouter>({
  links: [
    loggerLink({
      enabled: (op) =>
        process.env.NODE_ENV === 'development' ||
        (op.direction === 'down' && op.result instanceof Error),
      colorMode: 'ansi',
    }),
    httpBatchLink({
      transformer: SuperJSON,
      url: getBaseUrl() + '/api/trpc',
      headers() {
        const headers = new Map<string, string>()
        headers.set('x-trpc-source', 'react-native')

        const token = getToken()
        headers.set('Authorization', `Bearer ${token}`)

        return Object.fromEntries(headers)
      },
    }),
  ],
})

const trpc = createTRPCOptionsProxy<AppRouter>({
  client: trpcClient,
  queryClient,
})

export { trpc, trpcClient, queryClient }
