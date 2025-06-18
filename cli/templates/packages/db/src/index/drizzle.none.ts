import { drizzle } from 'drizzle-orm/postgres-js'
import postgres from 'postgres'

import * as schema from './schema'

const createDrizzleClient = () => {
  const conn = postgres(process.env.DATABASE_URL ?? '')
  return drizzle(conn, { schema, casing: 'snake_case' })
}
const globalForDrizzle = globalThis as unknown as {
  db: ReturnType<typeof createDrizzleClient> | undefined
}
export const db = globalForDrizzle.db ?? createDrizzleClient()
if (process.env.NODE_ENV !== 'production') globalForDrizzle.db = db

export * from 'drizzle-orm'
