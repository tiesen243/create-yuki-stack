import type { ProjectOptions } from '@/commands/init/types'

import { addEmailMonorepo } from '@/commands/add-email'
import { addGhActions } from '@/commands/add-gh-actions'

export async function addExtras(opts: ProjectOptions): Promise<void> {
  if (opts.extras.includes('gh-actions')) await addGhActions(opts)
  if (opts.extras.includes('email')) await addEmailMonorepo()
}
