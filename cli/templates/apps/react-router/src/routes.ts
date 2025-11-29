import type { RouteConfig } from '@react-router/dev/routes'
import { index, prefix, route } from '@react-router/dev/routes'

export default [
  ...prefix('/api', [

  ]),

  index('./routes/_index.tsx'),
] satisfies RouteConfig
