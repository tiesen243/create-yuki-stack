import { exec } from 'node:child_process'
import { promisify } from 'node:util'

import type { ProjectOptions } from '@/commands/init/types'

const execAsync = promisify(exec)

export async function completeOperation(opts: ProjectOptions): Promise<void> {
  if (opts.install)
    await execAsync(`${opts.packageManager} install`, { cwd: process.cwd() })

  if (opts.git) {
    await execAsync('git init', { cwd: process.cwd() })
    await execAsync('git add --all', { cwd: process.cwd() })
    await execAsync('git commit -m "Initial commit from Create Yuki Stack"', {
      cwd: process.cwd(),
    })
  }
}
