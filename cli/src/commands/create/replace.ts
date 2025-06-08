import fs from 'fs/promises'
import * as glob from 'glob'

import { getPackageManagerExcecuter } from '@/utils/get-package-manager'

export async function replace(name: string, pkm: string) {
  // Get all files recursively, excluding common directories to avoid
  const files = glob.sync('**/*', {
    ignore: ['turbo/**'],
    nodir: true,
  })

  const replacements = new Map([
    ['{{ name }}', name],
    ['{{ pkm }}', `${pkm} run`],
    ['{{ pkmi }}', `${pkm} install`],
    ['{{ pkme }}', getPackageManagerExcecuter(pkm)],
  ])

  await Promise.all([
    ...files.map(async (file) => {
      try {
        const content = await fs.readFile(file, 'utf-8')

        let updatedContent = content

        // Apply all replacements in a single pass
        for (const [placeholder, replacement] of replacements)
          if (content.includes(placeholder))
            updatedContent = updatedContent.replace(
              new RegExp(placeholder.replace(/[{}]/g, '\\$&'), 'g'),
              replacement,
            )

        await fs.writeFile(file, updatedContent, 'utf-8')
      } catch {
        // Ignore errors for files that cannot be read or written
      }
    }),
    (async () => {
      const turboGeneratorPath = 'turbo/generators/config.ts'
      const content = await fs.readFile(turboGeneratorPath, 'utf-8')

      let updatedContent = content
      replacements.delete('{{ name }}')
      for (const [placeholder, replacement] of replacements)
        if (content.includes(placeholder))
          updatedContent = updatedContent.replace(
            new RegExp(placeholder.replace(/[{}]/g, '\\$&'), 'g'),
            replacement,
          )

      await fs.writeFile(turboGeneratorPath, updatedContent, 'utf-8')
    })(),
  ])
}
