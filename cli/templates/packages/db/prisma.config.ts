import { defineConfig } from 'prisma/config'

import { env } from '@{{ name }}/validators/env'

export default defineConfig({
  datasource: { url: env.DATABASE_URL },
  schema: 'src/prisma/schema.prisma',
  migrations: { path: 'prisma/migrations' },
})
