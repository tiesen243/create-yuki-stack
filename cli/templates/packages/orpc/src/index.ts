import { RPCHandler } from '@orpc/server/fetch'
import {
  BatchHandlerPlugin,
  CORSPlugin,
  ResponseHeadersPlugin,
} from '@orpc/server/plugins'

import { createORPCContext } from './orpc'
import { appRouter } from './routers/_app'

/**
 * Handle incoming API requests
 */
const handlers = async (req: Request) => {
  const { matched, response } = await new RPCHandler(appRouter, {
    plugins: [
      new BatchHandlerPlugin(),
      new CORSPlugin(),
      new ResponseHeadersPlugin(),
    ],
  }).handle(req, {
    prefix: '/api/orpc',
    context: await createORPCContext({ headers: req.headers }),
  })

  if (!matched) return new Response('Not Found', { status: 404 })
  else return response
}

export type { AppRouter, RouterInputs, RouterOutputs } from './routers/_app'
export { appRouter, createORPCContext, handlers }
