import fs from 'node:fs/promises'

import type { ProjectOptions } from '@/commands/init/types'
import { addEnv } from '@/utils/add-env'
import { getPackageVersions } from '@/utils/get-package-version'

export async function addDatabase(opts: ProjectOptions) {
  if (opts.database === 'none') return

  const templatePath = new URL('../templates/packages/db/', import.meta.url)
  const destPath = 'packages/db'

  await fs.mkdir(`${destPath}/src`, { recursive: true })
  if (opts.database === 'prisma')
    await fs.mkdir(`${destPath}/prisma`, { recursive: true })

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
    fs.copyFile(
      new URL(`src/schema/${opts.database}.${opts.auth}.ts`, templatePath),
      opts.database === 'prisma'
        ? `${destPath}/prisma/schema.prisma`
        : `${destPath}/src/schema.ts`,
    ),
    fs.copyFile(
      new URL(`src/index/${opts.database}.${opts.adapter}.ts`, templatePath),
      `${destPath}/src/index.ts`,
    ),
    ...(opts.database !== 'mongoose'
      ? [
          fs.copyFile(
            new URL(`${opts.database}.config.ts`, templatePath),
            `${destPath}/${opts.database}.config.ts`,
          ),
        ]
      : []),
  ])

  const packageJson = (await fs
    .readFile(new URL('package.json', templatePath), 'utf-8')
    .then(JSON.parse)) as PackageJson

  const versions = await getPackageVersions([
    'drizzle-orm',
    'drizzle-kit',
    '@neondatabase/serverless',
    'postgres',
    '@prisma/client',
    '@prisma/adapter-neon',
    'prisma',
    'mongoose',
  ])

  const dependencyConfig = {
    drizzle: {
      dependencies: {
        'drizzle-orm': versions['drizzle-orm'],
        ...(opts.adapter === 'neon'
          ? { '@neondatabase/serverless': versions['@neondatabase/serverless'] }
          : { postgres: versions.postgres }),
      },
      devDependencies: {
        'drizzle-kit': versions['drizzle-kit'],
      },
    },
    prisma: {
      dependencies: {
        '@prisma/client': versions['@prisma/client'],
        ...(opts.adapter === 'neon'
          ? { '@prisma/adapter-neon': versions['@prisma/adapter-neon'] }
          : {}),
      },
      devDependencies: {
        prisma: versions.prisma,
      },
    },
    mongoose: {
      dependencies: {
        mongoose: versions.mongoose,
      },
      devDependencies: {},
    },
  }

  const config = dependencyConfig[opts.database]

  Object.assign(packageJson.dependencies ?? {}, config.dependencies)
  Object.assign(packageJson.devDependencies ?? {}, config.devDependencies)
  if (opts.database === 'drizzle') {
    Object.assign(packageJson.scripts, {
      'db:push': '{{ pkm }} run with-env drizzle-kit push',
      'db:studio': '{{ pkm }} run with-env drizzle-kit studio',
    })
  } else if (opts.database === 'prisma') {
    packageJson.exports = packageJson.exports ?? {}
    Object.assign(packageJson.exports['./schema'] ?? {}, {
      types: './dist/generated/prisma/client.d.ts',
      default: './src/generated/prisma/client.ts',
    })
    Object.assign(packageJson.scripts, {
      'db:push': '{{ pkm }} run with-env prisma db push',
      'db:studio': '{{ pkm }} run with-env prisma studio',
      postinstall: '{{ pkm }} run with-env prisma generate',
    })
  }

  await fs.writeFile(
    `${destPath}/package.json`,
    JSON.stringify(packageJson, null, 2),
  )

  await addEnv('server', 'DATABASE_URL', 'z.string()')
}
