import '@{{ name }}/validators/env'

import cors from '@elysiajs/cors'
import Elysia from 'elysia'

const PORT = process.env.PORT ?? 8080

const server = new Elysia({ aot: true, prefix: '/api' })
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
  .get('/health', () => ({
    message: 'OK',
  }))

server.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`)
})

export type Server = typeof server
