import fs from 'fs/promises'

export async function copyTooling(name: string) {
  await fs.cp(new URL('../templates/tooling', import.meta.url), 'tooling', {
    recursive: true,
  })

  for (const file of await fs.readdir('tooling')) {
    const packageJsonPath = `tooling/${file}/package.json`
    const content = await fs.readFile(`${packageJsonPath}.hbs`, 'utf-8')
    const updatedContent = content.replace(/{{ name }}/g, name)
    await fs.writeFile(packageJsonPath, updatedContent, 'utf-8')
    await fs.unlink(`${packageJsonPath}.hbs`)
  }

  const prettierPath = 'tooling/prettier/index.js'
  const prettierContent = await fs.readFile(prettierPath, 'utf-8')
  await fs.writeFile(
    prettierPath,
    prettierContent.replace(/{{ name }}/g, name),
    'utf-8',
  )

  const prettierTsconfigPath = 'tooling/prettier/tsconfig.json'
  const prettierTsContent = await fs.readFile(prettierTsconfigPath, 'utf-8')
  await fs.writeFile(
    prettierTsconfigPath,
    prettierTsContent.replace(/{{ name }}/g, name),
    'utf-8',
  )

  const eslintTsconfigPath = 'tooling/eslint/tsconfig.json'
  const eslintContent = await fs.readFile(eslintTsconfigPath, 'utf-8')
  await fs.writeFile(
    eslintTsconfigPath,
    eslintContent.replace(/{{ name }}/g, name),
    'utf-8',
  )
}
