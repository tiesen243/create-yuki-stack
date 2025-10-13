import fs from 'node:fs/promises'

import type { ProjectOptions } from '@/commands/init/types'
import { addEnv } from '@/utils/add-env'
import { getPackageVersions } from '@/utils/get-package-version'

export async function addAuth(opts: ProjectOptions): Promise<void> {
  if (opts.auth === 'none') return

  const templatePath = new URL('../templates/packages/auth/', import.meta.url)
  const destPath = 'packages/auth'

  await fs.mkdir(`${destPath}/src`, { recursive: true })
  if (opts.auth === 'basic-auth')
    await fs.mkdir(`${destPath}/src/core`, { recursive: true })
  await Promise.all([
    fs.copyFile(
      new URL('eslint.config.js', templatePath),
      `${destPath}/eslint.config.js`,
    ),
    fs.copyFile(
      new URL('tsconfig.json', templatePath),
      `${destPath}/tsconfig.json`,
    ),
    fs.copyFile(new URL('turbo.json', templatePath), `${destPath}/turbo.json`),
    fs.cp(new URL(opts.auth, templatePath), `${destPath}/src`, {
      recursive: true,
    }),
    fs.copyFile(
      new URL(`configs/${opts.auth}.${opts.database}.ts`, templatePath),
      `${destPath}/src/config.ts`,
    ),
  ])

  const packageJson = (await fs
    .readFile(new URL('package.json', templatePath), 'utf-8')
    .then(JSON.parse)) as PackageJson

  const versions = await getPackageVersions([
    'next-auth@beta',
    '@auth/drizzle-adapter',
    '@auth/mongodb-adapter',
    '@auth/prisma-adapter',
    'better-auth',
    'mongodb',
  ])

  packageJson.dependencies = packageJson.dependencies ?? {}
  if (opts.auth === 'basic-auth') {
    packageJson.exports ??= {}
    packageJson.exports['./csrf'] = {
      types: './dist/csrf.d.ts',
      default: './src/csrf.ts',
    }
    packageJson.exports['./rate-limit'] = {
      types: './dist/rate-limit.d.ts',
      default: './src/rate-limit.ts',
    }
  } else if (opts.auth === 'better-auth') {
    packageJson.dependencies['better-auth'] = versions['better-auth']
    if (opts.database === 'mongoose')
      packageJson.dependencies.mongodb = versions.mongodb
  } else {
    packageJson.dependencies['next-auth'] = versions['next-auth@beta']
    if (opts.database === 'drizzle')
      packageJson.dependencies['@auth/drizzle-adapter'] =
        versions['@auth/drizzle-adapter']
    else if (opts.database === 'mongoose') {
      packageJson.dependencies['@auth/mongodb-adapter'] =
        versions['@auth/mongodb-adapter']
      packageJson.dependencies.mongodb = versions.mongodb
    } else if (opts.database === 'prisma')
      packageJson.dependencies['@auth/prisma-adapter'] =
        versions['@auth/prisma-adapter']
  }

  await fs.writeFile(
    `${destPath}/package.json`,
    JSON.stringify(packageJson, null, 2),
  )

  await addEnv('server', 'AUTH_DISCORD_ID', 'z.string()')
  await addEnv('server', 'AUTH_DISCORD_SECRET', 'z.string()')
}
