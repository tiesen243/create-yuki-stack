import fs from 'fs/promises'

interface PackageJson {
  name: string
  workspaces?: string[] | Record<string, string[]>
  packageManager: string
  engines: Record<string, string>
}

export async function copyPackageJson(name: string, packageManager: string) {
  const pjContent = await fs.readFile(
    new URL('../templates/package.json.hbs', import.meta.url),
  )
  await fs.writeFile(
    'package.json',
    pjContent.toString().replace(/{{ name }}/g, name),
    { encoding: 'utf-8' },
  )

  if (packageManager === 'bun') {
    const packageJson = JSON.parse(
      await fs.readFile('package.json', 'utf-8'),
    ) as PackageJson
    packageJson.packageManager = 'bun@1.2.15'
    packageJson.engines = {
      node: '>=22.0.0',
      bun: '>=1.2.15',
    }
    await fs.writeFile('package.json', JSON.stringify(packageJson, null, 2), {
      encoding: 'utf-8',
    })
  } else if (packageManager === 'pnpm') {
    const packageJson = JSON.parse(
      await fs.readFile('package.json', 'utf-8'),
    ) as PackageJson
    delete packageJson.workspaces
    packageJson.packageManager = 'pnpm@10.11.0'
    packageJson.engines = {
      node: '>=22.0.0',
      pnpm: '>=10.11.0',
    }
    await fs.writeFile('package.json', JSON.stringify(packageJson, null, 2), {
      encoding: 'utf-8',
    })
    await fs.copyFile(
      new URL('../templates/pnpm-workspace.yaml', import.meta.url),
      'pnpm-workspace.yaml',
    )
  } else if (packageManager !== 'bun') {
    const packageJson = JSON.parse(
      await fs.readFile('package.json', 'utf-8'),
    ) as PackageJson
    packageJson.workspaces = ['apps/*', 'packages/*', 'tooling/*']

    const version =
      packageManager === 'npm'
        ? '11.4.0'
        : packageManager === 'yarn'
          ? '1.22.22'
          : '1.0.0'
    packageJson.packageManager = `${packageManager}@${version}`
    packageJson.engines = {
      node: '>=22.0.0',
      ...(packageManager === 'npm'
        ? { npm: '>=11.4.0' }
        : { yarn: '>=1.22.22' }),
    }

    await fs.writeFile('package.json', JSON.stringify(packageJson, null, 2), {
      encoding: 'utf-8',
    })
  }
}
