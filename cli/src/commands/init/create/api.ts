import fs from 'node:fs/promises'

import type { ProjectOptions } from '@/commands/init/types'

export async function addApi(opts: ProjectOptions): Promise<void> {
  if (['none', 'eden', 'hc'].includes(opts.api)) return

  const templatePath = new URL('../templates/packages/api/', import.meta.url)
  const destPath = opts.backend === 'none' ? 'packages/api' : 'apps/api'

  await fs.mkdir(`${destPath}/src/routers`, { recursive: true })
  if (opts.backend === 'none') {
    await Promise.all([
      fs.copyFile(
        new URL('eslint.config.js', templatePath),
        `${destPath}/eslint.config.js`,
      ),
      fs.copyFile(
        new URL('tsdown.config.ts', templatePath),
        `${destPath}/tsdown.config.ts`,
      ),
      fs.copyFile(
        new URL('tsconfig.json', templatePath),
        `${destPath}/tsconfig.json`,
      ),
      fs.copyFile(
        new URL('turbo.json', templatePath),
        `${destPath}/turbo.json`,
      ),
    ])
  }

  const [packageJson] = await Promise.all([
    fs
      .readFile(
        opts.backend === 'none'
          ? new URL('package.json', templatePath)
          : `${destPath}/package.json`,
        'utf-8',
      )
      .then((data) => JSON.parse(data) as PackageJson),
    fs.copyFile(
      new URL(
        `src/${opts.api}/${opts.database !== 'none' ? 'db' : 'none'}.${opts.auth}.ts`,
        templatePath,
      ),
      `${destPath}/src/${opts.api}.ts`,
    ),
    fs.copyFile(
      new URL(
        `src/${opts.api}/index.${opts.backend === 'none' ? 'base' : 'backend'}.ts`,
        templatePath,
      ),
      `${destPath}/src/index.ts`,
    ),
    fs.copyFile(
      new URL(`src/${opts.api}/routers/_app.ts`, templatePath),
      `${destPath}/src/routers/_app.ts`,
    ),
  ])

  packageJson.dependencies = packageJson.dependencies ?? {}
  if (opts.api === 'trpc') {
    packageJson.dependencies['@trpc/server'] = 'catalog:trpc'
    packageJson.dependencies.superjson = 'catalog:trpc'
  } else packageJson.dependencies['@orpc/server'] = 'catalog:orpc'

  if (opts.backend === 'none') {
    if (opts.database !== 'none')
      packageJson.dependencies[`@{{ name }}/db`] = 'workspace:*'
    if (opts.auth !== 'none')
      packageJson.dependencies[`@{{ name }}/auth`] = 'workspace:*'
  }

  await fs.writeFile(
    `${destPath}/package.json`,
    JSON.stringify(packageJson, null, 2),
  )
}
