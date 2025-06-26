import fs from 'node:fs/promises'

import type { Options } from './types'
import { DEFAULT_PROJECT_NAME } from '../init/constants'

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

  const name =
    /@([\w-]+)\//.exec(opts.dbInstance)?.at(1) ?? DEFAULT_PROJECT_NAME

  const packageJson = (await fs
    .readFile(new URL('package.json', templatePath), 'utf-8')
    .then(JSON.parse)) as PackageJson
  packageJson.name = `@${name}/auth`
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

  const config = await fs.readFile(
    new URL(`configs/basic-auth.${opts.db}.ts`, templatePath),
    'utf-8',
  )
  await fs.writeFile(
    `${destPath}/src/config.ts`,
    config.replace(/{{ name }}/g, name),
  )
}
