import type { QueryClient } from '@tanstack/react-query'
import type { AppRouter } from '@{{ name }}/api'

import { createORPCClient } from '@orpc/client'
import { RPCLink } from '@orpc/client/fetch'
import { BatchLinkPlugin, DedupeRequestsPlugin } from '@orpc/client/plugins'
import { createTanstackQueryUtils } from '@orpc/tanstack-query'
import { createQueryClient } from '@{{ name }}/lib/create-query-client'

import { getBaseUrl } from '@/lib/utils'

let clientQueryClientSingleton: QueryClient | undefined
const getQueryClient = () => {
  if (typeof window === 'undefined') return createQueryClient()
  return (clientQueryClientSingleton ??= createQueryClient())
}

const queryClient = getQueryClient()

const link = new RPCLink({
  url: getBaseUrl() + '/api/orpc',
  headers: { 'x-orpc-source': '{{ app }}' },
  plugins: [
    new BatchLinkPlugin({
      groups: [{ condition: () => true, context: {} }],
    }),
    new DedupeRequestsPlugin({
      filter: ({ request }) => request.method === 'GET',
      groups: [{ condition: () => true, context: {} }],
    }),
  ],
})

const orpcClient = createORPCClient<AppRouter>(link)

const orpc = createTanstackQueryUtils<AppRouter>(orpcClient)

export { orpc, orpcClient, queryClient }
