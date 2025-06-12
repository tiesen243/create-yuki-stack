import '@{{ name }}/env'

import cors from '@elysiajs/cors'
import Elysia from 'elysia'

const server = new Elysia({ prefix: '/api' })
  .use(
    cors({
      origin: [
        'http://localhost:3000',
        'http://localhost:3001',
        'http://localhost:3002',
      ],
      methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
      credentials: true,
    }),
  )
  .get('/', () => ({ message: 'Hello from Elysia!' }))
  .compile()

server.listen(8080, () => {
  console.log('Server is running on http://localhost:8080')
})

export type Server = typeof server
