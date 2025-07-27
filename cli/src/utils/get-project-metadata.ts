import fs from 'node:fs/promises'

import type { ProjectOptions } from '@/commands/init/types'

export async function getProjectMetadata() {
  const lockFilemap = new Map([
    ['package-lock.json', 'npm'],
    ['yarn.lock', 'yarn'],
    ['pnpm-lock.yaml', 'pnpm'],
    ['bun.lock', 'bun'],
  ] as const)

  let packageManager: ProjectOptions['packageManager'] = 'npm'
  let isTurbo = true

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

  try {
    await fs.access('turbo.json')
  } catch {
    isTurbo = false
  }

  return { name, packageManager, isTurbo }
}
