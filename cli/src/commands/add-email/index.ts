import { exec } from 'node:child_process'
import fs from 'node:fs/promises'
import { promisify } from 'node:util'

import * as p from '@clack/prompts'
import pc from 'picocolors'

import { procedure } from '@/trpc'
import { addEnv } from '@/utils/add-env'
import { getProjectMetadata } from '@/utils/get-project-metadata'

const execAsync = promisify(exec)

export const addEmailCommand = procedure.mutation(async () => {
  const spinner = p.spinner()
  spinner.start('Adding email package...')

  const { isTurbo } = await getProjectMetadata()

  if (isTurbo) await addEmailMonorepo(spinner)
  else await addEmailMonoapp(spinner)

  spinner.stop(pc.cyan('✓ Email package setup complete!'))
})

export async function addEmailMonorepo(spinner?: ReturnType<typeof p.spinner>) {
  const templatePath = new URL('../templates/extras/email/', import.meta.url)
  const destPath = 'packages/email'

  await fs.cp(templatePath, destPath, { recursive: true })

  await addEnv('RESEND_TOKEN', 'z.string()')

  const { name, packageManager } = await getProjectMetadata()

  const needReplaces = ['package.json', 'tsconfig.json', 'src/index.ts']
  await Promise.all(
    needReplaces.map(async (file) => {
      const filePath = `packages/email/${file}`
      const content = await fs.readFile(filePath, 'utf-8')
      await fs.writeFile(
        filePath,
        content.replaceAll('{{ name }}', name),
        'utf-8',
      )
    }),
  )

  spinner?.message(`Installing dependencies for ${pc.bold('email')}...`)
  await execAsync(`${packageManager} install`, { cwd: 'packages/email' })
}

async function addEmailMonoapp(spinner: ReturnType<typeof p.spinner>) {
  const templatePath = new URL(
    '../templates/extras/email/src/',
    import.meta.url,
  )
  let destPath = 'src/email'
  try {
    await fs.access('src')
  } catch {
    destPath = 'email'
  }

  await fs.mkdir(destPath, { recursive: true })
  await fs.cp(templatePath, destPath, { recursive: true })

  const content = await fs.readFile(`${destPath}/index.ts`, 'utf-8')
  const replacedContent = content
    .replaceAll("import { env } from '@{{ name }}/validators/env'\n\n", '')
    .replaceAll(/env\.(\w+)/g, "process.env.$1 ?? ''")
  await fs.writeFile(`${destPath}/index.ts`, replacedContent, 'utf-8')

  const { packageManager } = await getProjectMetadata()
  spinner.message(`Installing dependencies for ${pc.bold('email')}...`)
  await execAsync(`${packageManager} install resend @react-email/components`, {
    cwd: process.cwd(),
  })
  await execAsync(`${packageManager} install --dev react-email`, {
    cwd: process.cwd(),
  })
}
