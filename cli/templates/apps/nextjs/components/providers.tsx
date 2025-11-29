'use client'

import type { QueryClient } from '@tanstack/react-query'
import { QueryClientProvider } from '@tanstack/react-query'

import { ThemeProvider } from '@{{ name }}/ui'

import { createQueryClient } from '@{{ name }}/lib/create-query-client'

let clientQueryClientSingleton: QueryClient | undefined = undefined
const getQueryClient = () => {
  if (typeof window === 'undefined') return createQueryClient()
  else return (clientQueryClientSingleton ??= createQueryClient())
}

export function Providers({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const queryClient = getQueryClient()

  return (
    <ThemeProvider attribute='class' disableTransitionOnChange enableSystem>
      <QueryClientProvider client={queryClient}>
        {children}
      </QueryClientProvider>
    </ThemeProvider>
  )
}
