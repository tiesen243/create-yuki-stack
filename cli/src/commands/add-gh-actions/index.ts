import fs from 'node:fs/promises'

import type { ProjectOptions } from '../init/types'
import { procedure } from '@/trpc'

const lockFilemap = new Map([
  ['package-lock.json', 'npm'],
  ['yarn.lock', 'yarn'],
  ['pnpm-lock.yaml', 'pnpm'],
  ['bun.lock', 'bun'],
] as const)

export const addGhActionsCommand = procedure.mutation(async () => {
  let packageManager: ProjectOptions['packageManager'] = 'npm'

  const packageJson = (await fs
    .readFile('package.json', 'utf-8')
    .then(JSON.parse)) as PackageJson
  const name = packageJson.name

  for (const [lockFile, pm] of lockFilemap) {
    if (
      await fs
        .access(lockFile)
        .then(() => true)
        .catch(() => false)
    ) {
      packageManager = pm
      break
    }
  }

  await addGhActions({ packageManager } as ProjectOptions)

  const packageJsonGh = await fs.readFile('tools/github/package.json', 'utf-8')
  await fs.writeFile(
    'tools/github/package.json',
    packageJsonGh.replace(/{{ name }}/g, name),
    'utf-8',
  )

  const ci = await fs.readFile('.github/workflows/ci.yml', 'utf-8')
  await fs.writeFile(
    '.github/workflows/ci.yml',
    ci.replace(/{{ pkm }}/g, packageManager),
    'utf-8',
  )
})

export async function addGhActions(opts: ProjectOptions) {
  const templatePath = new URL('../templates/extras/github/', import.meta.url)
  const destPathTools = 'tools/github'
  const destPathCI = '.github/workflows'

  await fs.mkdir(`${destPathTools}/setup`, { recursive: true })
  await fs.mkdir(destPathCI, { recursive: true })

  await Promise.all([
    fs.copyFile(
      new URL('package.json', templatePath),
      `${destPathTools}/package.json`,
    ),
    fs.copyFile(
      new URL(`setup/action.${opts.packageManager}.yml`, templatePath),
      `${destPathTools}/setup/action.yml`,
    ),
    fs.copyFile(
      new URL('workflows/ci.yml', templatePath),
      `${destPathCI}/ci.yml`,
    ),
  ])
}
