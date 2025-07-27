export interface Options {
  turbo: boolean
  name: string
  db: 'drizzle' | 'prisma' | 'mongoose'
  dbInstance: string
}
