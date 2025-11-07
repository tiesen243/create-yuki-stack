import '@{{ name }}/validators/env'

import type { Config } from '@react-router/dev/config'

export default {
  appDirectory: 'src',
  // Server-side render by default, to enable SPA mode set this to `false`
  ssr: true,
} satisfies Config
