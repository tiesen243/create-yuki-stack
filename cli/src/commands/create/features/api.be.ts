import fs from 'fs/promises'

import { addEnv } from '@/utils/add-env'
import { getPackageVersion } from '@/utils/get-package-version'

const packages = new Map<string, { dep: string[]; devDep: string[] }>([
  [
    'express',
    { dep: ['express', 'cors'], devDep: ['@types/express', '@types/cors'] },
  ],
  [
    'elysia',
    { dep: ['elysia', '@elysiajs/cors', '@elysiajs/node'], devDep: [] },
  ],
  ['hono', { dep: ['hono', '@hono/node-server'], devDep: [] }],
])

export async function setupBackendApp(
  basePath: URL,
  packagePath: string,
  apps: string[],
  packageManager: string,
) {
  const packageJson = JSON.parse(
    await fs.readFile(`${packagePath}/api/package.json`, 'utf-8'),
  ) as PackageJson

  const serverSetups = [
    {
      name: 'express',
      condition: apps.includes('express'),
      setup: async () => {
        const { dep, devDep } = packages.get('express') ?? {
          dep: [],
          devDep: [],
        }
        const [
          expressVersion,
          expressCorsVersion,
          typesExpressVersion,
          typesCorsVersion,
        ] = await Promise.all([...dep, ...devDep].map(getPackageVersion))

        Object.assign(packageJson.dependencies, {
          express: expressVersion ? `^${expressVersion}` : 'latest',
          cors: expressCorsVersion ? `^${expressCorsVersion}` : 'latest',
        })

        Object.assign(packageJson.devDependencies, {
          '@types/express': typesExpressVersion
            ? `^${typesExpressVersion}`
            : 'latest',
          '@types/cors': typesCorsVersion ? `^${typesCorsVersion}` : 'latest',
        })

        return fs.copyFile(
          new URL('src/server.express.ts', basePath),
          `${packagePath}/api/src/server.ts`,
        )
      },
    },
    {
      name: 'elysia',
      condition: apps.includes('elysia'),
      setup: async () => {
        const { dep } = packages.get('elysia') ?? { dep: [] }
        const [elysiaVersion, elysiaCorsVersion, elysuaNodeVersion] =
          await Promise.all(dep.map(getPackageVersion))

        packageJson.dependencies.elysia = elysiaVersion
          ? `^${elysiaVersion}`
          : 'latest'
        packageJson.dependencies['@elysiajs/cors'] = elysiaCorsVersion
          ? `^${elysiaCorsVersion}`
          : 'latest'

        if (packageManager !== 'bun')
          packageJson.dependencies['@elysiajs/node'] = elysuaNodeVersion
            ? `^${elysuaNodeVersion}`
            : 'latest'

        return fs.copyFile(
          new URL(
            `src/server.elysia${packageManager === 'bun' ? '' : '-node'}.ts`,
            basePath,
          ),
          `${packagePath}/api/src/server.ts`,
        )
      },
    },
    {
      name: 'hono',
      condition: apps.includes('hono'),
      setup: async () => {
        const { dep } = packages.get('hono') ?? { dep: [] }
        const versions = await Promise.all(dep.map(getPackageVersion))

        packageJson.dependencies.hono = versions[0]
          ? `^${versions[0]}`
          : 'latest'
        if (packageManager !== 'bun') {
          packageJson.dependencies['@hono/node-server'] = versions[1]
            ? `^${versions[1]}`
            : 'latest'
        }

        return fs.copyFile(
          new URL(
            `src/server.hono${packageManager === 'bun' ? '' : '-node'}.ts`,
            basePath,
          ),
          `${packagePath}/api/src/server.ts`,
        )
      },
    },
  ]

  const activeSetup = serverSetups.find((setup) => setup.condition)
  if (activeSetup) await activeSetup.setup()

  if (packageManager !== 'bun') {
    const tsxVersion = await getPackageVersion('tsx')
    packageJson.devDependencies.tsx = tsxVersion ? `^${tsxVersion}` : 'latest'
  }

  packageJson.scripts = {
    ...packageJson.scripts,
    ...(packageManager === 'bun'
      ? {
          dev: 'bun --hot --env-file=../../.env src/server.ts',
          start: 'bun --env-file=../../.env src/server.ts',
        }
      : {
          dev: 'tsx watch --env-file=../../.env src/server.ts',
          start: 'tsx --env-file=../../.env src/server.ts',
        }),
    build: 'tsc',
  }

  await fs.writeFile(
    `${packagePath}/api/package.json`,
    JSON.stringify(packageJson, null, 2),
    'utf-8',
  )

  await addEnv('client', 'NEXT_PUBLIC_API_URL', 'z.string().optional()')
}
