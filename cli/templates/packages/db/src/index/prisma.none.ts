import { PrismaClient } from './generated/client'

import { env } from '@{{ name }}/validators/env'

const createPrismaClient = () => new PrismaClient()
const globalForPrisma = globalThis as unknown as {
  db: PrismaClient | undefined
}
export const db = globalForPrisma.db ?? createPrismaClient()
if (env.NODE_ENV !== 'production') globalForPrisma.db = db

export * from './generated/models'
