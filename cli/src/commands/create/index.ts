import { exec } from 'child_process'
import fs from 'fs/promises'
import { promisify } from 'util'
import * as p from '@clack/prompts'
import chalk from 'chalk'

import { DEFAULT_APP_NAME } from '@/utils/constants'
import { getPackageManager } from '@/utils/get-package-manager'
import { copyPackageJson } from './copy-package-json'
import { copyTurbo } from './copy-turbo'
import { feFeatures } from './features/fe'
import { shadcnFeatures } from './features/shadcn'
import { fixVersion } from './fix-version'
import { initGit } from './init-git'
import { renderTitle } from './render-title'
import { replace } from './replace'

const execSync = promisify(exec)

export const createCommand = async (name?: string) => {
  renderTitle()

  p.intro(chalk.bold.magenta('Creating a new Yuki-Stack project...'))

  const project = await p.group({
    ...(!name && {
      name: () =>
        p.text({
          message: 'What is the name of your project?',
          placeholder: DEFAULT_APP_NAME,
        }),
    }),
    _: async ({ results }) => {
      const projectName = name ?? results.name ?? DEFAULT_APP_NAME

      const projectExists = await fs
        .access(projectName)
        .then(() => true)
        .catch(() => false)
      if (projectExists) {
        p.note(
          chalk.redBright(
            `A directory named ${chalk.bold(projectName)} already exists. Please choose a different name.`,
          ),
        )
        process.exit(1)
      }
    },
    language: () =>
      p.select({
        message: 'Will you be using TypeScript or JavaScript?',
        options: [
          { value: 'typescript', label: 'TypeScript' },
          { value: 'javascript', label: 'JavaScript' },
        ],
        initialValue: 'typescript',
      }),
    // eslint-disable-next-line @typescript-eslint/require-await
    __: async ({ results }) => {
      if (results.language === 'javascript')
        p.note(chalk.redBright('Wrong answer, using TypeScript instead'))
    },
    database: () =>
      p.select({
        message: 'Which database would you like to use?',
        options: [
          { value: 'none', label: 'None' },
          { value: 'prisma', label: 'Prisma (soon)' },
          { value: 'drizzle', label: 'Drizzle (soon)' },
          { value: 'mongoose', label: 'Mongoose (soon)' },
        ],
        initialValue: 'none',
      }),
    api: () =>
      p.select({
        message: 'What type of API will you be using?',
        options: [
          { value: 'none', label: 'None' },
          { value: 'trpc', label: 'tRPC (soon)' },
          { value: 'orpc', label: 'oRPC (soon)' },
        ],
        initialValue: 'none',
      }),
    backend: () =>
      p.select({
        message: 'Which backend framework would you like to use?',
        options: [
          { value: 'none', label: 'None' },
          { value: 'express', label: 'Express (soon)' },
          { value: 'elysia', label: 'Elysia (soon)' },
        ],
        initialValue: 'none',
      }),
    frontend: () =>
      p.multiselect({
        message: 'Which frontend framework would you like to use?',
        options: [
          { value: 'nextjs', label: 'Next.js' },
          { value: 'rr', label: 'React Router (soon)' },
          { value: 'tsr', label: 'Tanstack Router (soon)' },
          { value: 'expo', label: 'Expo (ieact Native)' },
        ],
        initialValues: ['nextjs'],
      }),
    shadcn: () =>
      p.confirm({
        message: 'Would you like to use shadcn/ui for your project?',
        initialValue: true,
      }),
    packageManager: () =>
      p.select({
        message: 'Which package manager would you like to use?',
        options: [
          { value: 'npm', label: 'NPM' },
          { value: 'yarn', label: 'Yarn' },
          { value: 'pnpm', label: 'PNPM' },
          { value: 'bun', label: 'Bun' },
        ],
        initialValue: getPackageManager(),
      }),
    install: ({ results }) =>
      p.confirm({
        message: `Would you like to run ${chalk.bold(`${results.packageManager} install`)} for you?`,
        initialValue: true,
      }),
    git: () =>
      p.confirm({
        message: 'Would you like to initialize a git repository?',
        initialValue: true,
      }),
  })

  const projectName = name ?? project.name ?? DEFAULT_APP_NAME

  const s = p.spinner()
  s.start(`Creating project...`)

  try {
    await fs.mkdir(projectName, { recursive: true })
    process.chdir(projectName)

    await copyPackageJson(projectName, project.packageManager)

    // dot files
    await fs.copyFile(
      new URL('../templates/_gitignore', import.meta.url),
      '.gitignore',
    )
    await fs.writeFile('.nvmrc', 'v22.14.0')
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
    await copyTurbo(projectName)

    await fs.cp(new URL('../templates/tooling', import.meta.url), 'tooling', {
      recursive: true,
    })

    await fs.cp(
      new URL('../templates/packages/env', import.meta.url),
      'packages/env',
      { recursive: true },
    )

    await shadcnFeatures(projectName, project.shadcn)
    await feFeatures(project.frontend, project.shadcn)

    if (project.packageManager === 'npm' || project.packageManager === 'yarn')
      await fixVersion()

    await replace(projectName)

    await execSync(
      'npx sort-package-json package.json apps/*/package.json packages/*/package.json tooling/*/package.json',
    )

    if (project.install) await execSync(`${project.packageManager} install`)

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
    s.stop(`Project ${chalk.bold(projectName)} created successfully! 🎉`)
  }
}
