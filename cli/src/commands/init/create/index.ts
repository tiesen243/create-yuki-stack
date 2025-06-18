import type { ProjectOptions } from '@/commands/init/types'
import { addBase } from './base'
import { completeOperation } from './complete'

export async function createProject(opts: ProjectOptions): Promise<void> {
  await addBase(opts)
  await completeOperation(opts)
}
