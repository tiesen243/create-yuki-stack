import '@{{ name }}/env'

import cors from '@elysiajs/cors'
import { node } from '@elysiajs/node'
import { RPCHandler } from '@orpc/server/fetch'
import { BatchHandlerPlugin, ResponseHeadersPlugin } from '@orpc/server/plugins'
import Elysia from 'elysia'

import { appRouter } from './routers/_app'
import { createORPCContext } from './orpc'

const server = new Elysia({ adapter: node(), prefix: '/api' })
  .use(cors())
  .get('/', () => ({ message: 'Hello from Elysia!' }))
  .all('/orpc/*', async ({ request }) => {
    const { matched, response } = await new RPCHandler(appRouter, {
      plugins: [
        new BatchHandlerPlugin(),
        new ResponseHeadersPlugin(),
      ],
    }).handle(request, {
      prefix: '/api/orpc',
      context: await createORPCContext(request),
    })

    if (matched) return response 
    else return new Response('Not Found', { status: 404 })
  })

server.listen(8080, () => {
  console.log('Server is running on http://localhost:8080')
})
