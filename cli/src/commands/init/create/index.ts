import type { ProjectOptions } from '@/commands/init/types'
import { addBase } from './base'
import { completeOperation } from './complete'
import { addFrontend } from './frontend'

export async function createProject(opts: ProjectOptions): Promise<void> {
  await addBase(opts)
  await addFrontend(opts)
  await completeOperation(opts)
}
