import { exec } from 'node:child_process'
import fs from 'node:fs/promises'
import { promisify } from 'node:util'
import * as p from '@clack/prompts'

import { procedure } from '@/trpc'
import { addEnv } from '@/utils/add-env'
import { getProjectMetadata } from '@/utils/get-project-metadata'

const execAsync = promisify(exec)

export const addEmailCommand = procedure.mutation(async () => {
  const spinner = p.spinner()
  spinner.start('Adding email package...')

  await addEmail()

  const { name, packageManager } = await getProjectMetadata()

  const needReplaces = [
    'eslint.config.js',
    'package.json',
    'tsconfig.json',
    'src/index.ts',
  ]
  await Promise.all(
    needReplaces.map(async (file) => {
      const filePath = `packages/email/${file}`
      const content = await fs.readFile(filePath, 'utf-8')
      await fs.writeFile(
        filePath,
        content.replace(/{{ name }}/g, name),
        'utf-8',
      )
    }),
  )
  await execAsync(`${packageManager} install`, { cwd: 'packages/email' })

  spinner.stop('Email package added successfully!')
})

export async function addEmail() {
  const templatePath = new URL('../templates/extras/email/', import.meta.url)
  const destPath = 'packages/email'

  await fs.cp(templatePath, destPath, {
    recursive: true,
  })

  await addEnv('server', 'RESEND_KEY', 'z.string()')
}
