import fs from 'node:fs/promises'

import type { Options } from './types'

export async function setupMonoapp(opts: Options) {
  const templatePath = new URL('../templates/packages/auth/', import.meta.url)
  let destPath = 'src/server/auth'
  try {
    await fs.access('src')
    await fs.mkdir('src/server/auth', { recursive: true })
  } catch {
    destPath = 'server/auth'
    await fs.mkdir('server/auth', { recursive: true })
  }

  await fs.cp(new URL('basic-auth', templatePath), destPath, {
    recursive: true,
  })

  const config = await fs.readFile(
    new URL(`configs/basic-auth.${opts.db}.ts`, templatePath),
    'utf-8',
  )
  let modifiedConfig = config

  if (opts.db === 'drizzle') {
    modifiedConfig = modifiedConfig
      .replace(
        /import { db, eq } from '@{{ name }}\/db'/g,
        `import { db } from '${opts.dbInstance}'`,
      )
      .replace(
        /import { accounts, sessions, users } from '@{{ name }}\/db\/schema'/g,
        `import { accounts, sessions, users } from '${opts.dbInstance}/schema'`,
      )
    modifiedConfig = `import { eq } from 'drizzle-orm'\n\n${modifiedConfig}`
  } else {
    modifiedConfig = modifiedConfig.replace(
      /import { db } from '@{{ name }}\/db'/g,
      `import { db } from '${opts.dbInstance}'`,
    )
  }

  await fs.writeFile(`${destPath}/core/adapter.ts`, modifiedConfig)
}
