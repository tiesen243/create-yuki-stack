import { exec } from 'child_process'
import fs from 'fs/promises'
import { promisify } from 'util'
import * as p from '@clack/prompts'
import chalk from 'chalk'
import { zod as z } from 'trpc-cli'

import { procedure } from '@/trpc'
import { DEFAULT_APP_NAME } from '@/utils/constants'
import { getPackageManager } from '@/utils/get-package-manager'
import { sortPackageJson } from '@/utils/sort-package-json'
import { projectNameSchema } from '@/utils/validators'
import { buildReadme } from './build-readme'
import { copyPackageJson } from './copy-package-json'
import { copyTurbo } from './copy-turbo'
import { apiFeature } from './features/api'
import { authFeature } from './features/auth'
import { beFeatures } from './features/be'
import { dbFeature } from './features/db'
import { feFeatures } from './features/fe'
import { shadcnFeatures } from './features/shadcn'
import { fixVersion } from './fix-version'
import { initGit } from './init-git'
import { renderTitle } from './render-title'
import { replace } from './replace'

const execSync = promisify(exec)

export const initCommand = procedure
  .meta({
    description: 'Initialize a new Yuki stack project',
    aliases: { options: { yes: 'y' } },
    default: true,
  })
  .input(
    z.tuple([
      projectNameSchema.optional(),
      z.object({
        yes: z
          .boolean()
          .describe('Skip prompts and use default values')
          .default(false),
      }),
    ]),
  )
  .mutation(async ({ input }) => {
    const [name, options] = input

    renderTitle()
    p.intro(chalk.bold.magenta('Creating a new Yuki-Stack project'))

    let project = {
      name: name ?? DEFAULT_APP_NAME,
      database: 'none',
      adapter: 'none',
      api: 'none',
      auth: 'none',
      backend: 'none',
      frontend: ['nextjs'],
      shadcn: true,
      packageManager: getPackageManager(),
      install: true,
      git: true,
    } as ProjectConfig

    if (options.yes && name !== '.') {
      const projectExists = await fs
        .access(project.name)
        .then(() => true)
        .catch(() => false)
      if (projectExists) {
        p.note(
          chalk.redBright(
            `A directory named ${chalk.bold(project.name)} already exists. Please choose a different name.`,
          ),
        )
        process.exit(1)
      }
    } else if (!options.yes) {
      project = (await p.group(
        {
          ...(!name && {
            name: () =>
              p.text({
                message: 'What is the name of your project?',
                placeholder: DEFAULT_APP_NAME,
              }),
          }),
          _: async ({ results }) => {
            const projectName = name ?? results.name ?? DEFAULT_APP_NAME
            results.name = projectName

            if (projectName !== '.') {
              const projectExists = await fs
                .access(projectName)
                .then(() => true)
                .catch(() => false)

              if (projectExists)
                return p.confirm({
                  message: chalk.redBright(
                    `A directory named ${chalk.bold(projectName)} already exists. Do you want to overwrite it?`,
                  ),
                  initialValue: false,
                })
            }
          },
          __: ({ results }) => {
            if (results._ === false) {
              p.cancel(chalk.redBright('Operation cancelled'))
            }
            return undefined
          },
          language: () =>
            p.select({
              message: 'Will you be using TypeScript or JavaScript?',
              options: [
                { value: 'typescript', label: 'TypeScript' },
                {
                  value: 'javascript',
                  label: 'JavaScript',
                  hint: 'You should kys',
                },
              ],
              initialValue: 'typescript',
            }),
          ___: ({ results }) => {
            if (results.language === 'javascript')
              p.note(chalk.redBright('Wrong answer, using TypeScript instead'))
            return undefined
          },
          database: () =>
            p.select({
              message: 'Which database would you like to use?',
              options: [
                { value: 'none', label: 'None' },
                {
                  value: 'drizzle',
                  label: 'Drizzle',
                  hint: 'Lightweight and performant TypeScript ORM',
                },
                {
                  value: 'prisma',
                  label: 'Prisma',
                  hint: 'Powerful, feature-rich ORM',
                },
                {
                  value: 'mongodb',
                  label: 'MongoDb (soon)',
                  hint: 'NoSQL database',
                },
              ],
              initialValue: 'none',
            }),
          adapter: ({ results }) =>
            results.database !== 'none' && results.database !== 'mongodb'
              ? p.select({
                  message: 'Which adapter would you like to use?',
                  options: [
                    { value: 'none', label: 'None' },
                    {
                      value: 'neon',
                      label: 'Neon',
                      hint: 'Serverless Postgres with branching',
                    },
                    {
                      value: 'planetscale',
                      label: `PlanetScale ${results.database === 'prisma' ? '(soon)' : ''}`,
                      hint: 'Serverless MySQL with branching',
                    },
                  ],
                  initialValue: 'none',
                })
              : undefined,
          auth: ({ results }) =>
            results.database !== 'none'
              ? p.select({
                  message: 'Would you like to use an authentication solution?',
                  options: [
                    { value: 'none', label: 'None' },
                    {
                      value: 'basic',
                      label: 'Basic',
                      hint: 'Basic authentication built from scratch',
                    },
                    {
                      value: 'better-auth',
                      label: 'BetterAuth (soon)',
                      hint: 'Open-source authentication solution',
                    },
                    {
                      value: 'next-auth',
                      label: 'NextAuth.js (soon)',
                      hint: 'Flexible authentication for Next.js',
                    },
                  ],
                })
              : Promise.resolve('none'),
          api: () =>
            p.select({
              message: 'What type of API will you be using?',
              options: [
                { value: 'none', label: 'None' },
                {
                  value: 'trpc',
                  label: 'tRPC',
                  hint: 'End-to-end typesafe APIs',
                },
                {
                  value: 'orpc',
                  label: 'oRPC',
                  hint: 'End-to-end typesafe APIs that adhere to OpenAPI standards',
                },
              ],
              initialValue: 'none',
            }),
          frontend: () =>
            p.multiselect({
              message: 'Which frontend framework would you like to use?',
              options: [
                {
                  value: 'nextjs',
                  label: 'Next.js',
                  hint: 'The React Framework for Webapp',
                },
                {
                  value: 'react-router',
                  label: 'React Router',
                  hint: 'A user-obsessed, standards-focused and multi-strategy router',
                },
                {
                  value: 'tanstack-start',
                  label: 'Tanstack Start',
                  hint: 'Modern and scalable routing, SSR, Server Functions and API Routes.',
                },
                {
                  value: 'expo',
                  label: 'Expo (soon)',
                  hint: 'React Native/Expo app',
                },
              ],
              initialValues: ['nextjs'],
            }),
          backend: ({ results }) =>
            p.select({
              message: 'Which backend framework would you like to use?',
              options: [
                ...(!(
                  results.api !== 'none' &&
                  results.frontend?.length == 1 &&
                  results.frontend[0] === 'expo'
                )
                  ? [{ value: 'none', label: 'None' }]
                  : []),
                {
                  value: 'express',
                  label: 'Express',
                  hint: 'Fast, unopinionated, minimalist web framework',
                },
                {
                  value: 'elysia',
                  label: 'Elysia',
                  hint: 'Ergonomic Framework for Hoomans & Fox Girls',
                },
                {
                  value: 'hono',
                  label: 'Hono',
                  hint: 'Lightweight, ultra-fast web framework',
                },
              ],
              initialValue: 'none',
            }),
          shadcn: () =>
            p.confirm({
              message: 'Would you like to use shadcn/ui for your project?',
              initialValue: true,
            }),
          packageManager: ({ results }) => {
            const isNotRecommendedNpm =
              results.frontend?.includes('react-router')
            return p.select({
              message: 'Which package manager would you like to use?',
              options: [
                {
                  value: 'npm',
                  label: `NPM ${isNotRecommendedNpm ? '(not recommended)' : ''}`,
                  ...(isNotRecommendedNpm && {
                    hint: 'React Router may have dependency resolution issues with npm',
                  }),
                },
                { value: 'yarn', label: 'Yarn' },
                { value: 'pnpm', label: 'PNPM' },
                { value: 'bun', label: 'Bun' },
              ],
              initialValue: getPackageManager(),
            })
          },
          install: ({ results }) =>
            p.confirm({
              message: `Would you like to run ${chalk.bold(`${results.packageManager} install`)} for you?`,
              initialValue: true,
            }),
          git: ({ results }) =>
            p.confirm({
              message: 'Would you like to initialize a git repository?',
              initialValue: Boolean(results.install),
            }),
        },
        {
          onCancel: () => {
            p.cancel(chalk.redBright('Operation cancelled'))
            process.exit(0)
          },
        },
      )) as ProjectConfig
    }

    await projectNameSchema.parseAsync(project.name)

    const s = p.spinner()
    s.start(`Creating project ${chalk.bold(project.name)}....`)

    let isDotDir = false
    try {
      if (project.name !== '.') {
        await fs.mkdir(project.name, { recursive: true })
        process.chdir(project.name)
      } else {
        isDotDir = true
        project.name = process.cwd().split('/').pop() ?? DEFAULT_APP_NAME
      }

      await copyPackageJson(project.packageManager)

      // dot files
      await fs.writeFile('.env.example', '')
      await fs.copyFile(
        new URL('../templates/_gitignore', import.meta.url),
        '.gitignore',
      )
      await fs.writeFile('.nvmrc', 'v22.14.0')
      if (project.packageManager === 'pnpm')
        await fs.writeFile(
          '.npmrc',
          `node-linker=hoisted\nshared-workspace-lockfile=true\n`,
        )

      // config files
      await fs.copyFile(
        new URL('../templates/tsconfig.json', import.meta.url),
        'tsconfig.json',
      )

      // create basic structure
      await fs.mkdir('apps', { recursive: true })
      await fs.mkdir('packages', { recursive: true })
      await copyTurbo(project.name)

      await fs.cp(new URL('../templates/tooling', import.meta.url), 'tooling', {
        recursive: true,
      })

      await fs.cp(
        new URL('../templates/packages/env', import.meta.url),
        'packages/env',
        { recursive: true },
      )

      if (project.database !== 'none')
        await dbFeature(project.database, project.adapter, project.auth)
      await shadcnFeatures(project.shadcn)
      await feFeatures(project.frontend, project.shadcn)
      await apiFeature(
        project.api,
        project.database !== 'none',
        project.auth !== 'none',
        [project.backend, ...project.frontend],
        project.packageManager,
      )
      if (project.backend !== 'none' && project.api === 'none')
        await beFeatures(
          project.backend,
          project.frontend,
          project.database !== 'none',
          project.packageManager,
        )
      if (project.auth !== 'none')
        await authFeature(project.auth, project.database, project.frontend)

      if (project.packageManager === 'npm' || project.packageManager === 'yarn')
        await fixVersion()

      await replace(project.name, project.packageManager)
      await buildReadme(project)
      await sortPackageJson()

      if (project.install) {
        s.message(
          `Running ${chalk.bold(`${project.packageManager} install`)}...`,
        )
        await execSync(`${project.packageManager} install`)
        await execSync(`${project.packageManager} run format:fix`)
      }

      if (project.git) initGit()
    } catch (error) {
      if (error instanceof Error)
        console.error(chalk.redBright('Error creating project:'), error.message)
      else
        console.error(
          chalk.redBright(
            'An unknown error occurred while creating the project.',
          ),
        )
      process.exit(1)
    } finally {
      s.stop(`✨ Project ${chalk.bold(project.name)} created successfully!`)
      p.outro(
        `${chalk.bold('To get started:')}\n` +
          (!isDotDir ? `      ${chalk.cyan(`cd ${project.name}`)}\n` : '') +
          `      ${chalk.cyan('cp .env.example .env')}\n` +
          `      ${chalk.cyan(`${project.packageManager} run dev`)}\n`,
      )
    }
  })
