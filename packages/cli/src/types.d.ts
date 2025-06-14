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
  adapter: 'none' | 'neon'
  api: 'none' | 'trpc' | 'orpc'
  auth: 'none' | 'basic-auth' | 'better-auth' | 'next-auth'
  backend: 'none' | 'express' | 'elysia' | 'hono'
  frontend: ('nextjs' | 'react-router' | 'tanstack-start' | 'expo')[]
  shadcn: boolean
  packageManager: 'npm' | 'yarn' | 'pnpm' | 'bun'
  install: boolean
  git: boolean
}
