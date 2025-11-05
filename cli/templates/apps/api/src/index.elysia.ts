import { treaty } from '@elysiajs/eden'

import { env } from '@{{ name }}/validators/env'

import type { Server } from '@/server'

export const { api } = treaty<Server>(getApiUrl())

function getApiUrl() {
  if (env.NEXT_PUBLIC_API_URL) return `https://${env.NEXT_PUBLIC_API_URL}`
  return `http://localhost:8080`
}
