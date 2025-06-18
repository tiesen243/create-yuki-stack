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
  if (opts.api !== 'none' || (opts.backend === 'elysia' && opts.edenTreaty))
    workspaceDeps['@{{ name }}/api'] = 'workspace:*'

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
    }),
  )
}
