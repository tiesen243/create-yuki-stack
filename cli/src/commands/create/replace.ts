import fs from 'fs/promises'
import * as glob from 'glob'

import { getPackageManager } from '@/utils/get-package-manager'

export async function replace(name: string) {
  // Get all files recursively, excluding common directories to avoid
  const files = glob.sync('**/*', {
    ignore: ['turbo/**'],
    nodir: true,
  })

  await Promise.all(
    files.map(async (file) => {
      try {
        const content = await fs.readFile(file, 'utf-8')

        let updatedContent = content

        // Replace placeholders with the provided name
        if (content.includes('{{ name }}'))
          updatedContent = updatedContent.replace(/\{\{ name \}\}/g, name)

        // Replace placeholders with the package manager
        if (content.includes('{{ pkm }}'))
          updatedContent = updatedContent.replace(
            /\{\{ pkm \}\}/g,
            getPackageManager(),
          )

        await fs.writeFile(file, updatedContent, 'utf-8')
      } catch (error) {
        // Skip binary files or files that can't be read as text
        console.warn(`Skipping file ${file}:`, error)
      }
    }),
  )
}
