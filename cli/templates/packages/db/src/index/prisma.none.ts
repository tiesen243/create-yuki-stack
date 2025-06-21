import { PrismaClient } from './generated/prisma/client'

const createPrismaClient = () => new PrismaClient()
const globalForPrisma = globalThis as unknown as {
  db: PrismaClient | undefined
}
export const db = globalForPrisma.db ?? createPrismaClient()
if (process.env.NODE_ENV !== 'production') globalForPrisma.db = db
