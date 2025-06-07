import { execSync } from 'child_process'
import fs from 'fs/promises'
import * as p from '@clack/prompts'
import chalk from 'chalk'
import spinner from 'yocto-spinner'

import { DEFAULT_APP_NAME } from '@/utils/constants'
import { getPackageManager } from '@/utils/get-package-manager'
import { copyPackageJson } from './copy-package-json'
import { copyTooling } from './copy-tooling'
import { copyTurbo } from './copy-turbo'
import { fixVersion } from './fix-version'
import { initGit } from './init-git'
import { renderTitle } from './render-title'

export const createCommand = async (name?: string) => {
  renderTitle()

  try {
    const project = await p.group({
      ...(!name && {
        name: () =>
          p.text({
            message: 'What is the name of your project?',
            placeholder: DEFAULT_APP_NAME,
          }),
      }),
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
      _: async ({ results }) => {
        if (results.language === 'javascript')
          p.note(chalk.redBright('Wrong answer, using TypeScript instead'))
      },
      packageManager: () =>
        p.select({
          message: 'Which package manager would you like to use?',
          options: [
            { value: 'npm', label: 'npm' },
            { value: 'yarn', label: 'Yarn' },
            { value: 'pnpm', label: 'pnpm (recommended)' },
            { value: 'bun', label: 'Bun (recommended)' },
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

    const creatingSpinner = spinner({ text: 'Creating new project...' }).start()

    const projectName = name ?? project.name ?? DEFAULT_APP_NAME

    await fs.mkdir(projectName, { recursive: true })
    process.chdir(projectName)

    await copyPackageJson(projectName, project.packageManager)

    await fs.copyFile(
      new URL('../templates/_gitignore', import.meta.url),
      '.gitignore',
    )
    const tsConfigContent = await fs.readFile(
      new URL('../templates/tsconfig.json.hbs', import.meta.url),
    )
    await fs.writeFile(
      'tsconfig.json',
      tsConfigContent.toString().replace(/{{ name }}/g, projectName),
      { encoding: 'utf-8' },
    )

    await fs.mkdir('apps', { recursive: true })
    await fs.mkdir('packages', { recursive: true })
    await copyTooling(projectName)
    await copyTurbo(projectName)

    // create mock package.json files for apps and packages
    await fs.mkdir('apps/mock', { recursive: true })
    await fs.writeFile(
      'apps/mock/package.json',
      JSON.stringify({ name: 'mock-app', version: '1.0.0' }, null, 2),
      { encoding: 'utf-8' },
    )
    await fs.mkdir('packages/mock', { recursive: true })
    await fs.writeFile(
      'packages/mock/package.json',
      JSON.stringify({ name: 'mock-package', version: '1.0.0' }, null, 2),
      { encoding: 'utf-8' },
    )

    if (project.packageManager === 'npm' || project.packageManager === 'yarn')
      await fixVersion()

    execSync(
      'npx sort-package-json package.json apps/*/package.json packages/*/package.json tooling/*/package.json',
      { stdio: 'pipe' },
    )

    if (project.install) {
      creatingSpinner.text = `Installing dependencies...`
      execSync(`${project.packageManager} install`, { stdio: 'pipe' })
    }

    if (project.git) initGit()

    creatingSpinner.success(
      `Project ${chalk.bold(projectName)} created successfully!`,
    )
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
  }
}
