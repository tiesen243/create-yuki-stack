import type { PageContextValue } from '@/app/builder/_components/context'

export const nextjsPresets = {
  name: 'Next.js Fullstack',
  description:
    'Complete Next.js application with tRPC, Prisma, and authentication',
  options: {
    name: 'my-nextjs-app',
    frontend: ['nextjs'],
    database: 'prisma',
    databaseAdapter: 'neon',
    backend: 'none',
    api: 'trpc',
    auth: 'next-auth',
    extras: ['gh-actions', 'email'],
    packageManager: 'npm',
    javaBuildTool: 'gradle',
    install: true,
    git: true,
  },
} satisfies {
  name: string
  description: string
  options: PageContextValue['options']
}

export const reactSpaPresets = {
  name: 'React SPA',
  description: 'Simple React single-page application with client-side routing',
  options: {
    name: 'my-react-app',
    frontend: ['react-router'],
    database: 'none',
    databaseAdapter: 'none',
    backend: 'none',
    api: 'none',
    auth: 'none',
    extras: [],
    packageManager: 'npm',
    javaBuildTool: 'gradle',
    install: true,
    git: true,
  },
} satisfies {
  name: string
  description: string
  options: PageContextValue['options']
}

export const expressReactPresets = {
  name: 'Express + React',
  description: 'Full-stack application with Express backend and React frontend',
  options: {
    name: 'my-express-app',
    frontend: ['react-router'],
    database: 'prisma',
    databaseAdapter: 'neon',
    backend: 'express',
    api: 'none',
    auth: 'basic-auth',
    extras: ['gh-actions'],
    packageManager: 'npm',
    javaBuildTool: 'gradle',
    install: true,
    git: true,
  },
} satisfies {
  name: string
  description: string
  options: PageContextValue['options']
}

export const modernStackPresets = {
  name: 'Modern Stack',
  description: 'Cutting-edge stack with TanStack Start, Hono, and Drizzle',
  options: {
    name: 'my-modern-app',
    frontend: ['tanstack-start'],
    database: 'drizzle',
    databaseAdapter: 'neon',
    backend: 'hono',
    api: 'hc',
    auth: 'better-auth',
    extras: ['gh-actions', 'email'],
    packageManager: 'bun',
    javaBuildTool: 'gradle',
    install: true,
    git: true,
  },
} satisfies {
  name: string
  description: string
  options: PageContextValue['options']
}

export const elysiaApiPresets = {
  name: 'Elysia API',
  description: 'High-performance API server with Elysia and Drizzle',
  options: {
    name: 'my-api-app',
    frontend: [],
    database: 'drizzle',
    databaseAdapter: 'neon',
    backend: 'elysia',
    api: 'eden',
    auth: 'basic-auth',
    extras: ['gh-actions'],
    packageManager: 'bun',
    javaBuildTool: 'gradle',
    install: true,
    git: true,
  },
} satisfies {
  name: string
  description: string
  options: PageContextValue['options']
}

export const mongoExpressPresets = {
  name: 'MongoDB + Express',
  description: 'Traditional MERN stack with MongoDB and Express',
  options: {
    name: 'my-mongo-app',
    frontend: ['react-router'],
    database: 'mongoose',
    databaseAdapter: 'none',
    backend: 'express',
    api: 'none',
    auth: 'basic-auth',
    extras: ['gh-actions'],
    packageManager: 'npm',
    javaBuildTool: 'gradle',
    install: true,
    git: true,
  },
} satisfies {
  name: string
  description: string
  options: PageContextValue['options']
}

export const nextjsMinimalPresets = {
  name: 'Next.js Minimal',
  description: 'Lightweight Next.js app without database or authentication',
  options: {
    name: 'my-minimal-nextjs',
    frontend: ['nextjs'],
    database: 'none',
    databaseAdapter: 'none',
    backend: 'none',
    api: 'none',
    auth: 'none',
    extras: [],
    packageManager: 'npm',
    javaBuildTool: 'gradle',
    install: true,
    git: true,
  },
} satisfies {
  name: string
  description: string
  options: PageContextValue['options']
}

export const honoApiPresets = {
  name: 'Hono API',
  description: 'Lightweight API server with Hono and type-safe client',
  options: {
    name: 'my-hono-api',
    frontend: [],
    database: 'drizzle',
    databaseAdapter: 'neon',
    backend: 'hono',
    api: 'hc',
    auth: 'better-auth',
    extras: ['gh-actions'],
    packageManager: 'bun',
    javaBuildTool: 'gradle',
    install: true,
    git: true,
  },
} satisfies {
  name: string
  description: string
  options: PageContextValue['options']
}

export const nextjsOrpcPresets = {
  name: 'Next.js + oRPC',
  description: 'Next.js application with oRPC for type-safe APIs',
  options: {
    name: 'my-nextjs-orpc',
    frontend: ['nextjs'],
    database: 'drizzle',
    databaseAdapter: 'neon',
    backend: 'none',
    api: 'orpc',
    auth: 'next-auth',
    extras: ['gh-actions', 'email'],
    packageManager: 'pnpm',
    javaBuildTool: 'gradle',
    install: true,
    git: true,
  },
} satisfies {
  name: string
  description: string
  options: PageContextValue['options']
}
