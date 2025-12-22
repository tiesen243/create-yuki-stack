import { PrismaPg } from '@prisma/adapter-pg'
import { env } from '@{{ name }}/validators/env'

import { PrismaClient } from './generated/client'

const createPrismaClient = () => {
  const adapter = new PrismaPg({ connectionString: env.DATABASE_URL })
  return new PrismaClient({ adapter })
}
const globalForPrisma = globalThis as unknown as {
  db: PrismaClient | undefined
}
export const db = globalForPrisma.db ?? createPrismaClient()
if (env.NODE_ENV !== 'production') globalForPrisma.db = db

export * from './generated/models'
