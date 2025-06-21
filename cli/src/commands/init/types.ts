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
    .optional(),

  database: z.enum(['none', 'drizzle', 'prisma', 'mongoose']).optional(),
  adapter: z.enum(['none', 'neon']).optional(),

  backend: z.enum(['none', 'express', 'elysia', 'hono']).optional(),
  api: z.enum(['none', 'eden', 'trpc', 'orpc']).optional(),

  auth: z.enum(['none', 'basic-auth', 'better-auth', 'next-auth']).optional(),
  packageManager: z.enum(['npm', 'yarn', 'pnpm', 'bun']).optional(),
  install: z.boolean().optional(),

  git: z.boolean().optional(),
})

export type ProjectOptions = Omit<
  Required<z.infer<typeof projectOptions>> & {
    name: string
  },
  'yes'
>
