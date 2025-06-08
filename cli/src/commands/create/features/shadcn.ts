import fs from 'fs/promises'

import { baseFeatures } from './base'

export async function shadcnFeatures(name: string, isUse: boolean) {
  await baseFeatures('ui')

  const basePath = new URL('../templates/packages/ui/ui', import.meta.url)

  await fs.copyFile(
    new URL('postcss.config.js', basePath),
    'packages/ui/postcss.config.js',
  )

  await fs.cp(new URL('src', basePath), 'packages/ui/src', {
    recursive: true,
    force: true,
  })

  if (!isUse) {
    await fs.writeFile(
      'packages/ui/src/components/button.tsx',
      `export function Button()\n{\n  return <button>Lick me</button>\n}`,
    )

    const packageJson = JSON.parse(
      await fs.readFile('packages/ui/package.json', 'utf-8'),
    ) as {
      exports: Record<string, unknown>
      dependencies: Record<string, string>
      devDependencies: Record<string, string>
    }

    // remove some dependencies
    delete packageJson.dependencies['@radix-ui/react-slot']
    delete packageJson.dependencies['class-variance-authority']

    await fs.writeFile(
      'packages/ui/package.json',
      JSON.stringify(packageJson, null, 2),
      { encoding: 'utf-8' },
    )
    return
  }

  await fs.copyFile(
    new URL('components.json', basePath),
    'packages/ui/components.json',
  )
}

export const shadcnConfigs = {
  $schema: 'https://ui.shadcn.com/schema.json',
  style: 'new-york',
  rsc: true,
  tsx: true,
  tailwind: {
    config: '',
    css: '../../packages/ui/src/tailwind.css',
    baseColor: 'neutral',
    cssVariables: true,
    prefix: '',
  },
  aliases: {
    components: '@/components',
    hooks: '@/hooks',
    lib: '@/lib',
    utils: '@{{ name }}/ui/utils',
    ui: '@{{ name }}/ui/components',
  },
  iconLibrary: 'lucide',
}
