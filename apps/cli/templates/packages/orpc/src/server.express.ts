import '@{{ name }}/env'

import { RPCHandler } from '@orpc/server/node'
import { BatchHandlerPlugin, ResponseHeadersPlugin } from '@orpc/server/plugins'
import cors from 'cors'
import express from 'express'

import { appRouter } from './routers/_app'
import { createORPCContext } from './orpc'

const server = express()

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

server.use('/api/orpc', async (req, res, next) => {
  const { matched } = await new RPCHandler(appRouter, {
    plugins: [new BatchHandlerPlugin(), new ResponseHeadersPlugin()],
  }).handle(req, res, {
    prefix: '/api/orpc',
    context: await createORPCContext({
      headers: new Headers(req.headers as Record<string, string>),
    }),
  })

  if (matched) return
  else next()
})

server.use(express.json())

server.get('/api', (_, res) => {
  res.json({ message: 'Hello from Express!' })
})

server.listen(8080, () => {
  console.log('Server is running on http://localhost:8080')
})
