import { defineConfig } from 'drizzle-kit'

import { env } from '@{{ name }}/validators/env'

export default defineConfig({
  dialect: 'postgresql',
  dbCredentials: { url: env.DATABASE_URL },
  schema: './src/schema.ts',
  casing: 'snake_case',
  strict: true,
})
