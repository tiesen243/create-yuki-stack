import fs from 'node:fs/promises'

import type { ProjectOptions } from '@/commands/init/types'

export async function addFrontend(opts: ProjectOptions) {
  const templatePath = new URL('../templates/', import.meta.url)

  for (const app of opts.frontend) {
    await fs.cp(new URL(`apps/${app}`, templatePath), `apps/${app}`, {
      recursive: true,
      force: true,
    })
  }
}
