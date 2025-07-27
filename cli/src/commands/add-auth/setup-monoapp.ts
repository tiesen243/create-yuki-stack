import fs from 'node:fs/promises'
import pc from 'picocolors'

import type { Options } from './types'

export async function setupMonoapp(opts: Options) {
  const templatePath = new URL('../templates/packages/auth/', import.meta.url)
  let destPath = 'src/server'
  try {
    await fs.access('src')
  } catch {
    destPath = 'server'
  }

  await fs.mkdir(`${destPath}/auth`, { recursive: true })

  await fs.cp(new URL('basic-auth', templatePath), `${destPath}/auth`, {
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
        /import { and, db, eq } from '@{{ name }}\/db'/g,
        `import { db } from '${opts.dbInstance}'`,
      )
      .replace(
        /import { accounts, sessions, users } from '@{{ name }}\/db\/schema'/g,
        `import { accounts, sessions, users } from '${opts.dbInstance}/schema'`,
      )
    modifiedConfig = `import { and, eq } from 'drizzle-orm'\n\n${modifiedConfig}`
  } else {
    modifiedConfig = modifiedConfig.replace(
      /import { db } from '@{{ name }}\/db'/g,
      `import { db } from '${opts.dbInstance}'`,
    )
  }

  modifiedConfig = modifiedConfig
    .replace(/import { env } from '@{{ name }}\/validators\/env'\n\n/g, '')
    .replace(/env\.(\w+)/g, "process.env.$1 ?? ''")

  await fs.writeFile(`${destPath}/auth/config.ts`, modifiedConfig)

  const schemaPath =
    opts.db === 'prisma'
      ? 'prisma/auth-schema.prisma'
      : `${destPath}/db/auth-schema.ts`

  await fs.copyFile(
    new URL(
      `../templates/packages/db/src/schema/${opts.db}.basic-auth.ts`,
      import.meta.url,
    ),
    schemaPath,
  )

  console.log(
    pc.green(`✓ Auth package setup complete!`),
    `\n${pc.cyan('Next step:')} Copy auth schema from ${pc.bold(schemaPath)} to your main schema file.`,
  )
}
