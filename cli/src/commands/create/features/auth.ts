import fs from 'fs/promises'

import { addEnv } from '@/utils/add-env'
import { addProviderToRoot } from '@/utils/add-provider'
import { getPackageVersion } from '@/utils/get-package-version'
import { baseFeatures } from './base'

export async function authFeature({
  api,
  auth,
  backend,
  database,
  frontend,
}: ProjectConfig) {
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

      await fs.cp(new URL('basic', basePath), 'packages/auth/src', {
        recursive: true,
        force: true,
      })
      await fs.copyFile(
        new URL(`configs/basic.${database}.ts`, basePath),
        'packages/auth/src/core/adapter.ts',
      )

      const imp = "import { SessionProvider } from '@{{ name }}/auth/react'"
      const provider = 'SessionProvider'

      if (frontend.includes('nextjs')) {
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
      if (frontend.includes('react-router')) {
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
      if (frontend.includes('tanstack-start')) {
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
      const betterAuthVersion = await getPackageVersion('better-auth')
      packageJson.dependencies['better-auth'] = betterAuthVersion
        ? `^${betterAuthVersion}`
        : 'latest'

      await fs.cp(new URL('better', basePath), 'packages/auth/src', {
        recursive: true,
        force: true,
      })
      await fs.copyFile(
        new URL(`configs/better.${database}.ts`, basePath),
        'packages/auth/src/config.ts',
      )

      if (frontend.includes('nextjs')) {
        await fs.mkdir('apps/nextjs/app/api/auth/[...auth]', {
          recursive: true,
        })
        await fs.writeFile(
          'apps/nextjs/app/api/auth/[...auth]/route.ts',
          `import { handler } from '@{{ name }}/auth'

export { handler as GET, handler as POST }
`,
        )
      }
      if (frontend.includes('react-router')) {
        await fs.writeFile(
          'apps/react-router/src/routes/api.auth.$.ts',
          `import { handler } from '@{{ name }}/auth'

import type { Route } from './+types/api.auth.$'

export const loader = ({ request }: Route.LoaderArgs) => handler(request)
export const action = ({ request }: Route.ActionArgs) => handler(request)
`,
        )
      }
      if (frontend.includes('tanstack-start')) {
        await fs.writeFile(
          'apps/tanstack-start/src/routes/api.auth.$.ts',
          `import { createServerFileRoute } from '@tanstack/react-start/server'

import { handler } from '@my-yuki-app/auth'

export const ServerRoute: unknown = createServerFileRoute(
  '/api/auth/$',
).methods({
  GET: ({ request }) => handler(request),
  POST: ({ request }) => handler(request),
})
`,
        )
      }

      if (api !== 'none') {
        const apiPath = `${backend === 'none' ? 'packages' : 'apps'}/api/src/${api}.ts`
        const apiContent = await fs.readFile(apiPath, 'utf-8')
        const updatedContent = apiContent
          .replace(
            "import { auth, validateSessionToken } from '@{{ name }}/auth'",
            "import { auth } from '@{{ name }}/auth'",
          )
          .replace(
            /const isomorphicGetSession = async \(headers: Headers\) => \{[\s\S]*?const authToken = headers\.get\('Authorization'\) \?\? null[\s\S]*?if \(authToken\) return validateSessionToken\(authToken\)[\s\S]*?return auth\(\{ headers \}\)[\s\S]*?\}/,
            `const isomorphicGetSession = async (headers: Headers) => {
  return auth({ headers })
}`,
          )
        await fs.writeFile(apiPath, updatedContent)
      }
    },
    'next-auth': async () => {
      // This is a placeholder for the next-auth feature
    },
  }

  await handlers[auth]()
  await fs.writeFile(
    'packages/auth/package.json',
    JSON.stringify(packageJson, null, 2),
  )

  for (const app of frontend) {
    const apjPath = `apps/${app}/package.json`
    const appPackageJson = JSON.parse(
      await fs.readFile(apjPath, 'utf-8'),
    ) as PackageJson
    appPackageJson.dependencies['@{{ name }}/auth'] = `workspace:*`
    await fs.writeFile(apjPath, JSON.stringify(appPackageJson, null, 2))
  }
}
