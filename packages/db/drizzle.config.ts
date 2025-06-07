import type { Config } from 'drizzle-kit'

import { env } from '@yuki/env'

/**
 * Creates a non-pooling database URL for migrations.
 * When using Neon Postgres, there are two connection URLs:
 * - Pooling URL (with "-pooler"): Used for normal application connections
 * - Non-pooling URL (without "-pooler"): Required for database migrations
 * This variable transforms the pooling URL to a non-pooling one by removing "-pooler".
 */
const nonPoolingUrl = env.DATABASE_URL.replace('-pooler', '')

export default {
  schema: './src/schema.ts',
  out: './migrations',

  dialect: 'postgresql',
  dbCredentials: { url: nonPoolingUrl },
  casing: 'snake_case',
} satisfies Config
