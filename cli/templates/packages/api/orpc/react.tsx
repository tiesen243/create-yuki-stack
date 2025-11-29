import * as React from 'react'
import type { RouterUtils } from '@orpc/tanstack-query'
import { createORPCClient } from '@orpc/client'
import { RPCLink } from '@orpc/client/fetch'
import { BatchLinkPlugin, DedupeRequestsPlugin } from '@orpc/client/plugins'
import { createTanstackQueryUtils } from '@orpc/tanstack-query'

import type { AppRouter } from '@{{ name }}/api'

import { getBaseUrl } from '@/lib/utils'

const ORPCContext = React.createContext<RouterUtils<AppRouter> | undefined>(
  undefined,
)

const useORPC = () => {
  const context = React.use(ORPCContext)
  if (!context) throw new Error('useORPC must be used within an ORPCProvider')
  return context
}

function ORPCReactProvider({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  // eslint-disable-next-line @eslint-react/naming-convention/use-state
  const [orpcClient] = React.useState(() => {
    const link = new RPCLink({
      url: getBaseUrl() + '/api/orpc',
      headers: { 'x-orpc-source': 'react-nextjs' },
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
    () => createORPCReactQueryUtils<AppRouter>(orpcClient),
    [orpcClient],
  )

  return <ORPCContext value={value}>{children}</ORPCContext>
}

export { useORPC, ORPCReactProvider }
