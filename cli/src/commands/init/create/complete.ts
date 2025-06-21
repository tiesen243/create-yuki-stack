import { exec } from 'node:child_process'
import fs from 'node:fs/promises'
import path from 'node:path'
import { promisify } from 'node:util'

import type { ProjectOptions } from '@/commands/init/types'
import { getExecutor } from '@/utils/get-package-manager'

const execAsync = promisify(exec)

export async function completeOperation(opts: ProjectOptions): Promise<void> {
  const cwd = process.cwd()
  const replaceMap = new Map<string, string>([
    ['{{ name }}', opts.name],
    ['{{ pkm }}', opts.packageManager],
    ['{{ pkme }}', getExecutor(opts.packageManager)],
    ['{{ hyphen }}', opts.packageManager === 'npm' ? '--' : ''],
  ])

  await replaceInDirectory(cwd, replaceMap)
  if (opts.packageManager === 'npm' || opts.packageManager === 'yarn')
    await fixYarnAndNpmVersion(cwd)

  await execAsync(
    `${getExecutor(opts.packageManager)} sort-package-json@latest package.json apps/*/package.json packages/*/package.json tools/*/package.json`,
    { cwd },
  )

  if (opts.install) {
    await execAsync(`${opts.packageManager} install`, { cwd })
    await execAsync(`${opts.packageManager} run format:fix`, { cwd })
  }

  if (opts.git) {
    await execAsync('git init', { cwd })
    await execAsync('git add --all', { cwd })
    await execAsync('git commit -m "Initial commit from Create Yuki Stack"', {
      cwd,
    })
  }
}

async function replaceInFile(
  filePath: string,
  replaceMap: Map<string, string>,
): Promise<void> {
  try {
    let content = await fs.readFile(filePath, 'utf-8')

    for (const [placeholder, replacement] of replaceMap)
      content = content.replaceAll(placeholder, replacement)

    await fs.writeFile(filePath, content, 'utf-8')
  } catch {
    // Skip files that can't be read/written (e.g., binary files)
  }
}

async function replaceInDirectory(
  dirPath: string,
  replaceMap: Map<string, string>,
): Promise<void> {
  const entries = await fs.readdir(dirPath, { withFileTypes: true })

  const tasks = entries.map(async (entry) => {
    const fullPath = path.join(dirPath, entry.name)
    if (entry.isDirectory()) return replaceInDirectory(fullPath, replaceMap)
    else if (entry.isFile()) return replaceInFile(fullPath, replaceMap)
  })

  await Promise.all(tasks)
}

async function fixYarnAndNpmVersion(dirPath: string): Promise<void> {
  const entries = await fs.readdir(dirPath, { withFileTypes: true })

  const tasks = entries.map(async (entry) => {
    const fullPath = path.join(dirPath, entry.name)
    if (entry.isDirectory()) return fixYarnAndNpmVersion(fullPath)
    else if (entry.name === 'package.json') return fixPackageJson(fullPath)
  })

  await Promise.all(tasks)
}

async function fixPackageJson(filePath: string): Promise<void> {
  try {
    const packageJson = (await fs
      .readFile(filePath, 'utf-8')
      .then(JSON.parse)) as PackageJson
    let modified = false

    const sectionsToFix = ['dependencies', 'devDependencies'] as const

    for (const section of sectionsToFix) {
      const sectionObj = packageJson[section]
      if (!sectionObj) continue

      for (const [key, value] of Object.entries(sectionObj)) {
        if (typeof value !== 'string') continue
        let newValue = value

        // Replace workspace:* with *
        if (value === 'workspace:*') {
          newValue = '*'
          modified = true
        }

        // Replace catalog: patterns with latest
        else if (value.startsWith('catalog:')) {
          newValue = 'latest'
          modified = true
        }

        if (newValue !== value) sectionObj[key] = newValue
      }
    }

    if (modified)
      await fs.writeFile(
        filePath,
        JSON.stringify(packageJson, null, 2) + '\n',
        'utf-8',
      )
  } catch {
    // Skip files that can't be read/written or parsed
  }
}
