import fs from 'node:fs/promises'
import path from 'node:path'

import * as p from '@clack/prompts'
import pc from 'picocolors'

export async function checkDir(
  dir: string,
): Promise<{ isCurrentDir: boolean; dest: string; projectName: string }> {
  const isCurrentDir = dir === '.'
  const projectName = isCurrentDir ? path.basename(process.cwd()) : dir

  const dest = isCurrentDir ? process.cwd() : `${process.cwd()}/${dir}`
  let shouldPrompt = false
  let existsMessage = ''

  try {
    const stats = await fs.stat(dest)
    if (stats.isDirectory()) {
      const files = await fs.readdir(dest)
      if (files.length > 0) {
        shouldPrompt = true
        existsMessage = isCurrentDir
          ? pc.magenta('Current directory is not empty')
          : pc.magenta(
              `Directory ${pc.cyan(`"${dir}"`)} already exists and is not empty`,
            )
      }
    }
  } catch {
    if (isCurrentDir)
      try {
        const files = await fs.readdir(dest)
        if (files.length > 0) {
          shouldPrompt = true
          existsMessage = pc.magenta('Current directory is not empty')
        }
      } catch {
        // Handle permission errors, etc.
      }
  }

  if (shouldPrompt) {
    const shouldContinue = await p.confirm({
      message: `${existsMessage}. Do you want to continue?`,
      initialValue: false,
    })

    if (!shouldContinue || p.isCancel(shouldContinue)) {
      p.cancel('Operation cancelled')
      process.exit(0)
    }
    await cleanDirectory(dest, isCurrentDir)
  }

  return { isCurrentDir, dest, projectName }
}

async function cleanDirectory(
  dirPath: string,
  isCurrentDir: boolean,
): Promise<void> {
  const spinner = p.spinner()
  spinner.start(`Cleaning directory ${pc.cyan(`"${dirPath}"`)}...`)
  try {
    if (isCurrentDir) {
      const files = await fs.readdir(dirPath)
      await Promise.all(
        files.map(async (file) => {
          const filePath = path.join(dirPath, file)
          const stats = await fs.stat(filePath)
          if (stats.isDirectory())
            await fs.rm(filePath, { recursive: true, force: true })
          else await fs.unlink(filePath)
        }),
      )
    } else {
      await fs.rm(dirPath, { recursive: true, force: true })
      await fs.mkdir(dirPath, { recursive: true })
    }
    spinner.stop(`Directory ${pc.cyan(`"${dirPath}"`)} cleaned successfully.`)
  } catch (error) {
    p.cancel(
      `Failed to clean directory: ${error instanceof Error ? error.message : 'Unknown error'}`,
    )
    process.exit(1)
  }
}
