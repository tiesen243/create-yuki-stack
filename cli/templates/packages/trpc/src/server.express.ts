import '@{{ name }}/env'

import * as expressAdapter from '@trpc/server/adapters/express'
import cors from 'cors'
import express from 'express'

import { appRouter } from './routers/_app'
import { createTRPCContext } from './trpc'

const server = express()

server.use(express.json())
server.use(express.urlencoded({ extended: true }))
server.use(
  cors({
    origin: [
      'http://localhost:3000',
      'http://localhost:3001',
      'http://localhost:3002',
    ],
    methods: ['GET', 'POST', 'OPTIONS'],
    credentials: true,
  }),
)

server.get('/api', (_, res) => {
  res.send('Hello from Express!')
})

server.use(
  '/api/trpc',
  expressAdapter.createExpressMiddleware({
    router: appRouter,
    createContext: ({ req }) =>
      createTRPCContext({
        headers: new Headers(req.headers as Record<string, string>),
      }),
    onError({ error, path }) {
      console.error(`>>> tRPC Error on '${path}'`, error)
    },
  }),
)

server.listen(8080, () => {
  console.log('Server is running on http://localhost:8080')
})
