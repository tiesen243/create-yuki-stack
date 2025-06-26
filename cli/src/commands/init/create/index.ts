import { exec } from 'node:child_process'
import { promisify } from 'node:util'
import { spinner } from '@clack/prompts'
import pc from 'picocolors'

import type { ProjectOptions } from '@/commands/init/types'
import { getExecutor } from '@/utils/get-package-manager'
import { addApi } from './api'
import { addAuth } from './auth'
import { addBackend } from './backend'
import { addBase } from './base'
import { addDatabase } from './database'
import { addExtras } from './extras'
import { addFrontend } from './frontend'
import { generateReadme } from './generate-readme'
import { replacePlaceholder } from './replace-placeholder'

const execAsync = promisify(exec)

export async function createProject(
  opts: ProjectOptions,
  dest: string,
): Promise<void> {
  const creatingSpinner = spinner()
  creatingSpinner.start(`Creating project ${pc.cyan(`"${opts.name}"`)}...`)

  await addBase(opts)
  await addFrontend(opts)
  await addDatabase(opts)
  await addBackend(opts)
  await addApi(opts)
  await addAuth(opts)
  await addExtras(opts)
  await generateReadme(opts)
  await replacePlaceholder(opts)

  const cwd = process.cwd()
  await execAsync(
    `${getExecutor(opts.packageManager)} sort-package-json@latest package.json apps/*/package.json packages/*/package.json tools/*/package.json`,
    { cwd },
  )

  if (opts.install) {
    creatingSpinner.message(
      `Running ${pc.bold(opts.packageManager)} install...`,
    )
    await execAsync(`${opts.packageManager} install`, { cwd })
    await execAsync(`${opts.packageManager} run format:fix`, { cwd })
  }

  if (opts.git) {
    await execAsync('git init', { cwd })
    await execAsync('git add --all', { cwd })
    await execAsync('git commit -m "Initial commit from Create Yuki Stack"', {
      cwd,
    })
  }

  creatingSpinner.stop(
    `${pc.green('Success!')} Created ${pc.bold(opts.name)} at ${pc.cyan(dest)}`,
  )
}
