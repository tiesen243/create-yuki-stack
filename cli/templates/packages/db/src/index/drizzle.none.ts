import { drizzle } from 'drizzle-orm/postgres-js'
import postgres from 'postgres'

import { env } from '@{{ name }}/validators/env'

const createDrizzleClient = () => {
  const conn = postgres(env.DATABASE_URL)
  return drizzle(conn, { casing: 'snake_case' })
}
const globalForDrizzle = globalThis as unknown as {
  db: ReturnType<typeof createDrizzleClient> | undefined
}
export const db = globalForDrizzle.db ?? createDrizzleClient()
if (env.NODE_ENV !== 'production') globalForDrizzle.db = db

export * from 'drizzle-orm'
