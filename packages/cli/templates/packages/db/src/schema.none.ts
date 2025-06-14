import { pgTable } from 'drizzle-orm/pg-core'

export const posts = pgTable('post', (t) => ({
  id: t.uuid().defaultRandom().primaryKey(),
  title: t.varchar({ length: 255 }).notNull(),
  content: t.varchar({ length: 1000 }).notNull(),
  createdAt: t.timestamp({ mode: 'date' }).notNull().defaultNow(),
  updatedAt: t
    .timestamp({ mode: 'date' })
    .notNull()
    .defaultNow()
    .$onUpdateFn(() => new Date()),
}))
