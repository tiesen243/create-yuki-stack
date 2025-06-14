import fs from 'fs/promises'

export async function copyTurbo(name: string) {
  await fs.cp(new URL('../templates/turbo', import.meta.url), 'turbo', {
    recursive: true,
  })
  await fs.copyFile(
    new URL('../templates/turbo.json', import.meta.url),
    'turbo.json',
  )

  const ePath = 'turbo/generators/templates/eslint.config.js.hbs'
  const eContent = await fs.readFile(ePath, 'utf-8')
  await fs.writeFile(ePath, eContent.replace(/{{ name }}/g, name), 'utf-8')

  const pPath = 'turbo/generators/templates/package.json.hbs'
  const pContent = await fs.readFile(pPath, 'utf-8')
  await fs.writeFile(
    pPath,
    pContent.replace(/{{ projectName }}/g, name),
    'utf-8',
  )

  const tPath = 'turbo/generators/templates/tsconfig.json.hbs'
  const tContent = await fs.readFile(tPath, 'utf-8')
  await fs.writeFile(tPath, tContent.replace(/{{ name }}/g, name), 'utf-8')
}
