import fs from 'fs/promises'

import { setupBackendApp } from './api.be'
import { baseFeatures } from './base'

export async function apiFeature(
  api: 'none' | 'trpc' | 'orpc',
  database: boolean,
  auth: boolean,
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
  if (database) packageJson.dependencies['@{{ name }}/db'] = 'workspace:*'
  if (auth) packageJson.dependencies['@{{ name }}/auth'] = 'workspace:*'
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
    new URL('src/client', basePath),
    `${packagePath}/api/src/client`,
    { recursive: true, force: true },
  )
  await fs.cp(
    new URL('src/routers', basePath),
    `${packagePath}/api/src/routers`,
    { recursive: true, force: true },
  )

  await fs.copyFile(
    new URL(
      `src/trpc.${database ? 'db' : 'none'}.${auth ? 'auth' : 'none'}.ts`,
      basePath,
    ),
    `${packagePath}/api/src/trpc.ts`,
  )

  if (isUseBackend)
    await setupBackendApp(basePath, packagePath, apps, packageManager)

  async function updatePort(port: number) {
    const trpcClientPath = `${packagePath}/api/src/client/react.tsx`
    const trpcReactContent = await fs.readFile(trpcClientPath, 'utf-8')
    const updatedTrpcReactContent = trpcReactContent.replace(
      /{{ port }}/g,
      port.toString(),
    )
    await fs.writeFile(trpcClientPath, updatedTrpcReactContent, 'utf-8')
  }

  if (apps.includes('nextjs')) {
    if (!isUseBackend)
      await fs.writeFile(
        'apps/react-router/src/routes/api.trpc.$.ts',
        `import { handlers } from '@{{ name }}/api'

         export { handlers as GET, handlers as POST, handlers as OPTIONS }`,
        'utf-8',
      )

    await updatePackageJson('nextjs')
    await addProviderToRoot('apps/nextjs/app/layout.tsx')
    await updatePort(3000)
  }

  if (apps.includes('react-router')) {
    if (!isUseBackend)
      await fs.writeFile(
        'apps/react-router/src/routes/api.trpc.$.ts',
        `import { handlers } from '@{{ name }}/api'

         import type { Route } from './+types/api.trpc.$'

         export const loader = async ({ request }: Route.LoaderArgs) => handlers(request)
         export const action = async ({ request }: Route.ActionArgs) => handlers(request)`,
        'utf-8',
      )

    await updatePackageJson('react-router')
    await addProviderToRoot('apps/react-router/src/root.tsx')
    await updatePort(3001)
  }

  if (apps.includes('tanstack-start')) {
    if (!isUseBackend)
      await fs.writeFile(
        'apps/tanstack-start/src/routes/api.trpc.$.ts',
        `import { createServerFileRoute } from '@tanstack/react-start/server'

         import { handlers } from '@{{ name }}/api'

         export const ServerRoute: unknown = createServerFileRoute(
           '/api/trpc/$',
         ).methods({
           GET: ({ request }) => handlers(request),
           POST: ({ request }) => handlers(request),
           OPTIONS: ({ request }) => handlers(request),
         })`,
        'utf-8',
      )

    await updatePackageJson('tanstack-start')
    await addProviderToRoot('apps/tanstack-start/src/routes/__root.tsx', true)
    await updatePort(3002)
  }
}

async function updatePackageJson(app: string) {
  const packageJsonPath = `apps/${app}/package.json`
  const packageJson = JSON.parse(
    await fs.readFile(packageJsonPath, 'utf-8'),
  ) as PackageJson
  packageJson.dependencies['@{{ name }}/api'] = 'workspace:*'
  await fs.writeFile(
    packageJsonPath,
    JSON.stringify(packageJson, null, 2),
    'utf-8',
  )
}

async function addProviderToRoot(path: string, isUseOutlet = false) {
  const rootContent = await fs.readFile(path, 'utf-8')

  let updatedRootContent = rootContent
  updatedRootContent = `${updatedRootContent}\nimport { TRPCReactProvider } from '@{{ name }}/api/react'`
  updatedRootContent = updatedRootContent.replace(
    isUseOutlet ? '<Outlet />' : '{children}',
    `<TRPCReactProvider>
      ${isUseOutlet ? '<Outlet />' : '{children}'}
    </TRPCReactProvider>`,
  )

  await fs.writeFile(path, updatedRootContent, 'utf-8')
}
