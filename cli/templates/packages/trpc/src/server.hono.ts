import '@{{ name }}/env'

import { trpcServer } from '@hono/trpc-server'
import { Hono } from 'hono'
import { cors } from 'hono/cors'
import { logger } from 'hono/logger'

import { appRouter } from './routers/_app'
import { createTRPCContext } from './trpc'

const server = new Hono()

server.use(
  cors({
    origin: [
      'http://localhost:3000',
      'http://localhost:3001',
      'http://localhost:3002',
    ],
    allowMethods: ['GET', 'POST', 'OPTIONS'],
    credentials: true,
  }),
)

server.use(logger())

server.get('/api', (c) => c.json({ message: 'Hello from Hono!' }))

server.use(
  '/api/trpc/*',
  trpcServer({
    endpoint: '/api/trpc',
    router: appRouter,
    createContext: ({ req }) => createTRPCContext(req),
    onError({ error, path }) {
      console.error(`>>> tRPC Error on '${path}'`, error)
    },
  }),
)

export default {
  port: 8080,
  fetch: server.fetch,
} as const
