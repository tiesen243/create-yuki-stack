import fs from 'node:fs/promises'
import path from 'node:path'

import type { ProjectOptions } from '@/commands/init/types'
import { getPackageVersion } from '@/utils/get-package-version'

interface AppConfig {
  api: { path: string; auth: string }
  layoutFile: string
}

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

  const deps: Record<string, string> = {}
  if (opts.auth !== 'none') deps['@{{ name }}/auth'] = 'workspace:*'
  if (opts.database !== 'none') deps['@{{ name }}/db'] = 'workspace:*'

  if (opts.api === 'trpc')
    Object.assign(deps, {
      ['@{{ name }}/api']: 'workspace:*',
      '@tanstack/react-query': 'catalog:api',
      '@trpc/client': 'catalog:api',
      '@trpc/tanstack-react-query': 'catalog:api',
    })
  else if (opts.api === 'orpc')
    Object.assign(deps, {
      ['@{{ name }}/api']: 'workspace:*',
      '@tanstack/react-query': 'catalog:api',
      '@orpc/client': 'catalog:api',
      '@orpc/react-query': 'catalog:api',
    })

  const needsTanstackYarnFix =
    opts.frontend.includes('tanstack-start') && opts.packageManager === 'yarn'

  await Promise.all(
    opts.frontend.map((app) =>
      processApp(app, opts, deps, needsTanstackYarnFix),
    ),
  )
}

async function processApp(
  app: ProjectOptions['frontend'][number],
  opts: ProjectOptions,
  workspaceDeps: Record<string, string>,
  needsTanstackYarnFix: boolean,
) {
  const appConfig = getAppConfig(app)

  await Promise.all([
    updatePackageJson(app, workspaceDeps, needsTanstackYarnFix),
    createApiRoutes(app, opts, appConfig),
    addApiClient(app, opts),
    createAuthRoutes(app, opts, appConfig),
    updateLayoutFile(opts, appConfig.layoutFile),
  ])
}

async function updatePackageJson(
  app: string,
  workspaceDeps: Record<string, string>,
  needsTanstackYarnFix: boolean,
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

    if (needsTanstackYarnFix) {
      const viteReactVersion = await getPackageVersion('@vitejs/plugin-react')
      packageJson.devDependencies = {
        ...packageJson.devDependencies,
        '@vitejs/plugin-react': viteReactVersion,
      }
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
  if (opts.api === 'none' || opts.api === 'eden' || opts.backend !== 'none')
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
  if (opts.api !== 'trpc' && opts.api !== 'orpc') return
  const clientPath = `apps/${app}${app !== 'nextjs' ? '/src' : ''}/${opts.api}`

  await fs.cp(
    new URL(`../templates/packages/api/${opts.api}`, import.meta.url),
    clientPath,
    { recursive: true, force: true },
  )

  if (opts.backend !== 'none') {
    const reactContent = await fs.readFile(`${clientPath}/react.tsx`, 'utf-8')
    const modifiedContent = `${reactContent.replace(
      `import { getBaseUrl } from '@/lib/utils'`,
      `import { env } from '@{{ name }}/validators/env'`,
    )}\nfunction getBaseUrl() {\n  if (env.NEXT_PUBLIC_API_URL) return \`https://\${env.NEXT_PUBLIC_API_URL}\`\n  return 'http://localhost:8080'\n}`
    await fs.writeFile(`${clientPath}/react.tsx`, modifiedContent)
  }
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

    if (opts.api === 'trpc' || opts.api === 'orpc') {
      const provider =
        opts.api === 'trpc' ? 'TrpcReactProvider' : 'OrpcReactProvider'

      layoutContent = layoutContent.replace(
        /({children}|<Outlet \/>)/g,
        `<${provider}>$1</${provider}>`,
      )
      layoutContent += `\nimport { ${provider} } from '@/${opts.api}/react'`
    }

    if (opts.auth === 'basic-auth' || opts.auth === 'next-auth') {
      layoutContent = layoutContent.replace(
        /({children}|<Outlet \/>)/g,
        `<SessionProvider>$1</SessionProvider>`,
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
} as const

const LAYOUT_DIR = {
  nextjs: 'apps/nextjs/app/layout.tsx',
  'react-router': 'apps/react-router/src/root.tsx',
  'tanstack-start': 'apps/tanstack-start/src/routes/__root.tsx',
} as const
