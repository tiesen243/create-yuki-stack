import { createServerFileRoute } from '@tanstack/react-start/server'

import { handlers } from '@{{ name }}/api'

export const ServerRoute: unknown = createServerFileRoute(
  '/api/trpc/$',
).methods({
  GET: ({ request }) => handlers(request),
  POST: ({ request }) => handlers(request),
  OPTIONS: ({ request }) => handlers(request),
})

