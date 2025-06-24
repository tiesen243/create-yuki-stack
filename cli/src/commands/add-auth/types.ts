export interface Options {
  turbo: boolean
  db: 'drizzle' | 'prisma' | 'mongoose'
  dbInstance: string
}
