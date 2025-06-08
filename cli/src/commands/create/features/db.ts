import fs from 'fs/promises'

import { getPackageVersion } from '@/utils/get-package-version'
import { baseFeatures } from './base'

const adapterMap = new Map([
  ['none', 'postgres'],
  ['neon', '@neondatabase/serverless'],
  ['planet', '@planetscale/database'],
])

export async function dbFeature(db: string, adapter: string, auth: string) {
  await baseFeatures('db')

  const basePath = new URL('../templates/packages/db/db', import.meta.url)

  await fs.copyFile(
    new URL(`package.${db}.json`, basePath),
    'packages/db/package.json',
  )

  await fs.mkdir('packages/db/src', { recursive: true })

  if (db === 'prisma') {
    adapterMap.delete('none')
    adapterMap.set('neon', '@prisma/adapter-neon')
    adapterMap.set('planet', '@prisma/adapter-planetscale')

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
        /previewFeatures\s*=\s*\["driverAdapters"\]/,
        '',
      )
      await fs.writeFile(schemaPath, schemaContent, 'utf-8')
    }
    await fs.appendFile('.gitignore', '\n# prisma\ngenerated/')
  } else if (db === 'drizzle') {
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
  } else if (db === 'mongodb') {
    console.log('MongoDB database feature is not implemented yet.')
  }

  if (adapterMap.has(adapter)) {
    const adapterPackage = adapterMap.get(adapter) as unknown as string
    const packageJson = JSON.parse(
      await fs.readFile('packages/db/package.json', 'utf-8'),
    ) as { dependencies: Record<string, string> }

    const packageVersion = await getPackageVersion(adapterPackage)
    packageJson.dependencies[adapterPackage] = packageVersion
      ? `^${packageVersion}`
      : 'latest'
    await fs.writeFile(
      'packages/db/package.json',
      JSON.stringify(packageJson, null, 2),
      { encoding: 'utf-8' },
    )
  }

  try {
    await fs.access('.env.example')
    await fs.appendFile('.env.example', 'DATABASE_URL=\n')
  } catch {
    await fs.writeFile('.env.example', 'DATABASE_URL=\n')
  }
}
