import { hc } from 'hono/client'

import { env as nextEnv } from '@{{ name }}/validators/env.next'
import { env as viteEnv } from '@{{ name }}/validators/env.vite'

import type { Server } from '@/server'

export const { api } = hc<Server>(getApiUrl())

function getApiUrl() {
  if (nextEnv.NEXT_PUBLIC_API_URL) return `https://${nextEnv.NEXT_PUBLIC_API_URL}`
  if (viteEnv.VITE_API_URL) return `https://${viteEnv.VITE_API_URL}`
  return `http://localhost:8080`
}
