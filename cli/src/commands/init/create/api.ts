import fs from 'node:fs/promises'

import type { ProjectOptions } from '@/commands/init/types'
import { getPackageVersions } from '@/utils/get-package-version'

export async function addApi(opts: ProjectOptions) {
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
    packageJson.dependencies['@trpc/server'] = 'catalog:api'
    packageJson.dependencies.superjson = 'catalog:api'
  } else packageJson.dependencies['@orpc/server'] = 'catalog:api'

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

  await addCatalog(opts)
}

async function addCatalog(opts: ProjectOptions) {
  const versions = await getPackageVersions([
    '@tanstack/react-query',

    '@trpc/server',
    '@trpc/client',
    '@trpc/tanstack-react-query',
    'superjson',

    '@orpc/server',
    '@orpc/client',
    '@orpc/react-query',
  ])

  const dependencies =
    opts.api === 'trpc'
      ? {
          '@tanstack/react-query': versions['@tanstack/react-query'],
          '@trpc/server': versions['@trpc/server'],
          '@trpc/client': versions['@trpc/client'],
          '@trpc/tanstack-react-query': versions['@trpc/tanstack-react-query'],
          superjson: versions.superjson,
        }
      : {
          '@tanstack/react-query': versions['@tanstack/react-query'],
          '@orpc/server': versions['@orpc/server'],
          '@orpc/client': versions['@orpc/client'],
          '@orpc/react-query': versions['@orpc/react-query'],
        }

  if (opts.packageManager === 'bun') {
    const rootPackageJson = (await fs
      .readFile('package.json', 'utf-8')
      .then(JSON.parse)) as PackageJson
    // @ts-expect-error - bun workspaces's catalogs
    Object.assign(rootPackageJson.workspaces?.catalogs, { api: dependencies })
    await fs.writeFile('package.json', JSON.stringify(rootPackageJson, null, 2))
  } else if (opts.packageManager === 'pnpm') {
    const pnpmWorkspace = await fs.readFile('pnpm-workspace.yaml', 'utf-8')
    const catalog = `\n  api:\n${Object.entries(dependencies)
      .map(
        ([name, version]) =>
          `    ${name.startsWith('@') ? `'${name}'` : name}: ${version}`,
      )
      .join('\n')}\n`
    await fs.writeFile(
      'pnpm-workspace.yaml',
      pnpmWorkspace.replace(/catalogs:/, `catalogs:${catalog}`),
    )
  }
}
