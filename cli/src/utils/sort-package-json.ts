import * as fs from 'fs'
import * as path from 'path'
import * as glob from 'glob'

/**
 * Deeply sort an object or array, with special handling for `exports`
 */
function deepSort(value: unknown, parentPath: string[] = []): unknown {
  if (Array.isArray(value)) {
    return [...(value as unknown[])].sort()
  }

  if (value && typeof value === 'object') {
    const isExportsContext = parentPath.includes('exports')

    const keys = Object.keys(value)
    const sortedKeys = isExportsContext
      ? keys.sort((a, b) => {
          if (a === 'types') return -1
          if (b === 'types') return 1
          if (a === 'default') return 1
          if (b === 'default') return -1
          return a.localeCompare(b)
        })
      : keys.sort()

    const result: Record<string, unknown> = {}
    for (const key of sortedKeys) {
      result[key] = deepSort(value[key as never], [...parentPath, key])
    }
    return result
  }

  return value
}

/**
 * Sort root-level keys using keyOrder, then alphabetically
 */
function sortRootKeys(obj: Record<string, unknown>): Record<string, unknown> {
  const sorted: Record<string, unknown> = {}

  for (const key of keyOrder) {
    if (key in obj) sorted[key] = deepSort(obj[key], [key])
  }

  const remainingKeys = Object.keys(obj)
    .filter((k) => !keyOrder.includes(k))
    .sort()

  for (const key of remainingKeys) sorted[key] = deepSort(obj[key], [key])

  return sorted
}

function sortPackageJsonFile(filePath: string) {
  try {
    const raw = fs.readFileSync(filePath, 'utf-8')
    const json = JSON.parse(raw) as Record<string, unknown>
    const sorted = sortRootKeys(json)
    const output = JSON.stringify(sorted, null, 2) + '\n'
    fs.writeFileSync(filePath, output, 'utf-8')
  } catch {
    // If the file is not valid JSON, skip it
  }
}

function getAllPackageJsonPaths(): string[] {
  const root = path.resolve('package.json')
  const workspaces = glob.sync('{apps,packages,tooling}/**/package.json', {
    absolute: true,
    ignore: ['**/node_modules/**'],
  })
  return [root, ...workspaces]
}

export function sortPackageJson() {
  const paths = getAllPackageJsonPaths()
  paths.forEach(sortPackageJsonFile)
}

const keyOrder = [
  'name',
  'version',
  'private',
  'description',
  'keywords',
  'homepage',
  'bugs',
  'repository',
  'funding',
  'license',
  'author',
  'maintainers',
  'contributors',
  'type',
  'imports',
  'exports',
  'main',
  'module',
  'types',
  'files',
  'workspaces',
  'scripts',
  'prettier',
  'jest',
  'overrides',
  'dependencies',
  'devDependencies',
  'peerDependencies',
  'peerDependenciesMeta',
  'optionalDependencies',
  'bundledDependencies',
  'packageManager',
  'engines',
  'publishConfig',
]
