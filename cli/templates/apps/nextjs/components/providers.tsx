'use client'

import type { QueryClient } from '@tanstack/react-query'

import { QueryClientProvider } from '@tanstack/react-query'
import { createQueryClient } from '@{{ name }}/lib/create-query-client'
import { ThemeProvider } from '@{{ name }}/ui'

let clientQueryClientSingleton: QueryClient | undefined = undefined
export const getQueryClient = () => {
  if (typeof window === 'undefined') return createQueryClient()
  else return (clientQueryClientSingleton ??= createQueryClient())
}

export function Providers({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const queryClient = getQueryClient()

  return (
    <ThemeProvider attribute='class' disableTransitionOnChange enableSystem>
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    </ThemeProvider>
  )
}
