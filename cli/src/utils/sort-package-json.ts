import fs from 'fs/promises'
import * as glob from 'glob'

const patterns = [
  'package.json',
  'apps/*/package.json',
  'packages/*/package.json',
]

function sortObject(obj: PackageJson): PackageJson {
  const sorted: Record<string, unknown> = {}

  keyOrder.forEach((key) => {
    if (key in obj) {
      if (
        key === 'scripts' ||
        key === 'dependencies' ||
        key === 'devDependencies' ||
        key === 'peerDependencies' ||
        key === 'optionalDependencies'
      ) {
        const sortedSubObj: Record<string, unknown> = {}
        Object.keys(obj[key] ?? {})
          .sort()
          .forEach(
            (subKey) =>
              (sortedSubObj[subKey] = (obj[key] as Record<string, unknown>)[
                subKey
              ]),
          )
        sorted[key] = sortedSubObj
      } else sorted[key] = obj[key]
    }
  })

  Object.keys(obj).forEach((key) => {
    if (!keyOrder.includes(key)) sorted[key] = obj[key]
  })

  return sorted as PackageJson
}

export async function sortPackageJson() {
  try {
    const files = patterns.flatMap((pattern) => glob.sync(pattern))

    for (const file of files) {
      const content = await fs.readFile(file, 'utf-8')
      const packageJson = JSON.parse(content) as PackageJson

      const sortedPackageJson = sortObject(packageJson)

      await fs.writeFile(
        file,
        JSON.stringify(sortedPackageJson, null, 2) + '\n',
      )
    }
  } catch {
    // Handle errors gracefully
  }
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
