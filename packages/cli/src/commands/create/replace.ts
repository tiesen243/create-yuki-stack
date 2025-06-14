import fs from 'fs/promises'
import * as glob from 'glob'

import { getExecutor } from '@/utils/get-package-manager'

export async function replace(name: string, pkm: string) {
  const files = glob.sync('**/*', {
    ignore: ['turbo/**'],
    nodir: true,
  })

  const replacements = new Map([
    ['{{ name }}', name],
    ['{{ pkm }}', pkm],
    ['{{ pkme }}', getExecutor(pkm)],
  ])

  const turboReplacements = new Map([
    ['{{ pkm }}', pkm],
    ['{{ pkme }}', getExecutor(pkm)],
  ])

  const replaceInContent = (
    content: string,
    replacementMap: Map<string, string>,
  ) => {
    let updatedContent = content

    for (const [placeholder, replacement] of replacementMap) {
      if (content.includes(placeholder))
        updatedContent = updatedContent.replace(
          new RegExp(placeholder.replace(/[{}]/g, '\\$&'), 'g'),
          replacement,
        )
    }
    updatedContent = updatedContent.replace(
      /{{ hyphen }}/g,
      pkm === 'npm' ? '--' : '',
    )

    return updatedContent
  }

  await Promise.all([
    ...files.map(async (file) => {
      try {
        const content = await fs.readFile(file, 'utf-8')
        const updatedContent = replaceInContent(content, replacements)

        if (updatedContent !== content)
          await fs.writeFile(file, updatedContent, 'utf-8')
      } catch {
        // Ignore errors for files that cannot be read or written
      }
    }),
    (async () => {
      try {
        const turboGeneratorPath = 'turbo/generators/config.ts'
        const content = await fs.readFile(turboGeneratorPath, 'utf-8')
        const updatedContent = replaceInContent(content, turboReplacements)

        if (updatedContent !== content) {
          await fs.writeFile(turboGeneratorPath, updatedContent, 'utf-8')
        }
      } catch {
        // Ignore errors for turbo generator file
      }
    })(),
  ])
}
