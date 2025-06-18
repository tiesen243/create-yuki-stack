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
    await fs.writeFile(
      '.npmrc',
      `node-linker=hoisted\nshared-workspace-lockfile=true`,
    )
  } else if (opts.packageManager === 'bun') {
    await fs.copyFile(new URL('package.bun.json', templatePath), 'package.json')
    await fs.writeFile(
      'bunfig.toml',
      `[install]\nlinkWorkspacePackages = true\n\n[run]\nbun = true`,
    )
  } else {
    const packageJson = (await fs
      .readFile(new URL('package.json', templatePath), 'utf-8')
      .then(JSON.parse)) as PackageJson
    packageJson.packageManager =
      opts.packageManager === 'npm' ? 'npm@11.4.0' : 'yarn@1.22.22'
    await fs.writeFile(
      'package.json',
      JSON.stringify(packageJson, null, 2) + '\n',
    )
  }

  await fs.cp(new URL('tools', templatePath), 'tools', {
    recursive: true,
    force: true,
  })

  await fs.mkdir('apps', { recursive: true })
  await fs.mkdir('packages', { recursive: true })

  await fs.cp(
    new URL('packages/validators', templatePath),
    'packages/validators',
    { recursive: true, force: true },
  )
  await fs.cp(new URL('packages/ui', templatePath), 'packages/ui', {
    recursive: true,
    force: true,
  })
}
