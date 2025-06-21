import { defineConfig } from 'drizzle-kit'

export default defineConfig({
  dialect: 'postgresql',
  dbCredentials: { url: process.env.DATABASE_URL ?? '' },
  schema: './src/schema.ts',
  casing: 'snake_case',
  strict: true,
})
