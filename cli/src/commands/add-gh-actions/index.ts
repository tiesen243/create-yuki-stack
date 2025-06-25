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
