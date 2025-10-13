import fs from 'node:fs/promises'
import path from 'node:path'

import type { ProjectOptions } from '@/commands/init/types'

interface AppConfig {
  api: { path: string; auth: string }
  layoutFile: string
}

export async function addFrontend(opts: ProjectOptions): Promise<void> {
  const templatePath = new URL('../templates/', import.meta.url)

  await Promise.all(
    opts.frontend.map((app) =>
      fs.cp(new URL(`apps/${app}`, templatePath), `apps/${app}`, {
        recursive: true,
        force: true,
      }),
    ),
  )

  const deps: Record<string, string> = {}
  if (opts.auth !== 'none') deps['@{{ name }}/auth'] = 'workspace:*'
  if (opts.database !== 'none') deps['@{{ name }}/db'] = 'workspace:*'

  if (opts.api === 'trpc')
    Object.assign(deps, {
      '@{{ name }}/api': 'workspace:*',
      '@tanstack/react-query': 'catalog:',
      '@trpc/client': 'catalog:trpc',
      '@trpc/tanstack-react-query': 'catalog:trpc',
      superjson: 'catalog:trpc',
    })
  else if (opts.api === 'orpc')
    Object.assign(deps, {
      '@{{ name }}/api': 'workspace:*',
      '@tanstack/react-query': 'catalog:',
      '@orpc/client': 'catalog:orpc',
      '@orpc/react-query': 'catalog:orpc',
    })

  await Promise.all(opts.frontend.map((app) => processApp(app, opts, deps)))
}

async function processApp(
  app: ProjectOptions['frontend'][number],
  opts: ProjectOptions,
  workspaceDeps: Record<string, string>,
) {
  const appConfig = getAppConfig(app)

  await Promise.all([
    updatePackageJson(app, workspaceDeps),
    createApiRoutes(app, opts, appConfig),
    addApiClient(app, opts),
    createAuthRoutes(app, opts, appConfig),
    updateLayoutFile(opts, appConfig.layoutFile),
  ])
}

async function updatePackageJson(
  app: string,
  workspaceDeps: Record<string, string>,
) {
  const packageJsonPath = `apps/${app}/package.json`

  try {
    const packageJson = JSON.parse(
      await fs.readFile(packageJsonPath, 'utf-8'),
    ) as PackageJson

    if (Object.keys(workspaceDeps).length > 0)
      packageJson.dependencies = {
        ...packageJson.dependencies,
        ...workspaceDeps,
      }

    await fs.writeFile(
      packageJsonPath,
      JSON.stringify(packageJson, null, 2) + '\n',
    )
  } catch {
    // Handle errors silently
  }
}

async function createApiRoutes(
  app: ProjectOptions['frontend'][number],
  opts: ProjectOptions,
  config: AppConfig,
) {
  if (
    opts.api === 'none' ||
    opts.api === 'eden' ||
    opts.api === 'hc' ||
    opts.backend !== 'none'
  )
    return

  const apiContent = API_ROUTES_CONTENT[app].api[opts.api]

  try {
    const routePath = getApiRoutePath(app, opts, config)

    if (app === 'nextjs')
      await fs.mkdir(path.dirname(routePath), { recursive: true })

    await fs.writeFile(routePath, apiContent)
  } catch {
    // Handle errors silently
  }
}

async function addApiClient(
  app: ProjectOptions['frontend'][number],
  opts: ProjectOptions,
) {
  if (!['trpc', 'orpc'].includes(opts.api)) return
  const clientPath = `apps/${app}${app !== 'nextjs' ? '/src' : ''}/${opts.api}`

  await fs.cp(
    new URL(`../templates/packages/api/${opts.api}`, import.meta.url),
    clientPath,
    { recursive: true, force: true },
  )

  const reactContent = await fs.readFile(`${clientPath}/react.tsx`, 'utf-8')

  let modifiedReactContent = reactContent.replace(
    /{{ app }}/g,
    appMap.get(app) ?? app,
  )

  if (app === 'nextjs')
    modifiedReactContent = `'use client'\n\n${modifiedReactContent}`

  if (opts.backend !== 'none')
    modifiedReactContent = `${modifiedReactContent.replace(
      `import { getBaseUrl } from '@/lib/utils'`,
      `import { env } from '@{{ name }}/validators/env'`,
    )}\nfunction getBaseUrl() {\n  if (env.NEXT_PUBLIC_API_URL) return \`https://\${env.NEXT_PUBLIC_API_URL}\`\n  return 'http://localhost:8080'\n}`

  await fs.writeFile(`${clientPath}/react.tsx`, modifiedReactContent)
}

async function createAuthRoutes(
  app: ProjectOptions['frontend'][number],
  opts: ProjectOptions,
  config: AppConfig,
) {
  if (opts.auth === 'none' || (opts.auth === 'next-auth' && app !== 'nextjs'))
    return

  const authContent = API_ROUTES_CONTENT[app].auth[opts.auth]
  if (!authContent) return

  try {
    await fs.mkdir(config.api.auth, { recursive: true })

    const routePath =
      app === 'nextjs'
        ? `${config.api.auth}/route.ts`
        : `${config.api.auth}/api.auth.$.ts`

    await fs.writeFile(routePath, authContent)
  } catch {
    // Handle errors silently
  }
}

