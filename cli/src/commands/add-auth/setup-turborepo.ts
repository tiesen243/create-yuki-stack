import fs from 'node:fs/promises'
import pc from 'picocolors'

import type { Options } from './types'
import { replaceInDirectory } from '@/commands/init/create/replace-placeholder'
import { addEnv } from '@/utils/add-env'

export async function setupMonorepo(opts: Options) {
  const templatePath = new URL('../templates/packages/auth/', import.meta.url)
  const destPath = 'packages/auth'

  await fs.mkdir(`${destPath}/src`, { recursive: true })
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
    fs.cp(new URL('basic-auth', templatePath), `${destPath}/src`, {
      recursive: true,
    }),
  ])

  const packageJson = (await fs
    .readFile(new URL('package.json', templatePath), 'utf-8')
    .then(JSON.parse)) as PackageJson
  packageJson.exports = packageJson.exports ?? {}
  packageJson.exports['./csrf'] = {
    types: './dist/csrf.d.ts',
    default: './src/csrf.ts',
  }
  packageJson.exports['./rate-limit'] = {
    types: './dist/rate-limit.d.ts',
    default: './src/rate-limit.ts',
  }
  await fs.writeFile(
    `${destPath}/package.json`,
    JSON.stringify(packageJson, null, 2),
  )

  await fs.copyFile(
    new URL(`configs/basic-auth.${opts.db}.ts`, templatePath),
    `${destPath}/src/config.ts`,
  )

  await replaceInDirectory(destPath, new Map([['{{ name }}', opts.name]]))

  const schemaPath =
    opts.db === 'prisma' ? 'prisma/auth-schema.prisma' : 'src/auth-schema.ts'

  await fs.copyFile(
    new URL(
      `../templates/packages/db/src/schema/${opts.db}.basic-auth.ts`,
      import.meta.url,
    ),
    `packages/db/${schemaPath}`,
  )

  await addEnv('server', 'AUTH_DISCORD_ID', 'z.string()')
  await addEnv('server', 'AUTH_DISCORD_SECRET', 'z.string()')

  console.log(
    pc.green(`✓ Auth package setup complete!`),
    `\n${pc.cyan('Next step:')} Copy auth schema from ${pc.bold(`packages/db/${schemaPath}`)} to your main schema file.`,
  )
}
