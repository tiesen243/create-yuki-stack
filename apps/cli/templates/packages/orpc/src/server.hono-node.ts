import '@{{ name }}/env'

import { serve } from '@hono/node-server'
import { RPCHandler } from '@orpc/server/fetch'
import { BatchHandlerPlugin, ResponseHeadersPlugin } from '@orpc/server/plugins'
import { Hono } from 'hono'
import { cors } from 'hono/cors'
import { logger } from 'hono/logger'

import { appRouter } from './routers/_app'
import { createORPCContext } from './orpc'

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
  '/api/orpc/*',
  async (c, next) => {
    const { matched, response } = await new RPCHandler(appRouter, {
      plugins: [
        new BatchHandlerPlugin(),
        new ResponseHeadersPlugin(),
      ],
    }).handle(c.req.raw, {
      prefix: '/api/orpc',
      context: await createORPCContext(c.req.raw),
    })

    if (matched) return c.newResponse(response.body, response)
    else await next()
  }
)

serve({
  port: 8080,
  fetch: server.fetch,
})
