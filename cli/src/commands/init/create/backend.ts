import fs from 'node:fs/promises'

import type { ProjectOptions } from '@/commands/init/types'
import { addEnv } from '@/utils/add-env'
import {
  getPackageVersion,
  getPackageVersions,
} from '@/utils/get-package-version'

export async function addBackend(opts: ProjectOptions) {
  if (opts.backend === 'none') return

  const templatePath = new URL('../templates/apps/api/', import.meta.url)
  const apiDir = 'apps/api'
  const srcDir = `${apiDir}/src`
  await fs.mkdir(srcDir, { recursive: true })

  const filesToCopy = [
    { src: 'eslint.config.js', dest: `${apiDir}/eslint.config.js` },
    { src: 'tsconfig.json', dest: `${apiDir}/tsconfig.json` },
    { src: 'turbo.json', dest: `${apiDir}/turbo.json` },
    { src: `src/server.${opts.backend}.ts`, dest: `${srcDir}/server.ts` },
    ...(opts.api === 'eden'
      ? [{ src: 'src/index.ts', dest: `${srcDir}/index.ts` }]
      : []),
  ]
  if (
    opts.backend === 'elysia' &&
    (opts.api === 'eden' || opts.api === 'none')
  ) {
    await fs.mkdir(`${srcDir}/plugins`, { recursive: true })

    if (opts.auth !== 'none')
      filesToCopy.push({
        src: 'src/plugins/auth.ts',
        dest: `${srcDir}/plugins/auth.ts`,
      })
    if (opts.database !== 'none')
      filesToCopy.push({
        src: 'src/plugins/db.ts',
        dest: `${srcDir}/plugins/db.ts`,
      })
  }

  await Promise.all(
    filesToCopy.map(({ src, dest }) =>
      fs.copyFile(new URL(src, templatePath), dest),
    ),
  )

  const packageJson = (await fs
    .readFile(new URL('package.json', templatePath), 'utf-8')
    .then(JSON.parse)) as PackageJson

  await configureBackendDependencies(packageJson, opts)
  packageJson.dependencies = packageJson.dependencies ?? {}
  packageJson.devDependencies = packageJson.devDependencies ?? {}

  if (opts.database !== 'none')
    packageJson.dependencies['@{{ name }}/db'] = 'workspace:*'

  if (opts.auth !== 'none')
    packageJson.dependencies['@{{ name }}/auth'] = 'workspace:*'

  if (opts.packageManager !== 'bun') {
    packageJson.devDependencies = packageJson.devDependencies ?? {}
    packageJson.devDependencies.tsx = await getPackageVersion('tsx')

    packageJson.scripts.dev = 'tsx watch --env-file=../../.env src/server.ts'
    packageJson.scripts.start = 'tsx --env-file=../../.env src/server.ts'

    await modifyServerFileForNonBunEnvironment(opts, `${srcDir}/server.ts`)
  }

  if (opts.backend === 'elysia' && (opts.api === 'eden' || opts.api === 'none'))
    await addElysiaPlugins(opts, srcDir)

  await fs.writeFile(
    `${apiDir}/package.json`,
    JSON.stringify(packageJson, null, 2),
  )

  if (opts.api !== 'none' && opts.api !== 'eden') {
    const serverContent = await fs.readFile(`${srcDir}/server.ts`, 'utf-8')
    let modifiedContent = serverContent
    const appendContent = API_ROUTES[opts.api][opts.backend]
    if (opts.backend === 'hono')
      modifiedContent = modifiedContent.replace(
        /(\nserve\({|\nexport default {)/,
        `${appendContent}\n$1`,
      )
    else
      modifiedContent = modifiedContent.replace(
        '\nserver.listen',
        `${appendContent}\n\nserver.listen`,
      )
    if (modifiedContent !== serverContent)
      await fs.writeFile(`${srcDir}/server.ts`, modifiedContent)
  }

  await addEnv('client', 'NEXT_PUBLIC_API_URL', 'z.optional(z.string())')
}

async function configureBackendDependencies(
  packageJson: PackageJson,
  opts: ProjectOptions,
) {
  const versions = await getPackageVersions([
    'elysia',
    '@elysiajs/cors',
    '@elysiajs/eden',
    '@elysiajs/node',
    'express',
    'cors',
    '@types/express',
    '@types/cors',
    'hono',
    '@hono/node-server',
  ])

  packageJson.dependencies = packageJson.dependencies ?? {}
  packageJson.devDependencies = packageJson.devDependencies ?? {}

  if (opts.backend === 'elysia') {
    packageJson.dependencies.elysia = versions.elysia
    packageJson.dependencies['@elysiajs/cors'] = versions['@elysiajs/cors']

    if (opts.packageManager !== 'bun')
      packageJson.dependencies['@elysiajs/node'] = versions['@elysiajs/node']

    if (opts.api === 'eden')
      packageJson.dependencies['@elysiajs/eden'] = versions['@elysiajs/eden']
  } else if (opts.backend === 'express') {
    packageJson.dependencies.express = versions.express
    packageJson.dependencies.cors = versions.cors
    packageJson.devDependencies['@types/express'] = versions['@types/express']
    packageJson.devDependencies['@types/cors'] = versions['@types/cors']
  } else if (opts.backend === 'hono') {
    packageJson.dependencies.hono = versions.hono

    if (opts.packageManager !== 'bun')
      packageJson.dependencies['@hono/node-server'] =
        versions['@hono/node-server']
  }

  if (opts.api !== 'none')
    packageJson.exports = {
      '.': {
        types: './dist/index.d.ts',
        default: './src/index.ts',
      },
    }
}

async function modifyServerFileForNonBunEnvironment(
  opts: ProjectOptions,
  serverFilePath: string,
) {
  const serverContent = await fs.readFile(serverFilePath, 'utf-8')

  let modifiedContent = serverContent

  if (opts.backend === 'elysia') {
    modifiedContent = `${serverContent.replace(
      /new Elysia\(\{ aot: /g,
      'new Elysia({ adapter: node(), aot: ',
    )}\nimport cors from '@elysiajs/cors'`
  } else if (opts.backend === 'hono') {
    modifiedContent = `${serverContent.replace(
      /export default {\n\s*fetch: server\.fetch,\n\s*port: PORT,\n\s*} as const/g,
      'serve({\n  fetch: server.fetch,\n  port: PORT,\n})',
    )}\nimport { serve } from '@hono/node-server'`
  }

  if (modifiedContent !== serverContent)
    await fs.writeFile(serverFilePath, modifiedContent)
}

async function addElysiaPlugins(opts: ProjectOptions, srcDir: string) {
  const serverContent = await fs.readFile(`${srcDir}/server.ts`, 'utf-8')
  let modifiedContent = serverContent

  if (opts.auth !== 'none') {
    modifiedContent = `${modifiedContent}\nimport { authPlugin } from './plugins/auth'`

    modifiedContent = modifiedContent.replace(
      /\.use\(\s*cors\(\{\s*origin:\s*\[\s*'[^']*',?\s*'[^']*',?\s*'[^']*',?\s*\],\s*credentials:\s*true,?\s*\}\),?\s*\)/,
      (match) => `${match}\n  .use(authPlugin)`,
    )
  }

  if (opts.database !== 'none') {
    modifiedContent = `${modifiedContent}\nimport { dbPlugin } from './plugins/db'`

    modifiedContent = modifiedContent.replace(
      /\.use\(\s*cors\(\{\s*origin:\s*\[\s*'[^']*',?\s*'[^']*',?\s*'[^']*',?\s*\],\s*credentials:\s*true,?\s*\}\),?\s*\)/,
      (match) => `${match}\n  .use(dbPlugin)`,
    )
  }

  if (modifiedContent !== serverContent)
    await fs.writeFile(`${srcDir}/server.ts`, modifiedContent)
}

const API_ROUTES = {
  trpc: {
    elysia: `  .all('/trpc/*', async ({ request }) => {\n    let response: Response\n    if (request.method === 'OPTIONS')\n      response = new Response(null, { status: 204 })\n    else\n      response = await fetchRequestHandler({\n        endpoint: '/api/trpc',\n        req: request,\n        router: appRouter,\n        createContext: () => createTRPCContext(request),\n      })\n\n    return response\n  })\n\nimport { fetchRequestHandler } from '@trpc/server/adapters/fetch'\nimport { appRouter } from './routers/_app'\nimport { createTRPCContext } from './trpc'\n`,
    express: `  .use(\n    '/api/trpc',\n    createExpressMiddleware({\n      router: appRouter,\n      createContext: ({ req }) =>\n        createTRPCContext({\n          headers: new Headers(req.headers as Record<string, string>),\n        }),\n    }),\n  )\n\nimport { createExpressMiddleware } from '@trpc/server/adapters/express'\nimport { appRouter } from './routers/_app'\nimport { createTRPCContext } from './trpc'\n`,
    hono: `  .all('/api/trpc/*', async ({ req, newResponse }) => {\n    let response: Response\n    if (req.method === 'OPTIONS') response = new Response(null, { status: 204 })\n    else\n      response = await fetchRequestHandler({\n        endpoint: '/api/trpc',\n        req: req.raw,\n        router: appRouter,\n        createContext: () => createTRPCContext(req.raw),\n      })\n\n    return newResponse(response.body, response)\n  })\n\nimport { fetchRequestHandler } from '@trpc/server/adapters/fetch'\nimport { appRouter } from './routers/_app'\nimport { createTRPCContext } from './trpc'\n`,
  },
  orpc: {
    elysia: `  .all('/orpc/*', async ({ request, status }) => {\n    const handler = new RPCHandler(appRouter, {\n      plugins: [new BatchHandlerPlugin(), new ResponseHeadersPlugin()],\n    })\n\n    const { matched, response } = await handler.handle(request, {\n      prefix: '/api/orpc',\n      context: await createORPCContext(request),\n    })\n\n    if (!matched) return status('Not Found')\n    else return response\n  })\n\nimport { RPCHandler } from '@orpc/server/fetch'\nimport { BatchHandlerPlugin, ResponseHeadersPlugin } from '@orpc/server/plugins'\nimport { createORPCContext } from './orpc'\nimport { appRouter } from './routers/_app'\n`,
    express: `  .use('/api/orpc', async (req, res, next) => {\n    const handler = new RPCHandler(appRouter, {\n      plugins: [new BatchHandlerPlugin(), new ResponseHeadersPlugin()],\n    })\n\n    const { matched } = await handler.handle(req, res, {\n      prefix: '/api/orpc',\n      context: await createORPCContext({\n        headers: new Headers(req.headers as Record<string, string>),\n      }),\n    })\n\n    if (!matched) res.status(404).json({ error: 'Not Found' })\n    else next()\n  })\n\nimport { RPCHandler } from '@orpc/server/node'\nimport { BatchHandlerPlugin, ResponseHeadersPlugin } from '@orpc/server/plugins'\nimport { createORPCContext } from './orpc'\nimport { appRouter } from './routers/_app'\n`,
    hono: `  .all('/api/orpc/*', async ({ req, newResponse, json }) => {\n    const handler = new RPCHandler(appRouter, {\n      plugins: [new BatchHandlerPlugin(), new ResponseHeadersPlugin()],\n    })\n\n    const { matched, response } = await handler.handle(req.raw, {\n      prefix: '/api/orpc',\n      context: await createORPCContext(req.raw),\n    })\n\n    if (!matched) return json({ error: 'Not Found' }, 404)\n    return newResponse(response.body, response)\n  })\n\nimport { RPCHandler } from '@orpc/server/fetch'\nimport { BatchHandlerPlugin, ResponseHeadersPlugin } from '@orpc/server/plugins'\nimport { createORPCContext } from './orpc'\nimport { appRouter } from './routers/_app'\n`,
  },
} as const
