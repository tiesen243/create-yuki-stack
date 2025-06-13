import mongoose from 'mongoose'

import * as collections from './collections'

const createMongoClient = () => {
  mongoose
    .connect(process.env.DATABASE_URL ?? '', {
      serverApi: { version: '1', strict: true, deprecationErrors: true },
    })
    .catch((err: unknown) => {
      console.error('Failed to connect to MongoDB:', err)
    })

  return collections
}
const globalForMongo = globalThis as unknown as {
  db: ReturnType<typeof createMongoClient> | undefined
}
export const db = globalForMongo.db ?? createMongoClient()
if (process.env.NODE_ENV !== 'production') globalForMongo.db = db

export type * from './collections'
