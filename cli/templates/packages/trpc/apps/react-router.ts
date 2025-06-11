import { handlers } from '@{{ name }}/api'

import type { Route } from './+types/api.trpc.$'

export const loader = async ({ request }: Route.LoaderArgs) => handlers(request)
export const action = async ({ request }: Route.ActionArgs) => handlers(request)
