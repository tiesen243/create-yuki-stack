import fs from 'fs/promises'

import { getPackageVersion } from '@/utils/get-package-version'
import { setupBackendApp } from './api.be'
import { baseFeatures } from './base'

export async function apiFeature(
  api: 'none' | 'trpc' | 'orpc',
  isUseDb: boolean,
  isAuth: boolean,
  apps: string[],
  packageManager: string,
) {
  if (api === 'none') return

  await fs.cp(
    new URL('../templates/packages/validators', import.meta.url),
    'packages/validators',
    { recursive: true, force: true },
  )

  const isUseBackend =
    apps.includes('express') || apps.includes('elysia') || apps.includes('hono')

  await baseFeatures('api', {
    templateDir: api,
    target: isUseBackend ? 'apps' : 'packages',
  })

  const basePath = new URL(
    `../templates/packages/${api}/${api}`,
    import.meta.url,
  )
  const packagePath = isUseBackend ? 'apps' : 'packages'
  await fs.mkdir(`${packagePath}/api/src`, { recursive: true })

  const packageJsonPath = `${packagePath}/api/package.json`
  const packageJson = JSON.parse(
    await fs.readFile(packageJsonPath, 'utf-8'),
  ) as PackageJson
  if (isUseDb) packageJson.dependencies['@{{ name }}/db'] = 'workspace:*'
  if (isAuth) packageJson.dependencies['@{{ name }}/auth'] = 'workspace:*'
  await fs.writeFile(
    packageJsonPath,
    JSON.stringify(packageJson, null, 2),
    'utf-8',
  )

  await fs.copyFile(
    new URL(`src/index.${isUseBackend ? 'be.ts' : 'ts'}`, basePath),
    `${packagePath}/api/src/index.ts`,
  )
  await fs.cp(
    new URL('src/routers', basePath),
    `${packagePath}/api/src/routers`,
    { recursive: true, force: true },
  )

  await fs.copyFile(
    new URL(
      `src/${api}.${isUseDb ? 'db' : 'none'}.${isAuth ? 'auth' : 'none'}.ts`,
      basePath,
    ),
    `${packagePath}/api/src/${api}.ts`,
  )

  if (isUseBackend)
    await setupBackendApp(basePath, packagePath, apps, packageManager)

  async function copyHelpers(path: string, appName: string) {
    const isHaveSrc = await fs.access(`${path}/src`).then(
      () => true,
      () => false,
    )

    const helpersDir = `${path}${isHaveSrc ? '/src' : ''}/${api}`
    await fs.cp(new URL('src/client', basePath), helpersDir, {
      recursive: true,
      force: true,
    })

    let reactFile = await fs.readFile(`${helpersDir}/react.tsx`, 'utf-8')
    reactFile = reactFile.replace(/{{ app }}/g, appName)
    if (appName === 'react-nextjs') reactFile = `"use client"\n${reactFile}`

    if (isUseBackend) {
      reactFile = reactFile.replace(
        /import { getBaseUrl } from '@\/lib\/utils'/g,
        "import { env } from '@{{ name }}/env'",
      )

      reactFile += `\nfunction getBaseUrl() {
  if (env.NEXT_PUBLIC_API_URL)
    return \`https://\${env.NEXT_PUBLIC_API_URL}\`
  // eslint-disable-next-line no-restricted-properties
  return \`http://localhost:\${process.env.PORT ?? 8080}\`
}`
    }

    await fs.writeFile(`${helpersDir}/react.tsx`, reactFile, 'utf-8')
  }

  const appHandlers = [
    {
      name: 'nextjs',
      setup: async () => {
        if (!isUseBackend) {
          const apiDir = `apps/nextjs/app/api/${api}/${api === 'trpc' ? '[trpc]' : '[[...orpc]]'}`
          await fs.mkdir(apiDir, { recursive: true })
          await fs.writeFile(
            `${apiDir}/route.ts`,
            `import { handlers } from '@{{ name }}/api'

export { handlers as GET, handlers as POST, handlers as OPTIONS }`,
            'utf-8',
          )
        }
        await Promise.all([
          updatePackageJson('nextjs', api),
          addProviderToRoot(api, 'apps/nextjs/app/layout.tsx'),
          copyHelpers('apps/nextjs', 'react-nextjs'),
        ])
      },
    },
    {
      name: 'react-router',
      setup: async () => {
        if (!isUseBackend) {
          await fs.writeFile(
            `apps/react-router/src/routes/api.${api}.$.ts`,
            `import { handlers } from '@{{ name }}/api'

import type { Route } from './+types/api.${api}.$'

export const loader = async ({ request }: Route.LoaderArgs) => handlers(request)
export const action = async ({ request }: Route.ActionArgs) => handlers(request)`,
            'utf-8',
          )
        }
        await Promise.all([
          updatePackageJson('react-router', api),
          addProviderToRoot(api, 'apps/react-router/src/root.tsx'),
          copyHelpers('apps/react-router', 'react-router'),
        ])
      },
    },
    {
      name: 'tanstack-start',
      setup: async () => {
        if (!isUseBackend) {
          await fs.writeFile(
            `apps/tanstack-start/src/routes/api.${api}.$.ts`,
            `import { createServerFileRoute } from '@tanstack/react-start/server'

import { handlers } from '@{{ name }}/api'

export const ServerRoute: unknown = createServerFileRoute(
  '/api/${api}/$',
).methods({
  GET: ({ request }) => handlers(request),
  POST: ({ request }) => handlers(request),
  OPTIONS: ({ request }) => handlers(request),
})`,
            'utf-8',
          )
        }
        await Promise.all([
          updatePackageJson('tanstack-start', api),
          addProviderToRoot(api, 'apps/tanstack-start/src/routes/__root.tsx'),
          copyHelpers('apps/tanstack-start', 'react-start'),
        ])
      },
    },
  ]

  const activeHandlers = appHandlers.filter((handler) =>
    apps.includes(handler.name),
  )
  await Promise.all(activeHandlers.map((handler) => handler.setup()))
}

