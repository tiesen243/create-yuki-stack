import fs from 'fs/promises'

import { addEnv } from '@/utils/add-env'
import { getPackageVersion } from '@/utils/get-package-version'
import { baseFeatures } from './base'

const packages = new Map<string, { dep: string[]; devDep: string[] }>([
  [
    'express',
    { dep: ['express', 'cors'], devDep: ['@types/express', '@types/cors'] },
  ],
  [
    'elysia',
    {
      dep: ['elysia', '@elysiajs/cors', '@elysiajs/eden', '@elysiajs/node'],
      devDep: [],
    },
  ],
  ['hono', { dep: ['hono', '@hono/node-server'], devDep: [] }],
])

export async function beFeatures(
  backend: ProjectConfig['backend'],
  frontend: ProjectConfig['frontend'],
  isUseDb: boolean,
  packageManager: string,
) {
  await fs.cp(
    new URL('../templates/packages/validators', import.meta.url),
    'packages/validators',
    { recursive: true, force: true },
  )

  await baseFeatures('api', {
    target: 'apps',
  })

  const basePath = new URL('../templates/packages/api/api', import.meta.url)
  const packageJson = JSON.parse(
    await fs.readFile(new URL('package.json', basePath), 'utf-8'),
  ) as PackageJson

  const hanlders = {
    none: async () => {
      // No backend setup needed
    },
    express: async () => {
      const { dep, devDep } = packages.get('express') ?? { dep: [], devDep: [] }
      const versions = await Promise.all(
        [...dep, ...devDep].map(getPackageVersion),
      )

      Object.assign(packageJson.dependencies, {
        express: versions[0] ? `^${versions[0]}` : 'latest',
        cors: versions[1] ? `^${versions[1]}` : 'latest',
      })
      Object.assign(packageJson.devDependencies, {
        '@types/express': versions[2] ? `^${versions[2]}` : 'latest',
        '@types/cors': versions[3] ? `^${versions[3]}` : 'latest',
      })

      await fs.copyFile(
        new URL('src/server.express.ts', basePath),
        'apps/api/src/server.ts',
      )
    },
    elysia: async () => {
      const { dep } = packages.get('elysia') ?? { dep: [], devDep: [] }
      const versions = await Promise.all(dep.map(getPackageVersion))

      const dependencies: Record<string, string> = {
        elysia: versions[0] ? `^${versions[0]}` : 'latest',
        '@elysiajs/cors': versions[1] ? `^${versions[1]}` : 'latest',
        '@elysiajs/eden': versions[2] ? `^${versions[2]}` : 'latest',
      }
      if (packageManager !== 'bun')
        dependencies['@elysiajs/node'] = versions[3]
          ? `^${versions[3]}`
          : 'latest'
      Object.assign(packageJson.dependencies, dependencies)

      packageJson.exports = {
        '.': {
          types: './dist/index.d.ts',
          default: './src/index.ts',
        },
      }

      await fs.copyFile(
        new URL(
          `src/server.elysia${packageManager == 'bun' ? '' : '-node'}.ts`,
          basePath,
        ),
        'apps/api/src/server.ts',
      )
      await fs.copyFile(
        new URL('src/index.elysia.ts', basePath),
        'apps/api/src/index.ts',
      )

      for (const app of frontend) {
        const fePackageJson = JSON.parse(
          await fs.readFile(`apps/${app}/package.json`, 'utf-8'),
        ) as PackageJson
        Object.assign(fePackageJson.dependencies, {
          '@{{ name }}/api': 'workspace:*',
        })
        await fs.writeFile(
          `apps/${app}/package.json`,
          JSON.stringify(fePackageJson, null, 2),
        )
      }
    },
    hono: async () => {
      const { dep } = packages.get('hono') ?? { dep: [], devDep: [] }
      const versions = await Promise.all(dep.map(getPackageVersion))

      const dependencies: Record<string, string> = {
        hono: versions[0] ? `^${versions[0]}` : 'latest',
      }
      if (packageManager !== 'bun')
        dependencies['@hono/node-server'] = versions[1]
          ? `^${versions[1]}`
          : 'latest'
      Object.assign(packageJson.dependencies, dependencies)

      await fs.copyFile(
        new URL(
          `src/server.hono${packageManager == 'bun' ? '' : '-node'}.ts`,
          basePath,
        ),
        'apps/api/src/server.ts',
      )
    },
  }

  await fs.mkdir('apps/api/src', { recursive: true })
  await hanlders[backend]()
  if (packageManager !== 'bun') {
    const tsxVersion = await getPackageVersion('tsx')
    Object.assign(packageJson.devDependencies, {
      tsx: tsxVersion ? `^${tsxVersion}` : 'latest',
    })
  }
  if (isUseDb)
    Object.assign(packageJson.dependencies, { '@{{ name }}/db': 'workspace:*' })

  const scripts =
    packageManager === 'bun'
      ? {
          dev: 'bun --hot --env-file=../../.env src/server.ts',
          start: 'bun --env-file=../../.env src/server.ts',
        }
      : {
          dev: 'tsx watch --env-file=../../.env src/server.ts',
          start: 'tsx --env-file=../../.env src/server.ts',
        }
  Object.assign(packageJson.scripts, scripts)

  await addEnv('client', 'NEXT_PUBLIC_API_URL', 'z.string().optional()')
  await fs.writeFile(
    'apps/api/package.json',
    JSON.stringify(packageJson, null, 2),
  )
}
