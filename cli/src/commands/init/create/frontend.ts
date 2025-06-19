import fs from 'node:fs/promises'

import type { ProjectOptions } from '@/commands/init/types'
import { getPackageVersion } from '@/utils/get-package-version'

export async function addFrontend(opts: ProjectOptions) {
  const templatePath = new URL('../templates/', import.meta.url)

  await Promise.all(
    opts.frontend.map((app) =>
      fs.cp(new URL(`apps/${app}`, templatePath), `apps/${app}`, {
        recursive: true,
        force: true,
      }),
    ),
  )

  const workspaceDeps: Record<string, string> = {}
  if (opts.auth !== 'none') workspaceDeps['@{{ name }}/auth'] = 'workspace:*'
  if (opts.database !== 'none') workspaceDeps['@{{ name }}/db'] = 'workspace:*'
  if (opts.api !== 'none') workspaceDeps['@{{ name }}/api'] = 'workspace:*'

  const needsTanstackYarnFix = opts.frontend.some(
    (app) => app === 'tanstack-start' && opts.packageManager === 'yarn',
  )
  if (Object.keys(workspaceDeps).length === 0 && !needsTanstackYarnFix) return

  await Promise.all(
    opts.frontend.map(async (app) => {
      const packageJson = (await fs
        .readFile(`apps/${app}/package.json`, 'utf-8')
        .then(JSON.parse)) as PackageJson
      Object.assign(packageJson.dependencies ?? {}, workspaceDeps)

      if (needsTanstackYarnFix)
        Object.assign(packageJson.devDependencies ?? {}, {
          ['@vitejs/plugin-react']: await getPackageVersion(
            '@vitejs/plugin-react',
          ),
        })

      await fs.writeFile(
        `apps/${app}/package.json`,
        JSON.stringify(packageJson, null, 2) + '\n',
      )

      const routes = API_ROUTES_DIR[app]
      const { api, auth } = API_ROUTES_CONTENT[app]
      if (
        opts.api !== 'none' &&
        opts.api !== 'eden' &&
        opts.backend === 'none'
      ) {
        const nextApiDir = `${routes.api}/${opts.api}/${opts.api === 'trpc' ? '[trpc]' : '[[...orpc]]'}`
        if (app === 'nextjs') await fs.mkdir(nextApiDir, { recursive: true })
        await fs.writeFile(
          app === 'nextjs'
            ? `${nextApiDir}/route.ts`
            : `${routes.api}/api.${opts.api}.$.ts`,
          api[opts.api],
        )
      }

      if (opts.auth !== 'none') {
        if (opts.auth === 'next-auth' && app !== 'nextjs') return
        await fs.mkdir(routes.auth, { recursive: true })
        await fs.writeFile(
          app === 'nextjs'
            ? `${routes.auth}/route.ts`
            : `${routes.auth}/api.auth.$.ts`,
          auth[opts.auth],
        )
      }

      const layoutFile = LAYOUT_DIR[app]
      const layoutContent = await fs.readFile(layoutFile, 'utf-8')
      let updatedLayoutContent = layoutContent
      if (opts.api === 'trpc' || opts.api === 'orpc') {
        const provider =
          opts.api === 'trpc' ? 'TrpcReactProvider' : 'OrpcReactProvider'

        updatedLayoutContent = `${updatedLayoutContent.replace(
          /{children}|<Outlet \/>/g,
          `<${provider}>{children}</${provider}>`,
        )}\nimport { ${provider} } from '@/${opts.api}/react'`
      }
      if (opts.auth === 'basic-auth' || opts.auth === 'next-auth') {
        updatedLayoutContent = `${updatedLayoutContent.replace(
          /{children}|<Outlet \/>/g,
          `<SessionProvider>{children}</SessionProvider>`,
        )}\nimport { SessionProvider } from '@{{ name }}/auth/react'`
      }
      await fs.writeFile(layoutFile, updatedLayoutContent)
    }),
  )
}

