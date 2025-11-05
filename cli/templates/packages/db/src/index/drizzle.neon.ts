import { Pool } from '@neondatabase/serverless'
import { drizzle } from 'drizzle-orm/neon-serverless'

import { env } from '@{{ name }}/validators/env'

const createDrizzleClient = () => {
  const client = new Pool({ connectionString: env.DATABASE_URL })
  return drizzle({ client, casing: 'snake_case' })
}
const globalForDrizzle = globalThis as unknown as {
  db: ReturnType<typeof createDrizzleClient> | undefined
}
export const db = globalForDrizzle.db ?? createDrizzleClient()
if (env.NODE_ENV !== 'production') globalForDrizzle.db = db

export * from 'drizzle-orm'
