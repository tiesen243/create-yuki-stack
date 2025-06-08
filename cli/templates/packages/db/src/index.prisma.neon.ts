import { PrismaNeon } from '@prisma/adapter-neon'

import { PrismaClient } from './generated/prisma'

const createPrismaClient = () => {
  const adapter = new PrismaNeon({ connectionString: process.env.DATABASE_URL })
  return new PrismaClient({ adapter })
}
const globalForPrisma = globalThis as unknown as {
  db: ReturnType<typeof createPrismaClient> | undefined
}
export const db = globalForPrisma.db ?? createPrismaClient()
if (process.env.NODE_ENV !== 'production') globalForPrisma.db = db

export * from './generated/prisma'

