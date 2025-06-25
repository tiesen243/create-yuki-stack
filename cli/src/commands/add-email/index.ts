import fs from 'node:fs/promises'

import { procedure } from '@/trpc'
import { addEnv } from '@/utils/add-env'
import { getgetProjectMetadata } from '@/utils/get-project-metadata'

export const addEmailCommand = procedure.mutation(async () => {
  await addEmail()

  const { name } = await getgetProjectMetadata()

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
})

export async function addEmail() {
  const templatePath = new URL('../templates/extras/email/', import.meta.url)
  const destPath = 'packages/email'

  await fs.cp(templatePath, destPath, {
    recursive: true,
  })

  await addEnv('server', 'RESEND_KEY', 'z.string()')
}
