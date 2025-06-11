'use client'

import type { QueryClient } from '@tanstack/react-query'
import * as React from 'react'
import { createORPCClient } from '@orpc/client'
import { RPCLink } from '@orpc/client/fetch'
import { createTanstackQueryUtils } from '@orpc/tanstack-query'
import { QueryClientProvider } from '@tanstack/react-query'

import { env } from '@{{ name }}/env'

import type { AppRouter } from '../routers/_app'
import { createQueryClient } from './query-client'

let clientQueryClientSingleton: QueryClient | undefined = undefined
const getQueryClient = () => {
  if (typeof window === 'undefined') return createQueryClient()
  else return (clientQueryClientSingleton ??= createQueryClient())
}

const ORPCContext = React.createContext<
  | {
      orpc: ReturnType<typeof createTanstackQueryUtils<AppRouter>>
      orpcClient: ReturnType<typeof createORPCClient<AppRouter>>
      queryClient: QueryClient
    }
  | undefined
>(undefined)

const useORPC = () => {
  const context = React.useContext(ORPCContext)
  if (!context) throw new Error('useORPC must be used within an ORPCProvider')
  return context
}

function ORPCReactProvider({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const queryClient = getQueryClient()

  const [orpcClient] = React.useState(() => {
    const link = new RPCLink({
      url: getBaseUrl() + '/api/orpc',
      headers: { 'x-orpc-source': 'react' },
    })
    return createORPCClient<AppRouter>(link)
  })

  const [orpc] = React.useState(() =>
    createTanstackQueryUtils<AppRouter>(orpcClient),
  )

  return (
    <QueryClientProvider client={queryClient}>
      <ORPCContext.Provider value={{ orpc, orpcClient, queryClient }}>
        {children}
      </ORPCContext.Provider>
    </QueryClientProvider>
  )
}

export { useORPC, ORPCReactProvider }
export * from '@tanstack/react-query'

function getBaseUrl() {
  if (typeof window !== 'undefined') return window.location.origin
  if (env.VERCEL_PROJECT_PRODUCTION_URL)
    return `https://${env.VERCEL_PROJECT_PRODUCTION_URL}`
  if (env.VERCEL_URL) return `https://${env.VERCEL_URL}`

  return `http://localhost:${process.env.PORT ?? {{ port }}}`
}
