import fs from 'fs/promises'

import { addEnv } from '@/utils/add-env'
import { addProviderToRoot } from '@/utils/add-provider'
import { getPackageVersion } from '@/utils/get-package-version'
import { baseFeatures } from './base'

export async function authFeature(
  auth: ProjectConfig['auth'],
  database: ProjectConfig['database'],
  apps: ProjectConfig['frontend'],
) {
  await baseFeatures('auth')

  const basePath = new URL('../templates/packages/auth/auth', import.meta.url)
  const packageJson = JSON.parse(
    await fs.readFile(new URL('package.json', basePath), 'utf-8'),
  ) as PackageJson

  const handlers = {
    none: async () => {
      // No authentication needed, just return
    },
    'basic-auth': async () => {
      const arcticVersion = await getPackageVersion('arctic')
      packageJson.dependencies.arctic = arcticVersion
        ? `^${arcticVersion}`
        : 'latest'

      await fs.copyFile(
        new URL(`adapters/${database}.ts`, basePath),
        'packages/auth/src/core/adapter.ts',
      )

      const imp = "import { SessionProvider } from '@{{ name }}/auth/react'"
      const provider = 'SessionProvider'

      if (apps.includes('nextjs')) {
        await fs.mkdir('apps/nextjs/app/api/auth/[...auth]', {
          recursive: true,
        })
        await fs.writeFile(
          'apps/nextjs/app/api/auth/[...auth]/route.ts',
          `import { handlers } from '@{{ name }}/auth'

export const { GET, POST } = handlers
`,
        )
        await addProviderToRoot(imp, provider, 'apps/nextjs/app/layout.tsx')
      }
      if (apps.includes('react-router')) {
        await fs.mkdir('apps/react-router/src/routes', { recursive: true })
        await fs.writeFile(
          'apps/react-router/src/routes/api.auth.$.ts',
          `import { handlers } from '@{{ name }}/auth'

import type { Route } from './+types/api.auth.$'

const { GET, POST } = handlers

export const loader = ({ request }: Route.LoaderArgs) => GET(request)
export const action = ({ request }: Route.ActionArgs) => POST(request)
`,
        )
        await addProviderToRoot(imp, provider, 'apps/react-router/src/root.tsx')
      }

      if (apps.includes('tanstack-start')) {
        await fs.mkdir('apps/tanstack-start/src/routes', { recursive: true })
        await fs.writeFile(
          'apps/tanstack-start/src/routes/api.auth.$.ts',
          `import { createServerFileRoute } from '@tanstack/react-start/server'

import { handlers } from '@{{ name }}/auth'

const { GET, POST } = handlers

export const ServerRoute: unknown = createServerFileRoute(
  '/api/auth/$',
).methods({
  GET: ({ request }) => GET(request),
  POST: ({ request }) => POST(request),
})`,
        )
        await addProviderToRoot(
          imp,
          provider,
          'apps/tanstack-start/src/routes/__root.tsx',
        )
      }

      await addEnv('server', 'AUTH_DISCORD_ID', 'z.string()')
      await addEnv('server', 'AUTH_DISCORD_SECRET', 'z.string()')
    },
    'better-auth': async () => {
      // This is a placeholder for the better-auth feature
    },
    'next-auth': async () => {
      // This is a placeholder for the next-auth feature
    },
  }

  await fs.cp(new URL('src', basePath), 'packages/auth/src', {
    recursive: true,
    force: true,
  })
  await handlers[auth]()
  await fs.writeFile(
    new URL('package.json', basePath),
    JSON.stringify(packageJson, null, 2),
  )
}
