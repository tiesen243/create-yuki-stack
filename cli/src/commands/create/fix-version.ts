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
      const content = JSON.parse(await fs.readFile(file, 'utf-8')) as Record<
        string,
        unknown
      >

      const dependencyTypes = [
        'dependencies',
        'devDependencies',
        'peerDependencies',
      ]

      for (const depType of dependencyTypes)
        if (content[depType])
          for (const [pkg, version] of Object.entries(content[depType])) {
            if (typeof version === 'string' && version.startsWith('catalog:'))
              // @ts-expect-error - replace catalog: with latest
              content[depType][pkg] = 'latest'

            if (typeof version === 'string' && version.startsWith('workspace:'))
              // @ts-expect-error - replace workspace: with *
              content[depType][pkg] = '*'
          }

      await fs.writeFile(file, JSON.stringify(content, null, 2))
    }),
  )
}
