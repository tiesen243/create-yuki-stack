import { zod as z } from 'trpc-cli'

export const projectName = z
  .string()
  .min(1)
  .max(50)
  .refine(
    (name) => name === '.' || (!name.startsWith('.') && !name.startsWith('-')),
    { message: "Project name cannot start with '.' or '-' (except for '.')" },
  )
  .refine((name) => /^[a-zA-Z0-9._-]+$/.test(name), {
    message: 'Project name contains invalid characters.',
  })

export const projectOptions = z.object({
  yes: z.boolean().optional(),

  frontend: z
    .array(z.enum(['nextjs', 'react-router', 'tanstack-start']))
    .describe('Frontend frameworks')
    .optional(),

  database: z
    .enum(['none', 'drizzle', 'prisma', 'mongoose'])
    .describe('Database options')
    .optional(),
  adapter: z.enum(['none', 'neon']).describe('Database adapter').optional(),

  backend: z
    .enum(['none', 'express', 'elysia', 'hono'])
    .describe('Backend framework')
    .optional(),
  api: z
    .enum(['none', 'eden', 'hc', 'trpc', 'orpc'])
    .describe('API type')
    .optional(),

  auth: z
    .enum(['none', 'basic-auth', 'better-auth', 'next-auth'])
    .describe('Authentication options')
    .optional(),

  extras: z.array(z.enum(['gh-actions', 'email'])).optional(),

  packageManager: z
    .enum(['npm', 'yarn', 'pnpm', 'bun'])
    .describe('Package manager')
    .optional(),
  install: z.boolean().describe('Install dependencies after setup').optional(),
  git: z.boolean().describe('Initialize a git repository').optional(),
})

export type ProjectOptions = Omit<
  Required<z.infer<typeof projectOptions>> & {
    name: string
  },
  'yes'
>