async function updateLayoutFile(opts: ProjectOptions, layoutFile: string) {
  try {
    let layoutContent = await fs.readFile(layoutFile, 'utf-8')

    const needsProvider = ['trpc', 'orpc'].includes(opts.api)
    if (needsProvider) {
      const provider =
        opts.api === 'trpc' ? 'TRPCReactProvider' : 'ORPCReactProvider'
      layoutContent = layoutContent.replace(
        /{children}|<Outlet \/>/g,
        (match) =>
          layoutContent.includes('{children}') && match === '<Outlet />'
            ? match
            : `<${provider}>${match}</${provider}>`,
      )
      layoutContent += `\nimport { ${provider} } from '@/${opts.api}/react'`
    }

    const needsAuth = ['basic-auth', 'next-auth'].includes(opts.auth)
    if (needsAuth) {
      layoutContent = layoutContent.replace(
        /{children}|<Outlet \/>/g,
        (match) =>
          layoutContent.includes('{children}') && match === '<Outlet />'
            ? match
            : `<SessionProvider>${match}</SessionProvider>`,
      )
      layoutContent += `\nimport { SessionProvider } from '@{{ name }}/auth/react'`
    }

    await fs.writeFile(layoutFile, layoutContent)
  } catch {
    // Handle errors silently
  }
}

function getAppConfig(app: ProjectOptions['frontend'][number]): AppConfig {
  const routesConfig = API_ROUTES_DIR[app]
  const layoutFile = LAYOUT_DIR[app]

  return {
    api: {
      path: routesConfig.api,
      auth: routesConfig.auth,
    },
    layoutFile,
  }
}

function getApiRoutePath(
  app: ProjectOptions['frontend'][number],
  opts: ProjectOptions,
  config: AppConfig,
): string {
  if (app === 'nextjs') {
    const nextApiDir = `${config.api.path}/${opts.api}/${opts.api === 'trpc' ? '[trpc]' : '[[...orpc]]'}`
    return `${nextApiDir}/route.ts`
  }

  return `${config.api.path}/api.${opts.api}.$.ts`
}

const appMap = new Map([
  ['nextjs', 'react-nextjs'],
  ['react-router', 'react-router'],
  ['tanstack-start', 'react-start'],
  ['expo', 'react-native'],
])

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
} as const

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
      trpc: `import { handler } from '@{{ name }}/api'\n\nimport type { Route } from './+types/api.trpc.$'\n\nexport const loader = ({ request }: Route.LoaderArgs) => handler(request)\nexport const action = ({ request }: Route.ActionArgs) => handler(request)`,
      orpc: `import { handler } from '@{{ name }}/api'\n\nimport type { Route } from './+types/api.orpc.$'\n\nexport const loader = ({ request }: Route.LoaderArgs) => handler(request)\nexport const action = ({ request }: Route.ActionArgs) => handler(request)`,
    },
    auth: {
      'basic-auth': `import { handlers } from '@{{ name }}/auth'\n\nimport type { Route } from './+types/api.auth.$'\n\nconst { GET, POST } = handlers\nexport const loader = ({ request }: Route.LoaderArgs) => GET(request)\nexport const action = ({ request }: Route.ActionArgs) => POST(request)`,
      'better-auth': `import { handler } from '@{{ name }}/auth'\n\nimport type { Route } from './+types/api.auth.$'\n\nexport const loader = ({ request }: Route.LoaderArgs) => handler(request)\nexport const action = ({ request }: Route.ActionArgs) => handler(request)`,
      'next-auth': ``,
    },
  },
  'tanstack-start': {
    api: {
      trpc: `import { createFileRoute } from '@tanstack/react-router'\n\nimport { handler } from '@{{ name }}/api'\n\nexport const Route = createFileRoute('/api/trpc/$')({\nserver: {\nhandlers: {\nGET: ({ request }) => handler(request),\nPOST: ({ request }) => handler(request),\nOPTIONS: ({ request }) => handler(request),\n},\n},\n})`,
      orpc: `import { createFileRoute } from '@tanstack/react-router'\n\nimport { handler } from '@{{ name }}/api'\n\nexport const Route = createFileRoute('/api/orpc/$')({\nserver: {\nhandlers: {\nGET: ({ request }) => handler(request),\nPOST: ({ request }) => handler(request),\nOPTIONS: ({ request }) => handler(request),\n},\n},\n})`,
    },
    auth: {
      'basic-auth': `import { createFileRoute } from '@tanstack/react-router'\n\nimport { handlers } from '@my-yuki-app/auth'\n\nconst { GET, POST } = handlers\nexport const Route = createFileRoute('/api/auth/$')({\nserver: {\nhandlers: {\nGET: ({ request }) => GET(request),\nPOST: ({ request }) => POST(request),\n},\n},\n})`,
      'better-auth': `import { createFileRoute } from '@tanstack/react-router'\n\nimport { handler } from '@{{ name }}/auth'\n\nexport const Route = createFileRoute('/api/auth/$')({\nserver: {\nhandlers: {\nGET: ({ request }) => handler(request),\nPOST: ({ request }) => handler(request),\n},\n},\n})`,
      'next-auth': ``,
    },
  },
} as const

const LAYOUT_DIR = {
  nextjs: 'apps/nextjs/app/layout.tsx',
  'react-router': 'apps/react-router/src/root.tsx',
  'tanstack-start': 'apps/tanstack-start/src/routes/__root.tsx',
} as const
