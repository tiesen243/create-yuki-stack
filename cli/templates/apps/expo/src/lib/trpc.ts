import type { QueryClient } from '@tanstack/react-query'
import type { AppRouter } from '@{{ name }}/api'

import { createTRPCClient, httpBatchLink } from '@trpc/client'
import { createTRPCOptionsProxy } from '@trpc/tanstack-react-query'
import { createQueryClient } from '@{{ name }}/lib/create-query-client'
import SuperJSON from 'superjson'

import { getSessionToken } from '@/lib/secure-store'
import { getBaseUrl } from '@/lib/utils'

let clientQueryClientSingleton: QueryClient | undefined
const getQueryClient = () => {
  if (typeof window === 'undefined') return createQueryClient()
  return (clientQueryClientSingleton ??= createQueryClient())
}

const queryClient = getQueryClient()

const trpcClient = createTRPCClient<AppRouter>({
  links: [
    httpBatchLink({
      transformer: SuperJSON,
      url: getBaseUrl() + '/api/trpc',
      headers() {
        const headers = new Map<string, string>([
          ['x-trpc-source', '{{ app }}'],
        ])

        const token = getSessionToken()
        if (token) headers.set('Authorization', `Bearer ${token}`)

        return headers
      },
    }),
  ],
})

const trpc = createTRPCOptionsProxy<AppRouter>({
  client: trpcClient,
  queryClient,
})

export { trpc, trpcClient, queryClient }
