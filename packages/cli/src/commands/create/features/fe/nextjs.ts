import fs from 'fs/promises'

export async function nextjsFeatures(name: string) {
  const basePath = new URL('../templates/apps/nextjs/nextjs', import.meta.url)

  await fs.mkdir('apps/nextjs/lib', { recursive: true })

  // Configure files
  const pContent = await fs.readFile(
    new URL('package.json.hbs', basePath),
    'utf-8',
  )
  await fs.writeFile(
    'apps/nextjs/package.json',
    pContent.replace(/{{ name }}/g, name),
    'utf-8',
  )

  const eContent = await fs.readFile(
    new URL('eslint.config.js.hbs', basePath),
    'utf-8',
  )
  await fs.writeFile(
    'apps/nextjs/eslint.config.js',
    eContent.replace(/{{ name }}/g, name),
    'utf-8',
  )

  const nContent = await fs.readFile(
    new URL('next.config.ts.hbs', basePath),
    'utf-8',
  )
  await fs.writeFile(
    'apps/nextjs/next.config.ts',
    nContent.replace(/{{ name }}/g, name),
    'utf-8',
  )

  const pcContent = await fs.readFile(
    new URL('postcss.config.js.hbs', basePath),
    'utf-8',
  )
  await fs.writeFile(
    'apps/nextjs/postcss.config.js',
    pcContent.replace(/{{ name }}/g, name),
    'utf-8',
  )

  const tContent = await fs.readFile(
    new URL('tsconfig.json.hbs', basePath),
    'utf-8',
  )
  await fs.writeFile(
    'apps/nextjs/tsconfig.json',
    tContent.replace(/{{ name }}/g, name),
    'utf-8',
  )

  await fs.copyFile(new URL('turbo.json', basePath), 'apps/nextjs/turbo.json')

  // Copy lib files
  await fs.cp(new URL('lib', basePath), 'apps/nextjs/lib', {
    recursive: true,
    force: true,
  })

  const utilsContent = await fs.readFile('apps/nextjs/lib/utils.ts', 'utf-8')
  await fs.writeFile(
    'apps/nextjs/lib/utils.ts',
    utilsContent.replace(/{{ name }}/g, name),
    'utf-8',
  )

  // Copy app files
  await fs.cp(new URL('app', basePath), 'apps/nextjs/app', {
    recursive: true,
    force: true,
  })

  const layoutContent = await fs.readFile('apps/nextjs/app/layout.tsx', 'utf-8')
  await fs.writeFile(
    'apps/nextjs/app/layout.tsx',
    layoutContent.replace(/@yuki\/ui/g, `@${name}/ui`),
    'utf-8',
  )

  const globalsContent = await fs.readFile(
    'apps/nextjs/app/globals.css',
    'utf-8',
  )
  await fs.writeFile(
    'apps/nextjs/app/globals.css',
    globalsContent.replace(/@yuki\/ui/g, `@${name}/ui`),
    'utf-8',
  )
}
