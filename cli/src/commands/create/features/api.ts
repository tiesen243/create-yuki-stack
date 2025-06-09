import fs from 'fs/promises'

import { baseFeatures } from './base'

export async function apiFeature(
  api: 'none' | 'trpc' | 'orpc',
  database: boolean,
  auth: boolean,
  apps: string[],
) {
  if (api === 'none') return

  await fs.cp(
    new URL('../templates/packages/validators', import.meta.url),
    'packages/validators',
    { recursive: true, force: true },
  )

  await baseFeatures('api', api)

  const basePath = new URL(
    `../templates/packages/${api}/${api}`,
    import.meta.url,
  )

  await fs.mkdir('packages/api/src', { recursive: true })

  await fs.copyFile(
    new URL('src/index.ts', basePath),
    'packages/api/src/index.ts',
  )
  await fs.cp(new URL('src/client', basePath), 'packages/api/src/client', {
    recursive: true,
    force: true,
  })
  await fs.cp(new URL('src/routers', basePath), 'packages/api/src/routers', {
    recursive: true,
    force: true,
  })

  await fs.copyFile(
    new URL(
      `src/trpc.${database ? 'db' : 'none'}.${auth ? 'auth' : 'none'}.ts`,
      basePath,
    ),
    'packages/api/src/trpc.ts',
  )

  const isUseBackend =
    apps.includes('express') || apps.includes('elysia') || apps.includes('hono')

  if (apps.includes('nextjs')) {
    if (!isUseBackend)
      await fs.cp(
        new URL('apps/nextjs.ts', basePath),
        'apps/nextjs/app/api/trpc/[trpc]/route.ts',
        { recursive: true, force: true },
      )
    await updatePackageJson('nextjs')
    await addProviderToRoot('apps/nextjs/app/layout.tsx')
  }

  if (apps.includes('react-router')) {
    if (!isUseBackend)
      await fs.cp(
        new URL('apps/react-router.ts', basePath),
        'apps/react-router/src/routes/api.trpc.$trpc.ts',
        { recursive: true, force: true },
      )

    await updatePackageJson('react-router')
    await addProviderToRoot('apps/react-router/src/root.tsx')
  }

  if (apps.includes('tanstack-start')) {
    if (!isUseBackend)
      await fs.cp(
        new URL('apps/tanstack-start.ts', basePath),
        'apps/tanstack-start/src/routes/api.trpc.$trpc.ts',
        { recursive: true, force: true },
      )

    await updatePackageJson('tanstack-start')
    await addProviderToRoot('apps/tanstack-start/src/routes/__root.tsx', true)
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
  updatedRootContent = `import { TRPCReactProvider } from '@{{ name }}/api/react'\n${updatedRootContent}`
  updatedRootContent = updatedRootContent.replace(
    isUseOutlet ? '<Outlet />' : '{children}',
    `<TRPCReactProvider>
      ${isUseOutlet ? '<Outlet />' : '{children}'}
    </TRPCReactProvider>`,
  )

  await fs.writeFile(path, updatedRootContent, 'utf-8')
}
