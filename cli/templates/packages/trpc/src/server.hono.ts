import '@{{ name }}/env'

import { fetchRequestHandler } from '@trpc/server/adapters/fetch'
import { Hono } from 'hono'
import { cors } from 'hono/cors'

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

server.get('/api', (c) => c.json({ message: 'Hello from Hono!' }))

server.use('/api/trpc/*', async (c) => {
  const response = await fetchRequestHandler({
    endpoint: '/api/trpc',
    router: appRouter,
    req: c.req.raw,
    createContext: () => createTRPCContext(c.req.raw),
    onError({ error, path }) {
      console.error(`>>> tRPC Error on '${path}'`, error)
    },
  })

  return c.newResponse(response.body, response)
})

export default {
  port: 8080,
  fetch: server.fetch,
} as const