const API_ROUTES_DIR = {
  nextjs: {
    api: 'apps/nextjs/app/api',
    auth: 'apps/nextjs/app/api/auth/[...auth]',
  },
  'react-router': {
    api: 'apps/react-router/src/routes',
    auth: 'apps/react-router/src/routes',
  },
  'tanstack-start': {
    api: 'apps/tanstack-start/src/routes',
    auth: 'apps/tanstack-start/src/routes',
  },
}

const API_ROUTES_CONTENT = {
  nextjs: {
    api: {
      trpc: `export { handler as GET, handler as POST, handler as OPTIONS } from '@{{ name }}/api'`,
      orpc: `export { handler as GET, handler as POST, handler as OPTIONS } from '@{{ name }}/api'`,
    },
    auth: {
      'basic-auth': `import { handlers } from '@{{ name }}/auth'\n\nexport const { GET, POST } = handlers`,
      'better-auth': `export { handler as GET, handler as POST } from '@{{ name }}/auth'`,
      'next-auth': `import { handlers } from '@{{ name }}/auth'\n\nexport const { GET, POST } = handlers`,
    },
  },
  'react-router': {
    api: {
      trpc: `export { handler } from '@{{ name }}/api'\n\nimport type { Route } from './+types/api.trpc.$'\n\nexport const loader = ({ request }: Route.LoaderArgs) => handler(request)\nexport const action = ({ request }: Route.ActionArgs) => handler(request)`,
      orpc: `export { handler } from '@{{ name }}/api'\n\nimport type { Route } from './+types/api.orpc.$'\n\nexport const loader = ({ request }: Route.LoaderArgs) => handler(request)\nexport const action = ({ request }: Route.ActionArgs) => handler(request)`,
    },
    auth: {
      'basic-auth': `import { handlers } from '@{{ name }}/auth'\n\nimport type { Route } from './+types/api.auth.$'\n\nconst { GET, POST } = handlers\nexport const loader = ({ request }: Route.LoaderArgs) => GET(request)\nexport const action = ({ request }: Route.ActionArgs) => POST(request)`,
      'better-auth': `import { handler } from '@{{ name }}/auth'\n\nimport type { Route } from './+types/api.auth.$'\n\nexport const loader = ({ request }: Route.LoaderArgs) => handler(request)\nexport const action = ({ request }: Route.ActionArgs) => handler(request)`,
      'next-auth': ``,
    },
  },
  'tanstack-start': {
    api: {
      trpc: `import { createServerFileRoute } from '@tanstack/react-start/server'\n\nimport { handler } from '@{{ name }}/api'\n\nexport const ServerRoute = createServerFileRoute('/api/trpc/$').methods({\n  GET: ({ request }) => handler(request),\n  POST: ({ request }) => handler(request),\n  OPTIONS: ({ request }) => handler(request),\n})`,
      orpc: `import { createServerFileRoute } from '@tanstack/react-start/server'\n\nimport { handler } from '@{{ name }}/api'\n\nexport const ServerRoute = createServerFileRoute('/api/orpc/$').methods({\n  GET: ({ request }) => handler(request),\n  POST: ({ request }) => handler(request),\n  OPTIONS: ({ request }) => handler(request),\n})`,
    },
    auth: {
      'basic-auth': `import { createServerFileRoute } from '@tanstack/react-start/server'\n\nimport { handlers } from '@{{ name }}/auth'\n\nconst { GET, POST } = handlers\nexport const ServerRoute = createServerFileRoute('/api/auth/$').methods({\n  GET: ({ request }) => GET(request),\n  POST: ({ request }) => POST(request),\n})`,
      'better-auth': `import { createServerFileRoute } from '@tanstack/react-start/server'\n\nimport { handler } from '@{{ name }}/auth'\n\nexport const ServerRoute = createServerFileRoute('/api/auth/$').methods({\n  GET: ({ request }) => handler(request),\n  POST: ({ request }) => handler(request),\n})`,
      'next-auth': ``,
    },
  },
}

const LAYOUT_DIR = {
  nextjs: 'apps/nextjs/app/layout.tsx',
  'react-router': 'apps/react-router/src/root.tsx',
  'tanstack-start': 'apps/tanstack-start/src/routes/__root.tsx',
}
