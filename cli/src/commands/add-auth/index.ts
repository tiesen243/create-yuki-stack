import fs from 'node:fs/promises'
import * as p from '@clack/prompts'

import type { Options } from './types'
import { procedure } from '@/trpc'
import { setupMonoapp } from './setup-monoapp'
import { setupMonorepo } from './setup-turborepo'

export const addAuth = procedure.mutation(async () => {
  const options: Options = {
    turbo: false,
    db: 'drizzle',
    dbInstance: '@/server/db',
  }

  try {
    await fs.access('turbo.json')
    options.turbo = true

    try {
      await fs.access('packages/db')
      const dbPackageJson = (await fs
        .readFile('packages/db/package.json', 'utf-8')
        .then(JSON.parse)) as PackageJson

      options.dbInstance = dbPackageJson.name
      if (dbPackageJson.dependencies?.['drizzle-orm']) options.db = 'drizzle'
      else if (dbPackageJson.dependencies?.['@prisma/client'])
        options.db = 'prisma'
      else if (dbPackageJson.dependencies?.mongoose) options.db = 'mongoose'
      else throw new Error('No recognized db package found')
    } catch (error) {
      if (error instanceof Error) console.error(error.message)
      else console.log('No db package found, skipping db auth setup.')
      throw new Error(
        'Database package detection failed. Please run with manual configuration.',
      )
    }
  } catch {
    const { db, dbInstance } = await p.group({
      db: () =>
        p.select({
          message: 'Which database are you using?',
          options: [
            { value: 'drizzle', label: 'Drizzle' },
            { value: 'prisma', label: 'Prisma' },
            { value: 'mongoose', label: 'Mongoose' },
          ],
          initialValue: 'drizzle',
        }),
      dbInstance: () =>
        p.text({
          message: 'Where is your db package located?',
          initialValue: '@/server/db',
        }),
    })
    options.db = db as 'drizzle' | 'prisma' | 'mongoose'
    options.dbInstance = dbInstance.trim() || '@/server/db'
  }

  if (options.turbo) await setupMonorepo(options)
  else await setupMonoapp(options)
})
