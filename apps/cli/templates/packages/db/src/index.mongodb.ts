import mongoose from 'mongoose'

import * as collections from './collections'

type Collections = typeof collections
type DatabaseCollections = {
  [K in keyof Collections]: Collections[K]
}

const createMongoClient = (): DatabaseCollections => {
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
  db: DatabaseCollections | undefined
}
export const db = globalForMongo.db ?? createMongoClient()
if (process.env.NODE_ENV !== 'production') globalForMongo.db = db

export type * from './collections'
