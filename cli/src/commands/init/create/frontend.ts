import type { ProjectOptions } from '@/commands/init/types'

import fs from 'node:fs/promises'
import path from 'node:path'

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
      '@trpc/client': 'catalog:trpc',
      '@trpc/tanstack-react-query': 'catalog:trpc',
      superjson: 'catalog:trpc',
    })
  else if (opts.api === 'orpc')
    Object.assign(deps, {
      '@{{ name }}/api': 'workspace:*',
      '@orpc/client': 'catalog:orpc',
      '@orpc/tanstack-query': 'catalog:orpc',
    })

  await Promise.all(opts.frontend.map((app) => processApp(app, opts, deps)))
}

async function processApp(
  app: ProjectOptions['frontend'][number],
  opts: ProjectOptions,
  workspaceDeps: Record<string, string>,
) {
  await Promise.all([
    updatePackageJson(app, workspaceDeps),
    createApiRoutes(app, opts),
    addApiClient(app, opts),
    createAuthRoutes(app, opts),
    updateProvidersFile(app, opts),
  ])

  if (app === 'react-router') {
    const routesConfig = 'apps/react-router/src/routes.ts'
    try {
      const routesContent = await fs.readFile(routesConfig, 'utf-8')
      const modifiedRoutesContent = routesContent.replace(
        /(\.\.\.prefix\('\/api',\s*\[)([\s\S]*?)(\]\))/,
        (_, start: string, inner: string, end) => {
          let additions = inner.trim() ? inner.trim() + ',\n' : ''
          if (opts.api !== 'none' && opts.backend === 'none') {
            additions += `route('/${opts.api}/*', './routes/api/${opts.api}.ts'),\n`
          }
          if (opts.auth !== 'none') {
            additions += `route('/auth/*', './routes/api/auth.ts'),\n`
          }
          // Remove trailing comma and newline if present
          additions = additions.replace(/,\n$/, '\n')
          return `${start}\n  ${additions}${end}`
        },
      )

      await fs.writeFile(routesConfig, modifiedRoutesContent)
    } catch {
      // Handle errors silently
    }
  }
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
) {
  if (
    opts.api === 'none' ||
    opts.api === 'eden' ||
    opts.api === 'hc' ||
    opts.backend !== 'none'
  )
    return

  const apiContent = API_ROUTES_CONTENT[app].api[opts.api]
  let routePath = path.join(
    API_ROUTES_DIR[app],
    opts.api,
    `[...${opts.api}]/route.ts`,
  )
  if (app === 'react-router')
    routePath = path.join(API_ROUTES_DIR[app], `${opts.api}.ts`)
  else if (app === 'tanstack-start')
    routePath = path.join(API_ROUTES_DIR[app], `${opts.api}.$.ts`)

  try {
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

  await fs.rename(
    `${clientPath}/query-client.ts`,
    `packages/lib/src/create-query-client.ts`,
  )

  const reactContent = await fs.readFile(`${clientPath}/react.tsx`, 'utf-8')

  let modifiedReactContent = reactContent.replace(
    /{{ app }}/g,
    appMap.get(app) ?? app,
  )

  if (opts.backend !== 'none')
    if (app === 'nextjs')
      modifiedReactContent = `${modifiedReactContent.replace(
        `import { getBaseUrl } from '@/lib/utils'`,
        `import { env } from '@{{ name }}/validators/env.next'`,
      )}\nfunction getBaseUrl() {\n  if (env.NEXT_PUBLIC_API_URL) return \`https://\${env.NEXT_PUBLIC_API_URL}\`\n  return 'http://localhost:8080'\n}`
    else
      modifiedReactContent = `${modifiedReactContent.replace(
        `import { getBaseUrl } from '@/lib/utils'`,
        `import { env } from '@{{ name }}/validators/env.vite'`,
      )}\nfunction getBaseUrl() {\n  if (env.VITE_API_URL) return \`https://\${env.VITE_API_URL}\`\n  return 'http://localhost:8080'\n}`

  await fs.writeFile(`${clientPath}/react.tsx`, modifiedReactContent)
}

async function createAuthRoutes(
  app: ProjectOptions['frontend'][number],
  opts: ProjectOptions,
) {
  if (opts.auth === 'none' || (opts.auth === 'next-auth' && app !== 'nextjs'))
    return

  const authContent = API_ROUTES_CONTENT[app].auth[opts.auth]
  if (!authContent) return

  let routePath = path.join(
    API_ROUTES_DIR[app],
    'auth',
    '[...auth]',
    'route.ts',
  )
  if (app === 'react-router')
    routePath = path.join(API_ROUTES_DIR[app], 'auth.ts')
  else if (app === 'tanstack-start')
    routePath = path.join(API_ROUTES_DIR[app], 'auth.$.ts')

  try {
    await fs.mkdir(path.dirname(routePath), { recursive: true })
    await fs.writeFile(routePath, authContent)
  } catch {
    // Handle errors silently
  }
}

async function updateProvidersFile(
  app: ProjectOptions['frontend'][number],
  opts: ProjectOptions,
) {
  const providerFile = PROVIDERS_DIR[app]

  try {
    let providerContent = await fs.readFile(providerFile, 'utf-8')

    const needsProvider = ['trpc', 'orpc'].includes(opts.api)
    if (needsProvider) {
      const provider =
        opts.api === 'trpc' ? 'TRPCReactProvider' : 'ORPCReactProvider'
      providerContent = providerContent.replace(/{children}/g, (match) =>
        providerContent.includes('{children}') && match === '<Outlet />'
          ? match
          : `<${provider}>${match}</${provider}>`,
      )
      providerContent += `\nimport { ${provider} } from '@/${opts.api}/react'`
    }

    const needsAuth = ['basic-auth', 'next-auth'].includes(opts.auth)
    if (needsAuth) {
      providerContent = providerContent.replace(/{children}/g, (match) =>
        providerContent.includes('{children}') && match === '<Outlet />'
          ? match
          : `<SessionProvider>${match}</SessionProvider>`,
      )
      providerContent += `\nimport { SessionProvider } from '@{{ name }}/auth/react'`
    }

    await fs.writeFile(providerFile, providerContent)
  } catch {
    // Handle errors silently
  }
}

const appMap = new Map([
  ['nextjs', 'react-nextjs'],
  ['react-router', 'react-router'],
  ['tanstack-start', 'react-start'],
  ['expo', 'react-native'],
])

const API_ROUTES_DIR = {
  nextjs: 'apps/nextjs/app/api',
  'react-router': 'apps/react-router/src/routes/api',
  'tanstack-start': 'apps/tanstack-start/src/routes/api',
} as const

const API_ROUTES_CONTENT = {
  nextjs: {
    api: {
      trpc: `export { handler as GET, handler as POST, handler as OPTIONS } from '@{{ name }}/api'`,
      orpc: `export { handler as GET, handler as POST, handler as OPTIONS } from '@{{ name }}/api'`,
    },
    auth: {
      'basic-auth': `export { handler as GET, handler as POST, handler as OPTIONS } from '@{{ name }}/auth'`,
      'better-auth': `export { handler as GET, handler as POST } from '@{{ name }}/auth'`,
      'next-auth': `import { handlers } from '@{{ name }}/auth'\n\nexport const { GET, POST } = handlers`,
    },
  },
  'react-router': {
    api: {
      trpc: `import { handler } from '@{{ name }}/api'\n\nimport type { Route } from './+types/trpc'\n\nexport const loader = ({ request }: Route.LoaderArgs) => handler(request)\nexport const action = ({ request }: Route.ActionArgs) => handler(request)`,
      orpc: `import { handler } from '@{{ name }}/api'\n\nimport type { Route } from './+types/orpc'\n\nexport const loader = ({ request }: Route.LoaderArgs) => handler(request)\nexport const action = ({ request }: Route.ActionArgs) => handler(request)`,
    },
    auth: {
      'basic-auth': `import { handler } from '@{{ name }}/auth'\n\nimport type { Route } from './+types/auth'\n\nexport const loader = ({ request }: Route.LoaderArgs) => handler(request)\nexport const action = ({ request }: Route.ActionArgs) => handler(request)`,
      'better-auth': `import { handler } from '@{{ name }}/auth'\n\nimport type { Route } from './+types/auth'\n\nexport const loader = ({ request }: Route.LoaderArgs) => handler(request)\nexport const action = ({ request }: Route.ActionArgs) => handler(request)`,
      'next-auth': ``,
    },
  },
  'tanstack-start': {
    api: {
      trpc: `import { createFileRoute } from '@tanstack/react-router'\n\nimport { handler } from '@{{ name }}/api'\n\nexport const Route = createFileRoute('/api/trpc/$')({\nserver: {\nhandlers: {\nGET: ({ request }) => handler(request),\nPOST: ({ request }) => handler(request),\nOPTIONS: ({ request }) => handler(request),\n},\n},\n})`,
      orpc: `import { createFileRoute } from '@tanstack/react-router'\n\nimport { handler } from '@{{ name }}/api'\n\nexport const Route = createFileRoute('/api/orpc/$')({\nserver: {\nhandlers: {\nGET: ({ request }) => handler(request),\nPOST: ({ request }) => handler(request),\nOPTIONS: ({ request }) => handler(request),\n},\n},\n})`,
    },
    auth: {
      'basic-auth': `import { createFileRoute } from '@tanstack/react-router'\n\nimport { handler } from '@{{ name }}/auth'\n\nexport const Route = createFileRoute('/api/trpc/$')({\nserver: {\nhandlers: {\nGET: ({ request }) => handler(request),\nPOST: ({ request }) => handler(request),\nOPTIONS: ({ request }) => handler(request),\n},\n},\n})`,
      'better-auth': `import { createFileRoute } from '@tanstack/react-router'\n\nimport { handler } from '@{{ name }}/auth'\n\nexport const Route = createFileRoute('/api/auth/$')({\nserver: {\nhandlers: {\nGET: ({ request }) => handler(request),\nPOST: ({ request }) => handler(request),\n},\n},\n})`,
      'next-auth': ``,
    },
  },
} as const

const PROVIDERS_DIR = {
  nextjs: 'apps/nextjs/components/providers.tsx',
  'react-router': 'apps/react-router/src/components/providers.tsx',
  'tanstack-start': 'apps/tanstack-start/src/components/providers.tsx',
} as const
