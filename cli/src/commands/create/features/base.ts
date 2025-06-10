import fs from 'fs/promises'

export async function baseFeatures(
  packageName: string,
  options?: {
    templateDir?: string
    target?: 'apps' | 'packages'
  },
) {
  const dir = options?.templateDir
  const target = options?.target ?? 'packages'

  await fs.mkdir(`${target}/${packageName}`, { recursive: true })

  const basePath = new URL(
    `../templates/packages/${dir ?? packageName}/${dir ?? packageName}`, // dunno why this is needed, but it works
    import.meta.url,
  )

  await fs.copyFile(
    new URL('package.json', basePath),
    `${target}/${packageName}/package.json`,
  )

  await fs.copyFile(
    new URL('eslint.config.js', basePath),
    `${target}/${packageName}/eslint.config.js`,
  )

  await fs.copyFile(
    new URL('tsconfig.json', basePath),
    `${target}/${packageName}/tsconfig.json`,
  )

  await fs.copyFile(
    new URL('turbo.json', basePath),
    `${target}/${packageName}/turbo.json`,
  )
}
