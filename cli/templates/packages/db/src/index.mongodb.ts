import mongoose from 'mongoose'

import * as collections from './collections'

const createMongoClient = () => {
  mongoose
    .connect(process.env.DATABASE_URL ?? 'mongodb://localhost:27017/mydb')
    .then(() => {
      console.log('Connected to MongoDB')
    })
    .catch((err: unknown) => {
      console.error('Error connecting to MongoDB:', err)
      process.exit(1)
    })

  return collections
}
const globalForMongo = globalThis as unknown as {
  db: ReturnType<typeof createMongoClient> | undefined
}
export const db = globalForMongo.db ?? createMongoClient()
if (process.env.NODE_ENV !== 'production') globalForMongo.db = db

export type * from './collections'
