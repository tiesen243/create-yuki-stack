import fs from 'fs/promises'
import * as glob from 'glob'

export async function replaceName(name: string) {
  // Get all files recursively, excluding common directories to avoid
  const files = glob.sync('**/*', {
    ignore: ['turbo/**'],
    nodir: true,
  })

  await Promise.all(
    files.map(async (file) => {
      try {
        const content = await fs.readFile(file, 'utf-8')

        // Check if file contains the placeholder
        if (content.includes('{{ name }}')) {
          const updatedContent = content.replace(/\{\{ name \}\}/g, name)
          await fs.writeFile(file, updatedContent, 'utf-8')
        }
      } catch (error) {
        // Skip binary files or files that can't be read as text
        console.warn(`Skipping file ${file}:`, error)
      }
    }),
  )
}
