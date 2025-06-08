import { PrismaClient } from './generated/prisma'

const createPrismaClient = () => new PrismaClient()
const globalForPrisma = globalThis as unknown as {
  db: ReturnType<typeof createPrismaClient> | undefined
}
export const db = globalForPrisma.db ?? createPrismaClient()
if (process.env.NODE_ENV !== 'production') globalForPrisma.db = db

export * from './generated/prisma'

