import '@{{ name }}/env'

import cors from '@elysiajs/cors'
import { node } from '@elysiajs/node'
import { fetchRequestHandler } from '@trpc/server/adapters/fetch'
import Elysia from 'elysia'

import { appRouter } from './routers/_app'
import { createTRPCContext } from './trpc'

const server = new Elysia({ adapter: node(), prefix: '/api' })
  .use(cors())
  .get('/', () => 'Hello from Elysia!')
  .all('/trpc/*', async ({ request }) => {
    let response: Response

    if (request.method === 'OPTIONS')
      response = new Response(null, { status: 204 })
    else
      response = await fetchRequestHandler({
        endpoint: '/api/trpc',
        router: appRouter,
        req: request,
        createContext: () => createTRPCContext(request),
        onError({ error, path }) {
          console.error(`>>> tRPC Error on '${path}'`, error)
        },
      })

    return response
  })

server.listen(8080, () => {
  console.log('Server is running on http://localhost:8080')
})

