import fs from 'node:fs/promises'
import * as p from '@clack/prompts'
import gradient from 'gradient-string'
import pc from 'picocolors'
import * as z from 'zod'

import {
  APP_COLORS,
  APP_TITLE,
  DEFAULT_PROJECT_OPTIONS,
} from '@/commands/init/constants'
import { projectName, projectOptions } from '@/commands/init/types'
import { procedure } from '@/trpc'
import { checkDir } from './check-dir'
import { createProject } from './create'

export const initCommand = procedure
  .meta({ aliases: { options: { yes: 'y' } }, default: true })
  .input(z.tuple([projectName.optional(), projectOptions]))
  .mutation(async ({ input: [inputName, inputOptions] }) => {
    renderTitle()

    const project = {
      ...DEFAULT_PROJECT_OPTIONS,
      ...inputOptions,
      name: inputName ?? DEFAULT_PROJECT_OPTIONS.name,
    }

    const isShowPrompt = inputOptions.yes
      ? !inputOptions.yes
      : Object.keys(inputOptions).length === 0
    if (isShowPrompt) {
      const prompt = await p.group(
        {
          ...(!inputName && {
            name: () =>
              p.text({
                message: 'What would you like to name your project?',
                initialValue: DEFAULT_PROJECT_OPTIONS.name,
              }),
          }),
          language: () =>
            p.select({
              message: 'Which language would you like to use?',
              options: [
                { value: 'typescript', label: 'TypeScript' },
                { value: 'javascript', label: 'JavaScript' },
              ],
              initialValue: 'typescript',
            }),
          _: ({ results }) => {
            if (results.language === 'javascript')
              p.note(pc.redBright('Wrong answer. Use TypeScript instead :>'))
            return undefined
          },

          // Frontend
          frontend: () =>
            p.multiselect({
              message: 'Which frontend framework would you like to use?',
              options: [
                {
                  value: 'nextjs',
                  label: 'Next.js',
                  hint: 'The React Framework for the Web',
                },
                {
                  value: 'react-router',
                  label: 'React Router',
                  hint: 'A user‑obsessed, standards‑focused, multi‑strategy router you can deploy anywhere',
                },
                {
                  value: 'tanstack-start',
                  label: 'TanStack Start',
                  hint: 'Full-stack React and Solid framework powered by TanStack Router',
                },
              ],
              initialValues: DEFAULT_PROJECT_OPTIONS.frontend,
            }),

          // Backend
          backend: () =>
            p.select({
              message: 'Which backend framework would you like to use?',
              options: [
                { value: 'none', label: 'None' },
                {
                  value: 'elysia',
                  label: 'Elysia',
                  hint: 'Ergonomic Framework for Humans & Fox Girls',
                },
                {
                  value: 'express',
                  label: 'Express',
                  hint: 'Fast, unopinionated, minimalist web framework for Node.js',
                },
                {
                  value: 'hono',
                  label: 'Hono',
                  hint: 'Fast, lightweight, built on Web Standards. Support for any JavaScript runtime',
                },
                {
                  value: 'spring-boot',
                  label: 'Spring Boot',
                  hint: 'Production-ready Java framework for building web applications',
                },
              ],
              initialValue: DEFAULT_PROJECT_OPTIONS.backend,
            }),
          api: ({ results }) =>
            results.backend !== 'spring-boot'
              ? p.select({
                  message: 'Which API framework would you like to use?',
                  options: [
                    { value: 'none', label: 'None' },
                    ...(results.backend === 'elysia'
                      ? [
                          {
                            value: 'eden',
                            label: 'Eden Treaty',
                            hint: 'End-to-end type-safe APIs with Elysia',
                          },
                        ]
                      : []),
                    ...(results.backend === 'hono'
                      ? [
                          {
                            value: 'hc',
                            label: 'Hono Client',
                            hint: 'The RPC feature allows sharing of the API specifications between the server and the client',
                          },
                        ]
                      : []),
                    {
                      value: 'trpc',
                      label: 'tRPC',
                      hint: 'Move Fast and Break Nothing. End-to-end typesafe APIs made easy',
                    },
                    {
                      value: 'orpc',
                      label: 'oRPC',
                      hint: 'Easy to build APIs that are end-to-end type-safe and adhere to OpenAPI standards',
                    },
                  ],
                  initialValue: DEFAULT_PROJECT_OPTIONS.api,
                })
              : Promise.resolve(DEFAULT_PROJECT_OPTIONS.api),

          // Database
          database: () =>
            p.select({
              message: 'Which database would you like to use?',
              options: [
                { value: 'none', label: 'None' },
                {
                  value: 'drizzle',
                  label: 'Drizzle',
                  hint: 'A lightweight and performant TypeScript ORM with developer experience in mind',
                },
                {
                  value: 'prisma',
                  label: 'Prisma',
                  hint: 'Ship at lightning speed, and scale to a global audience effortlessly with our next-gen serverless Postgres database',
                },
                {
                  value: 'mongoose',
                  label: 'Mongoose',
                  hint: 'Elegant MongoDB object modeling for Node.js',
                },
              ],
              initialValue: DEFAULT_PROJECT_OPTIONS.database,
            }),
          adapter: ({ results }) =>
            results.database !== 'none' && results.database !== 'mongoose'
              ? p.select({
                  message: 'Which database adapter would you like to use?',
                  options: [
                    { value: 'none', label: 'None' },
                    {
                      value: 'neon',
                      label: 'Neon',
                      hint: 'The database developers trust, on a serverless platform designed to help you build reliable and scalable applications faster',
                    },
                  ],
                  initialValue: DEFAULT_PROJECT_OPTIONS.adapter,
                })
              : Promise.resolve(DEFAULT_PROJECT_OPTIONS.adapter),

          // Auth
          auth: ({ results }) =>
            results.database !== 'none'
              ? p.select({
                  message: 'Which authentication method would you like to use?',
                  options: [
                    { value: 'none', label: 'None' },
                    {
                      value: 'basic-auth',
                      label: 'Basic Auth',
                      hint: 'Basic authentication built from scratch based on Lucia',
                    },
                    {
                      value: 'better-auth',
                      label: 'Better Auth',
                      hint: 'The most comprehensive authentication framework for TypeScript',
                    },
                    ...(results.frontend?.length === 1 &&
                    results.frontend[0] === 'nextjs'
                      ? [
                          {
                            value: 'next-auth',
                            label: 'NextAuth.js',
                            hint: 'Authentication for Next.js applications',
                          },
                        ]
                      : []),
                  ],
                  initialValue: DEFAULT_PROJECT_OPTIONS.auth,
                })
              : Promise.resolve(DEFAULT_PROJECT_OPTIONS.auth),

          extras: () =>
            p.multiselect({
              message: 'Would you like to add any extra packages?',
              options: [
                {
                  value: 'gh-actions',
                  label: 'GitHub Actions',
                  hint: 'CI/CD pipeline with type checking, linting, and formatting',
                },
                {
                  value: 'email',
                  label: 'Email',
                  hint: 'Email service with Resend provider and React Email templates',
                },
              ],
              initialValues: DEFAULT_PROJECT_OPTIONS.extras,
              required: false,
            }),

          // Configuration
          packageManager: () =>
            p.select({
              message: 'Which package manager would you like to use?',
              options: [
                {
                  value: 'npm',
                  label: 'NPM',
                  hint: 'The default package manager for Node.js',
                },
                {
                  value: 'yarn',
                  label: 'Yarn',
                  hint: 'Safe, stable, reproducible projects',
                },
                {
                  value: 'pnpm',
                  label: 'PNPM',
                  hint: 'Fast, disk space efficient package manager',
                },
                {
                  value: 'bun',
                  label: 'Bun',
                  hint: 'A fast JavaScript all-in-one toolkit',
                },
              ],
              initialValue: DEFAULT_PROJECT_OPTIONS.packageManager,
            }),
          javaBuildTool: ({ results }) =>
            results.backend === 'spring-boot'
              ? p.select({
                  message: 'Which Java build tool would you like to use?',
                  options: [
                    {
                      value: 'maven',
                      label: 'Maven',
                      hint: 'A software project management and comprehension tool',
                    },
                    {
                      value: 'gradle',
                      label: 'Gradle',
                      hint: 'A modern build automation tool for Java projects',
                    },
                  ],
                  initialValue: DEFAULT_PROJECT_OPTIONS.javaBuildTool,
                })
              : Promise.resolve(undefined),

          install: () =>
            p.confirm({
              message: 'Would you like to install dependencies?',
              initialValue: DEFAULT_PROJECT_OPTIONS.install,
            }),
          git: () =>
            p.confirm({
              message: 'Would you like to initialize a Git repository?',
              initialValue: DEFAULT_PROJECT_OPTIONS.git,
            }),
        },
        {
          onCancel: () => {
            p.cancel('Operation cancelled.')
            process.exit(0)
          },
        },
      )

      Object.assign(project, prompt)
    }

    await projectOptions.parseAsync(project)
    const { isCurrentDir, dest, projectName } = await checkDir(project.name)
    project.name = projectName

    if (!isCurrentDir) {
      await fs.mkdir(projectName, { recursive: true })
      process.chdir(projectName)
    }
    await createProject(project, dest)

    p.outro(
      `Next steps:\n\n` +
        (isCurrentDir ? '' : `      cd ${pc.bold(projectName)}\n`) +
        `      cp .env.example .env\n` +
        `      ${project.packageManager} run dev`,
    )
  })

function renderTitle() {
  const g = gradient(APP_COLORS)
  console.log(g.multiline(APP_TITLE))
}
