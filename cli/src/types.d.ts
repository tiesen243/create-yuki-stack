interface PackageJson {
  name: string
  workspaces?: string[] | Record<string, Record<string, unknown>>
  exports: Record<string, unknown>
  scripts: Record<string, string>
  dependencies: Record<string, string>
  devDependencies: Record<string, string>
  peerDependencies: Record<string, string>
  packageManager: string
  engines: Record<string, string>
  [key: string]: unknown
}

interface ProjectConfig {
  name: string
  database: 'none' | 'prisma' | 'drizzle' | 'mongodb'
  adapter: 'none' | 'neon' | 'planetscale'
  api: 'none' | 'trpc' | 'orpc'
  auth: 'none' | 'lucia' | 'better-auth' | 'next-auth'
  backend: 'none' | 'express' | 'elysia' | 'hono'
  frontend: ('nextjs' | 'react-router' | 'tanstack-start' | 'expo')[]
  shadcn: boolean
  packageManager: 'npm' | 'yarn' | 'pnpm' | 'bun'
  install: boolean
  git: boolean
}
