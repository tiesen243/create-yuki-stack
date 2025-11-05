import { hc } from 'hono/client'

import { env } from '@{{ name }}/validators/env'

import type { Server } from '@/server'

export const { api } = hc<Server>(getApiUrl())

function getApiUrl() {
  if (env.NEXT_PUBLIC_API_URL) return `https://${env.NEXT_PUBLIC_API_URL}`
  return `http://localhost:8080`
}
