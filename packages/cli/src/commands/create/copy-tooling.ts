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
}
