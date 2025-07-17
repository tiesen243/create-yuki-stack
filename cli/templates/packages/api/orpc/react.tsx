import type { QueryClient } from '@tanstack/react-query'
import * as React from 'react'
import { createORPCClient } from '@orpc/client'
import { RPCLink } from '@orpc/client/fetch'
import { BatchLinkPlugin, DedupeRequestsPlugin } from '@orpc/client/plugins'
import { createTanstackQueryUtils } from '@orpc/tanstack-query'
import { QueryClientProvider } from '@tanstack/react-query'

import type { AppRouter } from '@{{ name }}/api'

import { getBaseUrl } from '@/lib/utils'
import { createQueryClient } from '@/orpc/query-client'

let clientQueryClientSingleton: QueryClient | undefined = undefined
const getQueryClient = () => {
  if (typeof window === 'undefined') return createQueryClient()
  else return (clientQueryClientSingleton ??= createQueryClient())
}

const ORPCContext = React.createContext<
  | {
      orpc: ReturnType<typeof createTanstackQueryUtils<AppRouter>>
      queryClient: QueryClient
    }
  | undefined
>(undefined)

const useORPC = () => {
  const context = React.use(ORPCContext)
  if (!context) throw new Error('useORPC must be used within an ORPCProvider')
  return context
}

function ORPCReactProvider({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const queryClient = getQueryClient()

  // eslint-disable-next-line @eslint-react/naming-convention/use-state
  const [orpcClient] = React.useState(() => {
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
    return createORPCClient<AppRouter>(link)
  })

  const value = React.useMemo(
    () => ({
      orpc: createTanstackQueryUtils<AppRouter>(orpcClient),
      queryClient,
    }),
    [orpcClient, queryClient],
  )

  return (
    <QueryClientProvider client={queryClient}>
      <ORPCContext value={value}>{children}</ORPCContext>
    </QueryClientProvider>
  )
}

export { useORPC, ORPCReactProvider }
