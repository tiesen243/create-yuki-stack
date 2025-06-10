import { fetchRequestHandler } from '@trpc/server/adapters/fetch'

import { appRouter } from './routers/_app'
import { createTRPCContext } from './trpc'

/**
 * Handle incoming API requests
 */
const handlers = async (request: Request) => {
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

  /**
   * Configure basic CORS headers
   * You should extend this to match your needs
   */
  response.headers.set('Access-Control-Allow-Origin', '*')
  response.headers.set('Access-Control-Request-Method', '*')
  response.headers.set('Access-Control-Allow-Methods', 'OPTIONS, GET, POST')
  response.headers.set('Access-Control-Allow-Headers', '*')
  return response
}

export type { AppRouter, RouterInputs, RouterOutputs } from './routers/_app'
export { appRouter, createTRPCContext, handlers }
