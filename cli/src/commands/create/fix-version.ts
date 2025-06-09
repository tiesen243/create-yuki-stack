import fs from 'fs/promises'
import * as glob from 'glob'

export async function fixVersion() {
  const patterns = [
    'package.json',
    'apps/*/package.json',
    'packages/*/package.json',
    'tooling/*/package.json',
    'turbo/generators/templates/package.json',
  ]

  const pjFiles = await Promise.all(
    patterns.map((pattern) => glob.sync(pattern)),
  ).then((results) => results.flat())

  await Promise.all(
    pjFiles.map(async (file) => {
      const content = JSON.parse(
        await fs.readFile(file, 'utf-8'),
      ) as PackageJson

      const dependencyTypes = [
        'dependencies',
        'devDependencies',
        'peerDependencies',
      ] as const

      for (const depType of dependencyTypes) {
        const deps = content[depType] as Record<string, string> | undefined
        if (!deps) continue

        for (const [pkg, version] of Object.entries(deps)) {
          if (version.startsWith('catalog:')) deps[pkg] = 'latest'
          else if (version.startsWith('workspace:')) deps[pkg] = '*'
        }
      }

      await fs.writeFile(file, JSON.stringify(content, null, 2))
    }),
  )
}
