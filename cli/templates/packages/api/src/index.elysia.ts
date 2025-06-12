import { treaty } from '@elysiajs/eden'

import { env } from '@{{ name }}/env'

import type { Server } from './server'

export const { api } = treaty<Server>(
  env.NEXT_PUBLIC_API_URL ?? 'http://localhost:8080',
  { fetch: { credentials: 'include' } },
)
