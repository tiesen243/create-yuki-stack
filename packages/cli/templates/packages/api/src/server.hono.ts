import '@{{ name }}/env'

import { Hono } from 'hono'
import { cors } from 'hono/cors'

const server = new Hono()

server.use(
  cors({
    origin: [
      'http://localhost:3000',
      'http://localhost:3001',
      'http://localhost:3002',
    ],
    allowMethods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    credentials: true,
  }),
)

server.get('/api', (c) => c.json({ message: 'Hello from Hono!' }))

export default {
  port: 8080,
  fetch: server.fetch,
} as const
