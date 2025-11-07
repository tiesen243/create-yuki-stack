import fs from 'node:fs/promises'

import type { ProjectOptions } from '@/commands/init/types'

const versionMap = new Map<string, string>([
  ['node', '22.0.0'],
  ['npm', '11.6.0'],
  ['yarn', '1.22.22'],
  ['pnpm', '10.20.0'],
  ['bun', '1.3.0'],
])

export async function addBase(opts: ProjectOptions): Promise<void> {
  const templatePath = new URL('../templates/', import.meta.url)
  const copyOptions = { recursive: true, force: true }

  await Promise.all([
    fs.copyFile(new URL('_gitignore', templatePath), '.gitignore'),
    fs.copyFile(new URL('tsconfig.json', templatePath), 'tsconfig.json'),
    fs.copyFile(new URL('turbo.json', templatePath), 'turbo.json'),
    fs.cp(new URL('tools', templatePath), 'tools', copyOptions),
    fs.mkdir('apps', { recursive: true }),
    fs.mkdir('packages', { recursive: true }),
    fs.writeFile('.env.example', '# Example environment variables\n'),
    fs.writeFile('.nvmrc', `v${versionMap.get('node')}`),
  ])

  await setupPackageManager(opts, templatePath)

  await Promise.all([
    fs.cp(new URL('packages/ui', templatePath), 'packages/ui', copyOptions),
    fs.cp(
      new URL('packages/validators', templatePath),
      'packages/validators',
      copyOptions,
    ),
  ])
}

async function setupPackageManager(opts: ProjectOptions, templatePath: URL) {
  const packageJson = (await fs
    .readFile(new URL('package.json', templatePath), 'utf-8')
    .then(JSON.parse)) as PackageJson

  switch (opts.packageManager) {
    case 'pnpm':
      delete packageJson.workspaces
      await Promise.all([
        fs.copyFile(
          new URL('pnpm-workspace.yaml', templatePath),
          'pnpm-workspace.yaml',
        ),
        fs.writeFile(
          '.npmrc',
          'node-linker=hoisted\nshared-workspace-lockfile=true',
        ),
      ])
      break

    case 'bun': {
      await fs.copyFile(new URL('bunfig.yaml', templatePath), 'bunfig.toml')
      const bunJson = (await fs
        .readFile(new URL('bun.json', templatePath), 'utf-8')
        .then(JSON.parse)) as PackageJson
      Object.assign(packageJson, bunJson)
      break
    }

    default:
      break
  }

  packageJson.packageManager = `${opts.packageManager}@${versionMap.get(opts.packageManager)}`
  await fs.writeFile(
    'package.json',
    JSON.stringify(packageJson, null, 2) + '\n',
  )
}
