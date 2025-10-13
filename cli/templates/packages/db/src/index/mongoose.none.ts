import mongoose from 'mongoose'

import { env } from '@{{ name }}/validators/env'

import * as schema from './schema'

type Schema = typeof schema
type DatabaseSchema = {
  [K in keyof Schema]: Schema[K]
}

const createMongoClient = (): DatabaseSchema => {
  mongoose
    .connect(env.DATABASE_URL, {
      serverApi: { version: '1', strict: true, deprecationErrors: true },
    })
    .catch((err: unknown) => {
      console.error('Failed to connect to MongoDB:', err)
    })

  return schema
}
const globalForMongo = globalThis as unknown as {
  db: DatabaseSchema | undefined
}
export const db = globalForMongo.db ?? createMongoClient()
if (env.NODE_ENV !== 'production') globalForMongo.db = db
