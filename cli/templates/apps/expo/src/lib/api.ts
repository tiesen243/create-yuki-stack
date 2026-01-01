import type { QueryClient } from '@tanstack/react-query'

import { createQueryClient } from '@{{ name }}/lib/create-query-client'

let clientQueryClientSingleton: QueryClient | undefined
const getQueryClient = () => {
  if (typeof window === 'undefined') return createQueryClient()
  return (clientQueryClientSingleton ??= createQueryClient())
}

const queryClient = getQueryClient()

export { queryClient }
