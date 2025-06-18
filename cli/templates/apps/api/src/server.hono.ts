import '@{{ name }}/validators/env'

import { Hono } from 'hono'
import { cors } from 'hono/cors'

const PORT = process.env.PORT ?? 8080

const server = new Hono()
  .use(
    cors({
      origin: [
        'http://localhost:3000',
        'http://localhost:3001',
        'http://localhost:3002',
      ],
      credentials: true,
    }),
  )
  .get('/api/health', (c) =>
    c.json({
      message: 'OK',
    }),
  )

export default {
  fetch: server.fetch,
  port: PORT,
} as const
