import fs from 'node:fs/promises'

import type { ProjectOptions } from '@/commands/init/types'

export async function addBase(opts: ProjectOptions) {
  const templatePath = new URL('../templates/', import.meta.url)

  await fs.copyFile(new URL('_gitignore', templatePath), '.gitignore')
  await fs.copyFile(new URL('tsconfig.json', templatePath), 'tsconfig.json')
  await fs.copyFile(new URL('turbo.json', templatePath), 'turbo.json')

  if (opts.packageManager === 'pnpm') {
    await fs.copyFile(
      new URL('package.pnpm.json', templatePath),
      'package.json',
    )
    await fs.copyFile(
      new URL('pnpm-workspace.yaml', templatePath),
      'pnpm-workspace.yaml',
    )
  } else if (opts.packageManager === 'bun') {
    await fs.copyFile(new URL('package.bun.json', templatePath), 'package.json')
    await fs.copyFile(new URL('bunfig.toml', templatePath), 'bunfig.toml')
  } else {
    await fs.copyFile(new URL('package.json', templatePath), 'package.json')
  }

  await fs.cp(new URL('tools', templatePath), 'tools', {
    recursive: true,
    force: true,
  })

  await fs.mkdir('apps', { recursive: true })
  await fs.mkdir('packages', { recursive: true })
}
