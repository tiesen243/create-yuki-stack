import { exec } from 'node:child_process'
import fs from 'node:fs/promises'
import path from 'node:path'
import { promisify } from 'node:util'

import type { ProjectOptions } from '@/commands/init/types'
import { getExecutor } from '@/utils/get-package-manager'

const execAsync = promisify(exec)

export async function completeOperation(opts: ProjectOptions): Promise<void> {
  const replaceMap = new Map<string, string>([
    ['{{ name }}', opts.name],
    ['{{ pkm }}', opts.packageManager],
    ['{{ pkme }}', getExecutor(opts.packageManager)],
  ])

  await replaceInDirectory(process.cwd(), replaceMap)
  if (opts.packageManager === 'npm' || opts.packageManager === 'yarn')
    await fixYarnAndNpmVersion(process.cwd())

  await execAsync(
    `${getExecutor(opts.packageManager)} sort-package-json@latest package.json apps/*/package.json packages/*/package.json tools/*/package.json`,
    { cwd: process.cwd() },
  )

  if (opts.install) {
    await execAsync(`${opts.packageManager} install`, { cwd: process.cwd() })
    await execAsync(`${opts.packageManager} run format:fix`, {
      cwd: process.cwd(),
    })
  }

  if (opts.git) {
    await execAsync('git init', { cwd: process.cwd() })
    await execAsync('git add --all', { cwd: process.cwd() })
    await execAsync('git commit -m "Initial commit from Create Yuki Stack"', {
      cwd: process.cwd(),
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

  for (const entry of entries) {
    const fullPath = path.join(dirPath, entry.name)

    if (entry.isDirectory()) await replaceInDirectory(fullPath, replaceMap)
    else if (entry.isFile()) await replaceInFile(fullPath, replaceMap)
  }
}

async function fixYarnAndNpmVersion(dirPath: string): Promise<void> {
  const entries = await fs.readdir(dirPath, { withFileTypes: true })

  for (const entry of entries) {
    const fullPath = path.join(dirPath, entry.name)

    if (entry.isDirectory()) {
      await fixYarnAndNpmVersion(fullPath)
    } else if (entry.name === 'package.json') {
      await fixPackageJson(fullPath)
    }
  }
}

async function fixPackageJson(filePath: string): Promise<void> {
  try {
    const packageJson = (await fs
      .readFile(filePath, 'utf-8')
      .then(JSON.parse)) as PackageJson
    let modified = false

    const sectionsToFix = ['dependencies', 'devDependencies'] as const

    for (const section of sectionsToFix) {
      if (packageJson[section]) {
        for (const [key, value] of Object.entries(packageJson[section])) {
          if (typeof value === 'string') {
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

            if (newValue !== value) packageJson[section][key] = newValue
          }
        }
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
