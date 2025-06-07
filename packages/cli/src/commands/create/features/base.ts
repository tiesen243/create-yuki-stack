import fs from 'fs/promises'

export async function baseFeatures(name: string, packageName: string) {
  await fs.mkdir(`packages/${packageName}`, { recursive: true })

  const basePath = new URL(
    `../templates/packages/${packageName}/${packageName}`, // dunno why this is needed, but it works
    import.meta.url,
  )

  const packageJsonContent = await fs.readFile(
    new URL('package.json.hbs', basePath),
    'utf-8',
  )
  await fs.writeFile(
    `packages/${packageName}/package.json`,
    packageJsonContent.replace(/{{ name }}/g, name),
    'utf-8',
  )

  const eContent = await fs.readFile(
    new URL('eslint.config.js.hbs', basePath),
    'utf-8',
  )
  await fs.writeFile(
    `packages/${packageName}/eslint.config.js`,
    eContent.replace(/{{ name }}/g, name),
    'utf-8',
  )

  const tContent = await fs.readFile(
    new URL('tsconfig.json.hbs', basePath),
    'utf-8',
  )
  await fs.writeFile(
    `packages/${packageName}/tsconfig.json`,
    tContent.replace(/{{ name }}/g, name),
    'utf-8',
  )

  await fs.copyFile(
    new URL('turbo.json', basePath),
    `packages/${packageName}/turbo.json`,
  )
}
