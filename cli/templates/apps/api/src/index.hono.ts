import type { Server } from '@/server'

import { hc } from 'hono/client'

export const { api } = hc<Server>(getApiUrl())

function getApiUrl() {
  if (process.env.NODE_ENV === 'production') {
    // return `https://your-production-api-domain.com`
    throw new Error('Production API URL is not set')
  }

  return `http://localhost:8080`
}
