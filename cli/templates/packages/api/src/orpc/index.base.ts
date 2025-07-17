import { createRouterClient } from '@orpc/server'
import { RPCHandler } from '@orpc/server/fetch'
import {
  BatchHandlerPlugin,
  CORSPlugin,
  ResponseHeadersPlugin,
} from '@orpc/server/plugins'

import { createORPCContext } from './orpc'
import { appRouter } from './routers/_app'

const handler = async (request: Request) => {
  const handler = new RPCHandler(appRouter, {
    plugins: [
      new BatchHandlerPlugin(),
      new CORSPlugin(),
      new ResponseHeadersPlugin(),
    ],
  })

  const { matched, response } = await handler.handle(request, {
    prefix: '/api/orpc',
    context: await createORPCContext(request),
  })

  if (!matched) return new Response('Not Found', { status: 404 })
  return response
}

export type { AppRouter, RouterInputs, RouterOutputs } from './routers/_app'
export { appRouter, createORPCContext, createRouterClient, handler }
