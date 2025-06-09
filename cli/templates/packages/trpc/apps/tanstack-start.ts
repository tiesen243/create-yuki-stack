import { createAPIFileRoute } from '@tanstack/react-start/api'

import { handlers } from '@{{ name }}/api'

export const APIRoute = createAPIFileRoute('/api/trpc/$trpc')({
  GET: ({ request }) => handlers(request),
  POST: ({ request }) => handlers(request),
  OPTIONS: ({ request }) => handlers(request),
})
