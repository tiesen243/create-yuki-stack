import fs from 'fs/promises'

import { addEnv } from '@/utils/add-env'
import { getPackageVersion } from '@/utils/get-package-version'
import { baseFeatures } from './base'

const packageMap = new Map([
  [
    'prisma',
    {
      dep: '@prisma/client',
      devDep: 'prisma',
      adapter: {
        none: '',
        neon: '@prisma/adapter-neon',
      },
    },
  ],
  [
    'drizzle',
    {
      dep: 'drizzle-orm',
      devDep: 'drizzle-kit',
      adapter: {
        none: 'postgres',
        neon: '@neondatabase/serverless',
      },
    },
  ],
  [
    'mongodb',
    {
      dep: 'mongoose',
      devDep: '',
      adapter: { none: '', neon: '' },
    },
  ],
])

export async function dbFeature({
  adapter,
  auth,
  database,
  frontend,
}: ProjectConfig) {
  await baseFeatures('db')

  const basePath = new URL('../templates/packages/db/db', import.meta.url)

  await fs.mkdir('packages/db/src', { recursive: true })

  const packageJson = JSON.parse(
    await fs.readFile('packages/db/package.json', 'utf-8'),
  ) as PackageJson

  if (database === 'prisma') {
    await fs.copyFile(
      new URL('prisma.config.ts', basePath),
      'packages/db/prisma.config.ts',
    )

    await fs.mkdir('packages/db/prisma', { recursive: true })
    await fs.copyFile(
      new URL(`prisma/schema.${auth}.prisma`, basePath),
      'packages/db/prisma/schema.prisma',
    )

    await fs.copyFile(
      new URL(`src/index.prisma.${adapter}.ts`, basePath),
      'packages/db/src/index.ts',
    )

    if (adapter === 'none') {
      const schemaPath = 'packages/db/prisma/schema.prisma'
      let schemaContent = await fs.readFile(schemaPath, 'utf-8')
      schemaContent = schemaContent.replace(
        /previewFeatures\s*=\s*\["driverAdapters"\]\s*\n?/,
        '',
      )
      await fs.writeFile(schemaPath, schemaContent, 'utf-8')
    }
    await fs.appendFile('.gitignore', '\n# prisma\ngenerated/')

    const [dep, devDep, adapterDep] = [
      packageMap.get('prisma')?.dep ?? '',
      packageMap.get('prisma')?.devDep ?? '',
      packageMap.get('prisma')?.adapter[adapter] ?? '',
    ]
    const versions = await Promise.all([
      getPackageVersion(dep),
      getPackageVersion(devDep),
      getPackageVersion(adapterDep),
    ])
    packageJson.dependencies[packageMap.get('prisma')?.dep ?? ''] = versions[0]
      ? `^${versions[0]}`
      : 'latest'
    if (adapter !== 'none')
      packageJson.dependencies[adapterDep] = versions[2]
        ? `^${versions[2]}`
        : 'latest'
    packageJson.devDependencies[packageMap.get('prisma')?.devDep ?? ''] =
      versions[1] ? `^${versions[1]}` : 'latest'

    packageJson.scripts['db:push'] = '{{ pkm }} run with-env prisma db push'
    packageJson.scripts['db:studio'] = '{{ pkm }} run with-env prisma studio'
    packageJson.scripts.postinstall = '{{ pkm }} run with-env prisma generate'
  } else if (database === 'drizzle') {
    await fs.copyFile(
      new URL('drizzle.config.ts', basePath),
      'packages/db/drizzle.config.ts',
    )

    await fs.copyFile(
      new URL(`src/schema.${auth}.ts`, basePath),
      'packages/db/src/schema.ts',
    )

    await fs.copyFile(
      new URL(`src/index.drizzle.${adapter}.ts`, basePath),
      'packages/db/src/index.ts',
    )

    const [dep, devDep, adapterDep] = [
      packageMap.get('drizzle')?.dep ?? '',
      packageMap.get('drizzle')?.devDep ?? '',
      packageMap.get('drizzle')?.adapter[adapter] ?? '',
    ]
    const versions = await Promise.all([
      getPackageVersion(dep),
      getPackageVersion(devDep),
      getPackageVersion(adapterDep),
    ])
    packageJson.dependencies[dep] = versions[0] ? `^${versions[0]}` : 'latest'
    packageJson.dependencies[adapterDep] = versions[2]
      ? `^${versions[2]}`
      : 'latest'
    packageJson.devDependencies[devDep] = versions[1]
      ? `^${versions[1]}`
      : 'latest'

    packageJson.scripts['db:push'] = '{{ pkm }} run with-env drizzle-kit push'
    packageJson.scripts['db:studio'] =
      '{{ pkm }} run with-env drizzle-kit studio'
    packageJson.exports['./schema'] = {
      types: './dist/schema.d.ts',
      default: './src/schema.ts',
    }
  } else if (database === 'mongodb') {
    await fs.copyFile(
      new URL(`src/collections.${auth}.ts`, basePath),
      'packages/db/src/collections.ts',
    )

    await fs.copyFile(
      new URL(`src/index.mongodb.ts`, basePath),
      'packages/db/src/index.ts',
    )

    const dep = packageMap.get('mongodb')?.dep ?? ''
    const version = await getPackageVersion(dep)
    packageJson.dependencies[dep] = version ? `^${version}` : 'latest'
  }

  await fs.writeFile(
    'packages/db/package.json',
    JSON.stringify(packageJson, null, 2),
    'utf-8',
  )
  await addEnv('server', 'DATABASE_URL', 'z.string()')

  await Promise.all(
    frontend.map(async (app) => {
      const appPath = `apps/${app}/package.json`
      const appPackageJson = JSON.parse(
        await fs.readFile(appPath, 'utf-8'),
      ) as PackageJson
      appPackageJson.dependencies['@{{ name }}/db'] = `workspace:*`
      await fs.writeFile(
        appPath,
        JSON.stringify(appPackageJson, null, 2),
        'utf-8',
      )
    }),
  )
}
