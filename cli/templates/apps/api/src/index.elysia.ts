import { treaty } from '@elysiajs/eden'

import type { Server } from '@/server'

export const { api } = treaty<Server>(getApiUrl())

function getApiUrl() {
  if (process.env.NODE_ENV === 'production') {
    // return `https://your-production-api-domain.com`
    throw new Error('Production API URL is not set')
  }

  return `http://localhost:8080`
}
