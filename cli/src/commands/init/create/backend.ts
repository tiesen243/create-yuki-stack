import fs from 'node:fs/promises'

import type { ProjectOptions } from '@/commands/init/types'
import { addEnv } from '@/utils/add-env'
import {
  getPackageVersion,
  getPackageVersions,
} from '@/utils/get-package-version'

export async function addBackend(opts: ProjectOptions) {
  if (opts.backend === 'none') return

  const templatePath = new URL('../templates/apps/api/', import.meta.url)
  const apiDir = 'apps/api'
  const srcDir = `${apiDir}/src`
  await fs.mkdir(srcDir, { recursive: true })

  const filesToCopy = [
    { src: 'eslint.config.js', dest: `${apiDir}/eslint.config.js` },
    { src: 'tsconfig.json', dest: `${apiDir}/tsconfig.json` },
    { src: 'turbo.json', dest: `${apiDir}/turbo.json` },
    { src: `src/server.${opts.backend}.ts`, dest: `${srcDir}/server.ts` },
    ...(opts.api === 'eden'
      ? [{ src: 'src/index.ts', dest: `${srcDir}/index.ts` }]
      : []),
  ]
  if (
    opts.backend === 'elysia' &&
    (opts.api === 'eden' || opts.api === 'none')
  ) {
    await fs.mkdir(`${srcDir}/plugins`, { recursive: true })

    if (opts.auth !== 'none')
      filesToCopy.push({
        src: 'src/plugins/auth.ts',
        dest: `${srcDir}/plugins/auth.ts`,
      })
    if (opts.database !== 'none')
      filesToCopy.push({
        src: 'src/plugins/db.ts',
        dest: `${srcDir}/plugins/db.ts`,
      })
  }

  await Promise.all(
    filesToCopy.map(({ src, dest }) =>
      fs.copyFile(new URL(src, templatePath), dest),
    ),
  )

  const packageJson = (await fs
    .readFile(new URL('package.json', templatePath), 'utf-8')
    .then(JSON.parse)) as PackageJson

  await configureBackendDependencies(packageJson, opts)
  packageJson.dependencies = packageJson.dependencies ?? {}
  packageJson.devDependencies = packageJson.devDependencies ?? {}

  if (opts.database !== 'none')
    packageJson.dependencies['@{{ name }}/db'] = 'workspace:*'

  if (opts.auth !== 'none')
    packageJson.dependencies['@{{ name }}/auth'] = 'workspace:*'

  if (opts.packageManager !== 'bun') {
    packageJson.devDependencies = packageJson.devDependencies ?? {}
    packageJson.devDependencies.tsx = await getPackageVersion('tsx')

    packageJson.scripts.dev = 'tsx watch --env-file=../../.env src/server.ts'
    packageJson.scripts.start = 'tsx --env-file=../../.env src/server.ts'

    await modifyServerFileForNonBunEnvironment(opts, `${srcDir}/server.ts`)
  }

  if (opts.backend === 'elysia' && (opts.api === 'eden' || opts.api === 'none'))
    await addElysiaPlugins(opts, srcDir)

  await fs.writeFile(
    `${apiDir}/package.json`,
    JSON.stringify(packageJson, null, 2),
  )

  await addEnv('client', 'NEXT_PUBLIC_API_URL', 'z.optional(z.string())')
}

async function configureBackendDependencies(
  packageJson: PackageJson,
  opts: ProjectOptions,
) {
  const versions = await getPackageVersions([
    'elysia',
    '@elysiajs/cors',
    '@elysiajs/eden',
    '@elysiajs/node',
    'express',
    'cors',
    '@types/express',
    '@types/cors',
    'hono',
    '@hono/node-server',
  ])

  packageJson.dependencies = packageJson.dependencies ?? {}
  packageJson.devDependencies = packageJson.devDependencies ?? {}

  if (opts.backend === 'elysia') {
    packageJson.dependencies.elysia = versions.elysia
    packageJson.dependencies['@elysiajs/cors'] = versions['@elysiajs/cors']

    if (opts.packageManager !== 'bun')
      packageJson.dependencies['@elysiajs/node'] = versions['@elysiajs/node']

    if (opts.api === 'eden')
      packageJson.dependencies['@elysiajs/eden'] = versions['@elysiajs/eden']
  } else if (opts.backend === 'express') {
    packageJson.dependencies.express = versions.express
    packageJson.dependencies.cors = versions.cors
    packageJson.devDependencies['@types/express'] = versions['@types/express']
    packageJson.devDependencies['@types/cors'] = versions['@types/cors']
  } else if (opts.backend === 'hono') {
    packageJson.dependencies.hono = versions.hono

    if (opts.packageManager !== 'bun')
      packageJson.dependencies['@hono/node-server'] =
        versions['@hono/node-server']
  }

  if (opts.api !== 'none')
    packageJson.exports = {
      '.': {
        types: './dist/index.d.ts',
        default: './src/index.ts',
      },
    }
}

async function modifyServerFileForNonBunEnvironment(
  opts: ProjectOptions,
  serverFilePath: string,
) {
  const serverContent = await fs.readFile(serverFilePath, 'utf-8')

  let modifiedContent = serverContent

  if (opts.backend === 'elysia') {
    modifiedContent = `${serverContent.replace(
      /new Elysia\(\{ aot: /g,
      'new Elysia({ adapter: node(), aot: ',
    )}\nimport cors from '@elysiajs/cors'`
  } else if (opts.backend === 'hono') {
    modifiedContent = `${serverContent.replace(
      /export default {\n\s*fetch: server\.fetch,\n\s*port: PORT,\n\s*} as const/g,
      'serve({\n  fetch: server.fetch,\n  port: PORT,\n})',
    )}\nimport { serve } from '@hono/node-server'`
  }

  if (modifiedContent !== serverContent)
    await fs.writeFile(serverFilePath, modifiedContent)
}

async function addElysiaPlugins(opts: ProjectOptions, srcDir: string) {
  const serverContent = await fs.readFile(`${srcDir}/server.ts`, 'utf-8')
  let modifiedContent = serverContent

  if (opts.auth !== 'none') {
    modifiedContent = `${modifiedContent}\nimport { authPlugin } from './plugins/auth'`

    modifiedContent = modifiedContent.replace(
      /\.use\(\s*cors\(\{\s*origin:\s*\[\s*'[^']*',?\s*'[^']*',?\s*'[^']*',?\s*\],\s*credentials:\s*true,?\s*\}\),?\s*\)/,
      (match) => `${match}\n  .use(authPlugin)`,
    )
  }

  if (opts.database !== 'none') {
    modifiedContent = `${modifiedContent}\nimport { dbPlugin } from './plugins/db'`

    modifiedContent = modifiedContent.replace(
      /\.use\(\s*cors\(\{\s*origin:\s*\[\s*'[^']*',?\s*'[^']*',?\s*'[^']*',?\s*\],\s*credentials:\s*true,?\s*\}\),?\s*\)/,
      (match) => `${match}\n  .use(dbPlugin)`,
    )
  }

  if (modifiedContent !== serverContent)
    await fs.writeFile(`${srcDir}/server.ts`, modifiedContent)
}
