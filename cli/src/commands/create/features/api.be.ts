import fs from 'fs/promises'

import { addEnv } from '@/utils/add-env'
import { getPackageVersion } from '@/utils/get-package-version'

export async function setupBackendApp(
  basePath: URL,
  packagePath: string,
  apps: string[],
  packageManager: string,
) {
  const trpcClientPath = `${packagePath}/api/src/client/react.tsx`

  const packageJson = JSON.parse(
    await fs.readFile(`${packagePath}/api/package.json`, 'utf-8'),
  ) as PackageJson
  const dotenvVYersion = await getPackageVersion('dotenv-cli')
  packageJson.devDependencies['dotenv-cli'] = dotenvVYersion
    ? `^${dotenvVYersion}`
    : 'latest'
  if (apps.includes('express')) {
    const expressVersion = await getPackageVersion('express')
    const expressCorsVersion = await getPackageVersion('cors')
    const typesExpressVersion = await getPackageVersion('@types/express')
    const typesCorsVersion = await getPackageVersion('@types/cors')

    packageJson.dependencies.express = expressVersion
      ? `^${expressVersion}`
      : 'latest'
    packageJson.dependencies.cors = expressCorsVersion
      ? `^${expressCorsVersion}`
      : 'latest'
    packageJson.devDependencies['@types/express'] = typesExpressVersion
      ? `^${typesExpressVersion}`
      : 'latest'
    packageJson.devDependencies['@types/cors'] = typesCorsVersion
      ? `^${typesCorsVersion}`
      : 'latest'

    await fs.copyFile(
      new URL('src/server.express.ts', basePath),
      `${packagePath}/api/src/server.ts`,
    )
  } else if (apps.includes('elysia')) {
    const elysiaVersion = await getPackageVersion('elysia')
    const elysiaCorsVersion = await getPackageVersion('@elysiajs/cors')
    const elysuaNodeVersion = await getPackageVersion('@elysiajs/node')

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

    await fs.copyFile(
      new URL(
        `src/server.elysia${packageManager === 'bun' ? '.ts' : '-node.ts'}`,
        basePath,
      ),
      `${packagePath}/api/src/server.ts`,
    )
  } else if (apps.includes('hono')) {
    const honoVersion = await getPackageVersion('hono')
    const honoTrpcVersion = await getPackageVersion('@hono/trpc-server')

    packageJson.dependencies.hono = honoVersion ? `^${honoVersion}` : 'latest'
    packageJson.dependencies['@hono/trpc-server'] = honoTrpcVersion
      ? `^${honoTrpcVersion}`
      : 'latest'
    await fs.copyFile(
      new URL('src/server.hono.ts', basePath),
      `${packagePath}/api/src/server.ts`,
    )
  }

  if (packageManager !== 'bun') {
    const tsxVersion = await getPackageVersion('tsx')
    packageJson.devDependencies.tsx = tsxVersion ? `^${tsxVersion}` : 'latest'
  }

  packageJson.scripts = {
    ...packageJson.scripts,
    ...(packageManager === 'bun'
      ? {
          dev: 'bun with-env bun --watch src/server.ts',
          start: 'bun with-env bun src/server.ts',
        }
      : {
          dev: '{{ pkm }} run with-env tsx watch src/server.ts',
          start: '{{ pkm }} run with-env tsx src/server.ts',
        }),
    build: 'tsc',
    'with-env': 'dotenv -e ../../.env --',
  }

  await fs.writeFile(
    `${packagePath}/api/package.json`,
    JSON.stringify(packageJson, null, 2),
    'utf-8',
  )

  await addEnv('client', 'NEXT_PUBLIC_API_URL', 'z.string().optional()')

  const trpcReactContent = await fs.readFile(trpcClientPath, 'utf-8')
  const updatedTrpcReactContent = trpcReactContent.replace(
    /function getBaseUrl\(\) \{[\s\S]*?\n\}/,
    `function getBaseUrl() {
  if (env.NEXT_PUBLIC_API_URL)
    return \`https://\${env.NEXT_PUBLIC_API_URL}\`
  return \`http://localhost:\${process.env.PORT ?? 8080}\`
}`,
  )
  await fs.writeFile(trpcClientPath, updatedTrpcReactContent, 'utf-8')
}
