import fs from 'fs/promises'

const versionMap = {
  node: '22.0.0',
  npm: '11.4.0',
  yarn: '1.22.0',
  bun: '1.2.15',
  pnpm: '10.11.0',
} as const

export async function copyPackageJson(packageManager: string) {
  const packageJson = JSON.parse(
    await fs.readFile(
      new URL('../templates/package.json', import.meta.url),
      'utf-8',
    ),
  ) as PackageJson

  if (packageManager === 'bun') {
    packageJson.packageManager = `bun@${versionMap.bun}`
    packageJson.engines = {
      node: `>=${versionMap.node}`,
      bun: `>=${versionMap.bun}`,
    }
    await fs.writeFile('package.json', JSON.stringify(packageJson, null, 2), {
      encoding: 'utf-8',
    })
  } else if (packageManager === 'pnpm') {
    delete packageJson.workspaces
    packageJson.packageManager = `pnpm@${versionMap.pnpm}`
    packageJson.engines = {
      node: `>=${versionMap.node}`,
      pnpm: `>=${versionMap.pnpm}`,
    }
    await fs.copyFile(
      new URL('../templates/pnpm-workspace.yaml', import.meta.url),
      'pnpm-workspace.yaml',
    )
  } else if (packageManager !== 'bun') {
    packageJson.workspaces = ['apps/*', 'packages/*', 'tooling/*']

    const version = versionMap[packageManager as keyof typeof versionMap]
    packageJson.packageManager = `${packageManager}@${version}`
    packageJson.engines = {
      node: `>=${versionMap.node}`,
      [packageManager === 'npm' ? 'npm' : 'yarn']: `>=${version}`,
    }
  }

  await fs.writeFile('package.json', JSON.stringify(packageJson, null, 2), {
    encoding: 'utf-8',
  })
}
