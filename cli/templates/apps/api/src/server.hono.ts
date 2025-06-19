import '@{{ name }}/validators/env'

import { Hono } from 'hono'
import { cors } from 'hono/cors'
import { logger } from 'hono/logger'
import { trimTrailingSlash } from 'hono/trailing-slash'

const PORT = parseInt(process.env.PORT ?? '8080', 10)

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
  .use(logger())
  .use(trimTrailingSlash())
  .get('/api/health', (c) =>
    c.json({
      message: 'OK',
    }),
  )

export default {
  fetch: server.fetch,
  port: PORT,
} as const