async function updatePackageJson(app: string, api: 'trpc' | 'orpc') {
  const packageJsonPath = `apps/${app}/package.json`
  const packageJson = JSON.parse(
    await fs.readFile(packageJsonPath, 'utf-8'),
  ) as PackageJson

  const rootPackageJson = JSON.parse(
    await fs.readFile('package.json', 'utf-8'),
  ) as PackageJson
  const packageManager = rootPackageJson.packageManager.split('@')[0]
  const isUseCatalog = packageManager === 'pnpm' || packageManager === 'bun'

  packageJson.dependencies['@{{ name }}/api'] = 'workspace:*'
  packageJson.dependencies['@{{ name }}/validators'] = 'workspace:*'
  if (api === 'trpc') {
    packageJson.dependencies['@tanstack/react-query'] = isUseCatalog
      ? 'catalog:api'
      : 'latest'
    packageJson.dependencies['@trpc/client'] = isUseCatalog
      ? 'catalog:api'
      : 'latest'
    packageJson.dependencies['@trpc/tanstack-react-query'] = isUseCatalog
      ? 'catalog:api'
      : 'latest'
    packageJson.dependencies.superjson = isUseCatalog ? 'catalog:api' : 'latest'
  } else {
    packageJson.dependencies['@orpc/client'] = isUseCatalog
      ? 'catalog:api'
      : 'latest'
    packageJson.dependencies['@orpc/react-query'] = isUseCatalog
      ? 'catalog:api'
      : 'latest'
    packageJson.dependencies['@tanstack/react-query'] = isUseCatalog
      ? 'catalog:api'
      : 'latest'
  }

  // update catalog if using pnpm or bun
  if (isUseCatalog) {
    const reactQueryVersion = await getPackageVersion('@tanstack/react-query')
    let serverVersion, clientVersion, helpersVersion, superjsonVersion
    if (api === 'trpc') {
      serverVersion = await getPackageVersion('@trpc/server')
      clientVersion = await getPackageVersion('@trpc/client')
      helpersVersion = await getPackageVersion('@trpc/tanstack-react-query')
      superjsonVersion = await getPackageVersion('superjson')
    } else {
      serverVersion = await getPackageVersion('@orpc/server')
      clientVersion = await getPackageVersion('@orpc/client')
      helpersVersion = await getPackageVersion('@orpc/react-query')
    }

    if (packageManager === 'bun') {
      // @ts-expect-error - add api catalog to root package.json
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      rootPackageJson.workspaces.catalogs = {
        api:
          api === 'trpc'
            ? {
                '@tanstack/react-query': reactQueryVersion
                  ? `^${reactQueryVersion}`
                  : 'latest',
                '@trpc/client': clientVersion ? `^${clientVersion}` : 'latest',
                '@trpc/server': serverVersion ? `^${serverVersion}` : 'latest',
                '@trpc/tanstack-react-query': helpersVersion
                  ? `^${helpersVersion}`
                  : 'latest',
                superjson: superjsonVersion ? `^${superjsonVersion}` : 'latest',
              }
            : {
                '@orpc/client': clientVersion ? `^${clientVersion}` : 'latest',
                '@orpc/react-query': helpersVersion
                  ? `^${helpersVersion}`
                  : 'latest',
                '@orpc/server': serverVersion ? `^${serverVersion}` : 'latest',
                '@tanstack/react-query': reactQueryVersion
                  ? `^${reactQueryVersion}`
                  : 'latest',
              },
        // @ts-expect-error - add other catalogs if they exist
        ...(rootPackageJson.workspaces.catalogs ?? {}),
      }

      await fs.writeFile(
        'package.json',
        JSON.stringify(rootPackageJson, null, 2),
        'utf-8',
      )
    } else {
      let pnpmWorkspace = await fs.readFile('pnpm-workspace.yaml', 'utf-8')

      const apiCatalog =
        api === 'trpc'
          ? {
              "'@tanstack/react-query'": reactQueryVersion
                ? `^${reactQueryVersion}`
                : 'latest',
              "'@trpc/client'": clientVersion ? `^${clientVersion}` : 'latest',
              "'@trpc/server'": serverVersion ? `^${serverVersion}` : 'latest',
              "'@trpc/tanstack-react-query'": helpersVersion
                ? `^${helpersVersion}`
                : 'latest',
              superjson: superjsonVersion ? `^${superjsonVersion}` : 'latest',
            }
          : {
              "'@orpc/client'": clientVersion ? `^${clientVersion}` : 'latest',
              "'@orpc/react-query'": helpersVersion
                ? `^${helpersVersion}`
                : 'latest',
              "'@orpc/server'": serverVersion ? `^${serverVersion}` : 'latest',
              "'@tanstack/react-query'": reactQueryVersion
                ? `^${reactQueryVersion}`
                : 'latest',
            }

      const apiCatalogYaml = Object.entries(apiCatalog)
        .map(([key, value]) => `    ${key}: ${value}`)
        .join('\n')

      if (!pnpmWorkspace.includes('api:'))
        pnpmWorkspace = pnpmWorkspace.replace(
          'catalogs:',
          `catalogs:\n  api:\n${apiCatalogYaml}\n`,
        )

      await fs.writeFile('pnpm-workspace.yaml', pnpmWorkspace, 'utf-8')
    }
  }

  await fs.writeFile(
    packageJsonPath,
    JSON.stringify(packageJson, null, 2),
    'utf-8',
  )
}

async function addProviderToRoot(api: 'trpc' | 'orpc', path: string) {
  const provider = api === 'trpc' ? 'TRPCReactProvider' : 'ORPCReactProvider'

  const rootContent = await fs.readFile(path, 'utf-8')
  const isHaveChildren = rootContent.includes('{children}')

  let updatedRootContent = rootContent
  updatedRootContent = `${updatedRootContent}\nimport { ${provider} } from '@/${api}/react'`
  updatedRootContent = updatedRootContent.replace(
    isHaveChildren ? '{children}' : '<Outlet />',
    `<${provider}>
      ${isHaveChildren ? '{children}' : '<Outlet />'}
    </${provider}>`,
  )

  await fs.writeFile(path, updatedRootContent, 'utf-8')
}
