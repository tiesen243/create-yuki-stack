import { handlers } from '@yuki/auth'

import type { Route } from './+types/api.auth.$'

const { GET, POST } = handlers

export const loader = ({ request }: Route.LoaderArgs) => GET(request)
export const action = ({ request }: Route.ActionArgs) => POST(request)
