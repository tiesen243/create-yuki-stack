import type { QueryClient } from '@tanstack/react-query'
import * as React from 'react'
import { QueryClientProvider } from '@tanstack/react-query'
import { createTRPCClient, httpBatchStreamLink } from '@trpc/client'
import { createTRPCContext } from '@trpc/tanstack-react-query'
import SuperJSON from 'superjson'

import type { AppRouter } from '@{{ name }}/api'

import { getQueryClient } from '@/components/providers'
import { getBaseUrl } from '@/lib/utils'

const { TRPCProvider, useTRPC, useTRPCClient } = createTRPCContext<AppRouter>()

function TRPCReactProvider({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const queryClient = getQueryClient()

  // eslint-disable-next-line @eslint-react/naming-convention/use-state
  const [trpcClient] = React.useState(() =>
    createTRPCClient<AppRouter>({
      links: [
         httpBatchStreamLink({
          transformer: SuperJSON,
          url: getBaseUrl() + '/api/trpc',
          headers() {
            const headers = new Headers()
            headers.set('x-trpc-source', '{{ app }}')
            return headers
          },
        }),
      ],
    }),
  )

  return (
    <TRPCProvider queryClient={queryClient} trpcClient={trpcClient}>
      {children}
    </TRPCProvider>
  )
}

export { TRPCReactProvider, useTRPC, useTRPCClient }
