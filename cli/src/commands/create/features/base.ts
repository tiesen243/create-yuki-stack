import fs from 'fs/promises'

export async function baseFeatures(packageName: string, dir?: string) {
  await fs.mkdir(`packages/${packageName}`, { recursive: true })

  const basePath = new URL(
    `../templates/packages/${dir ?? packageName}/${dir ?? packageName}`, // dunno why this is needed, but it works
    import.meta.url,
  )

  await fs.copyFile(
    new URL('package.json', basePath),
    `packages/${packageName}/package.json`,
  )

  await fs.copyFile(
    new URL('eslint.config.js', basePath),
    `packages/${packageName}/eslint.config.js`,
  )

  await fs.copyFile(
    new URL('tsconfig.json', basePath),
    `packages/${packageName}/tsconfig.json`,
  )

  await fs.copyFile(
    new URL('turbo.json', basePath),
    `packages/${packageName}/turbo.json`,
  )
}
