import fs from 'node:fs/promises'

import type { ProjectOptions } from '@/commands/init/types'
import { procedure } from '@/trpc'
import { getgetProjectMetadata } from '@/utils/get-project-metadata'

export const addGhActionsCommand = procedure.mutation(async () => {
  const { name, packageManager } = await getgetProjectMetadata()

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
