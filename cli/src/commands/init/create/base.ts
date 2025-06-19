import fs from 'node:fs/promises'

import type { ProjectOptions } from '@/commands/init/types'

const versionMap = new Map<string, string>([
  ['npm', '11.4.0'],
  ['yarn', '1.22.22'],
  ['pnpm', '10.11.0'],
  ['bun', '1.2.16'],
])

export async function addBase(opts: ProjectOptions) {
  const templatePath = new URL('../templates/', import.meta.url)
  const copyOptions = { recursive: true, force: true }

  await Promise.all([
    fs.copyFile(new URL('_gitignore', templatePath), '.gitignore'),
    fs.copyFile(new URL('tsconfig.json', templatePath), 'tsconfig.json'),
    fs.copyFile(new URL('turbo.json', templatePath), 'turbo.json'),
    fs.cp(new URL('turbo', templatePath), 'turbo', copyOptions),
    fs.cp(new URL('tools', templatePath), 'tools', copyOptions),
    fs.mkdir('apps', { recursive: true }),
    fs.mkdir('packages', { recursive: true }),
    fs.writeFile('.env.example', '# Example environment variables\n'),
  ])

  await setupPackageManager(opts.packageManager, templatePath)

  await Promise.all([
    fs.cp(new URL('packages/ui', templatePath), 'packages/ui', copyOptions),
    fs.cp(
      new URL('packages/validators', templatePath),
      'packages/validators',
      copyOptions,
    ),
  ])
}

async function setupPackageManager(
  packageManager: ProjectOptions['packageManager'],
  templatePath: URL,
) {
  const packageJson = (await fs
    .readFile(new URL('package.json', templatePath), 'utf-8')
    .then(JSON.parse)) as PackageJson

  switch (packageManager) {
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

    case 'bun':
      await Promise.all([
        fs.copyFile(new URL('package.bun.json', templatePath), 'package.json'),
        fs.writeFile(
          'bunfig.toml',
          '[install]\nlinkWorkspacePackages = true\n\n[run]\nbun = true',
        ),
      ])
      break

    default: {
      packageJson.workspaces = ['apps/*', 'packages/*', 'tools/*']
      await fs.writeFile(
        'package.json',
        JSON.stringify(packageJson, null, 2) + '\n',
      )
      break
    }
  }

  packageJson.packageManager = `${packageManager}@${versionMap.get(packageManager)}`
  await fs.writeFile(
    'package.json',
    JSON.stringify(packageJson, null, 2) + '\n',
  )
}
