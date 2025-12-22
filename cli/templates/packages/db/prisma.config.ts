import { env } from '@{{ name }}/validators/env'
import { defineConfig } from 'prisma/config'

export default defineConfig({
  datasource: { url: env.DATABASE_URL },
  schema: 'prisma/schema.prisma',
  migrations: { path: 'prisma/migrations' },
})
