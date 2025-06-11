import fs from 'fs/promises'

import { getPackageVersion } from '@/utils/get-package-version'
import { baseFeatures } from './base'

const packages = new Map<string, { dep: string[]; devDep: string[] }>([
  [
    'express',
    { dep: ['express', 'cors'], devDep: ['@types/express', '@types/cors'] },
  ],
  [
    'elysia',
    { dep: ['elysia', '@elysiajs/cors', '@elysiajs/node'], devDep: [] },
  ],
  ['hono', { dep: ['hono'], devDep: [] }],
])

export async function beFeatures(
  backend: 'express' | 'elysia' | 'hono',
  isUseDb: boolean,
  packageManager: string,
) {
  await baseFeatures('api', {
    target: 'apps',
  })

  const basePath = new URL('../templates/packages/api/api', import.meta.url)
  const packageJson = JSON.parse(
    await fs.readFile(new URL('package.json', basePath), 'utf-8'),
  ) as PackageJson

  const hanlders = {
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
      }
      if (packageManager !== 'bun')
        dependencies['@elysiajs/node'] = versions[2]
          ? `^${versions[2]}`
          : 'latest'
      Object.assign(packageJson.dependencies, dependencies)

      await fs.copyFile(
        new URL(
          `src/server.elysia${packageManager == 'bun' ? '' : '-node'}.ts`,
          basePath,
        ),
        'apps/api/src/server.ts',
      )
    },
    hono: async () => {
      const { dep } = packages.get('hono') ?? { dep: [], devDep: [] }
      const [honoVersion] = await Promise.all(dep.map(getPackageVersion))

      Object.assign(packageJson.dependencies, {
        hono: honoVersion ? `^${honoVersion}` : 'latest',
      })

      await fs.copyFile(
        new URL('src/server.hono.ts', basePath),
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

  await fs.writeFile(
    'apps/api/package.json',
    JSON.stringify(packageJson, null, 2),
  )
}
