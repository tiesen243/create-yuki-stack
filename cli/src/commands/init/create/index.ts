import { spinner } from '@clack/prompts'
import pc from 'picocolors'

import type { ProjectOptions } from '@/commands/init/types'
import { addBase } from './base'
import { completeOperation } from './complete'
import { addDatabase } from './database'
import { addFrontend } from './frontend'

export async function createProject(
  opts: ProjectOptions,
  dest: string,
): Promise<void> {
  const creatingSpinner = spinner()
  creatingSpinner.start(`Creating project ${pc.cyan(`"${opts.name}"`)}...`)

  await addBase(opts)
  await addFrontend(opts)
  await addDatabase(opts)

  creatingSpinner.message(`Running ${pc.bold(opts.packageManager)} install...`)
  await completeOperation(opts)

  creatingSpinner.stop(
    `${pc.green('Success!')} Created ${pc.bold(opts.name)} at ${pc.cyan(dest)}`,
  )
}
