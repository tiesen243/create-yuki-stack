import fs from 'fs/promises'

import { addEnv } from '@/utils/add-env'
import { getPackageVersion } from '@/utils/get-package-version'

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
        const [
          expressVersion,
          expressCorsVersion,
          typesExpressVersion,
          typesCorsVersion,
        ] = await Promise.all([
          getPackageVersion('express'),
          getPackageVersion('cors'),
          getPackageVersion('@types/express'),
          getPackageVersion('@types/cors'),
        ])

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
        const [elysiaVersion, elysiaCorsVersion, elysuaNodeVersion] =
          await Promise.all([
            getPackageVersion('elysia'),
            getPackageVersion('@elysiajs/cors'),
            getPackageVersion('@elysiajs/node'),
          ])

        packageJson.dependencies.elysia = elysiaVersion
          ? `^${elysiaVersion}`
          : 'latest'
        packageJson.dependencies['@elysiajs/cors'] = elysiaCorsVersion
          ? `^${elysiaCorsVersion}`
          : 'latest'

        if (packageManager !== 'bun') {
          packageJson.dependencies['@elysiajs/node'] = elysuaNodeVersion
            ? `^${elysuaNodeVersion}`
            : 'latest'
        }

        return fs.copyFile(
          new URL(
            `src/server.elysia${packageManager === 'bun' ? '.ts' : '-node.ts'}`,
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
        const [honoVersion, honoTrpcVersion] = await Promise.all([
          getPackageVersion('hono'),
          getPackageVersion('@hono/trpc-server'),
        ])

        packageJson.dependencies.hono = honoVersion
          ? `^${honoVersion}`
          : 'latest'
        packageJson.dependencies['@hono/trpc-server'] = honoTrpcVersion
          ? `^${honoTrpcVersion}`
          : 'latest'

        return fs.copyFile(
          new URL('src/server.hono.ts', basePath),
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
