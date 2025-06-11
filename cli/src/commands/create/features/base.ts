import fs from 'fs/promises'

export async function baseFeatures(
  packageName: string,
  options?: {
    templateDir?: string
    target?: 'apps' | 'packages'
  },
) {
  const dir = options?.templateDir ?? packageName
  const target = options?.target ?? 'packages'

  await fs.mkdir(`${target}/${packageName}`, { recursive: true })

  const basePath = new URL(
    `../templates/packages/${dir}/${dir}`, // dunno why this is needed, but it works
    import.meta.url,
  )

  const filesToCopy = [
    'package.json',
    'eslint.config.js',
    'tsconfig.json',
    'turbo.json',
  ]

  await Promise.all(
    filesToCopy.map((file) =>
      fs.copyFile(new URL(file, basePath), `${target}/${packageName}/${file}`),
    ),
  )
}
