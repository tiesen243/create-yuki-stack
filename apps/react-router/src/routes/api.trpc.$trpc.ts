import { handlers } from '@yuki/api'

import type { Route } from './+types/api.trpc.$trpc'

export const loader = ({ request }: Route.LoaderArgs) => handlers(request)
export const action = ({ request }: Route.ActionArgs) => handlers(request)
