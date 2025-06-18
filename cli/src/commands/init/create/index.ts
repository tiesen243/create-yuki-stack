import type { ProjectOptions } from '@/commands/init/types'

export async function createProject(_opts: ProjectOptions): Promise<void> {
  await new Promise((resolve) => setTimeout(resolve, 1000))
}
