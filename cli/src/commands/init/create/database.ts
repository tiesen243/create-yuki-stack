import type { ProjectOptions } from '@/commands/init/types'

import fs from 'node:fs/promises'

import { addEnv } from '@/utils/add-env'
import { getPackageVersions } from '@/utils/get-package-version'

export async function addDatabase(opts: ProjectOptions): Promise<void> {
  if (opts.database === 'none') return

  const templatePath = new URL('../templates/packages/db/', import.meta.url)
  const destPath = 'packages/db'

  await fs.mkdir(`${destPath}/src`, { recursive: true })
  if (opts.database === 'prisma')
    await fs.mkdir(`${destPath}/prisma`, { recursive: true })

  await Promise.all([
    fs.copyFile(
      new URL(
        opts.database === 'prisma'
          ? 'tsdown.config.prisma.ts'
          : 'tsdown.config.ts',
        templatePath,
      ),
      `${destPath}/tsdown.config.ts`,
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
    '@neondatabase/serverless',
    'drizzle-kit',
    'drizzle-orm',
    'postgres',

    '@prisma/client',
    '@prisma/adapter-pg',
    '@prisma/adapter-neon',
    '@types/pg',
    'prisma',
    'pg',

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
          : {
              '@prisma/adapter-pg': versions['@prisma/adapter-pg'],
              pg: versions.pg,
            }),
      },
      devDependencies: {
        '@types/pg': versions['@types/pg'],
        prisma: versions.prisma,
      },
    },
    mongoose: {
      dependencies: {
        mongoose: versions.mongoose,
      },
      devDependencies: {
        '@types/node': 'catalog:',
      },
    },
  }

  const config = dependencyConfig[opts.database]

  Object.assign(packageJson.dependencies ?? {}, config.dependencies)
  Object.assign(packageJson.devDependencies ?? {}, config.devDependencies)
  if (opts.database === 'drizzle') {
    Object.assign(packageJson.scripts, {
      'db:generate': '{{ pkm }} run with-env drizzle-kit generate',
      'db:migrate': '{{ pkm }} run with-env drizzle-kit migrate',
      'db:push': '{{ pkm }} run with-env drizzle-kit push',
      'db:studio': '{{ pkm }} run with-env drizzle-kit studio',
    })
  } else if (opts.database === 'prisma') {
    packageJson.exports = packageJson.exports ?? {}
    delete packageJson.exports['./schema']

    Object.assign(packageJson.scripts, {
      'db:generate': '{{ pkm }} run with-env prisma generate',
      'db:migrate': '{{ pkm }} run with-env prisma migrate dev',
      'db:push': '{{ pkm }} run with-env prisma db push',
      'db:studio': '{{ pkm }} run with-env prisma studio',
    })
  }

  await fs.writeFile(
    `${destPath}/package.json`,
    JSON.stringify(packageJson, null, 2),
  )

  await addEnv('DATABASE_URL', 'z.string()')
}
