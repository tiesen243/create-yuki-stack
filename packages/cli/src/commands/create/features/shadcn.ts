import fs from 'fs/promises'

import { baseFeatures } from './base'

export async function shadcnFeatures(name: string, isUse: boolean) {
  await baseFeatures(name, 'ui')

  const basePath = new URL('../templates/packages/ui/ui', import.meta.url)

  await fs.copyFile(
    new URL('postcss.config.js', basePath),
    'packages/ui/postcss.config.js',
  )

  await fs.mkdir('packages/ui/src/components', { recursive: true })

  const packageJsonContent = JSON.parse(
    await fs.readFile('packages/ui/package.json', 'utf-8'),
  ) as {
    exports: Record<string, string | Record<string, string>>
    scripts: Record<string, string>
  }

  if (!isUse) {
    await fs.copyFile(
      new URL('src/tailwind.css', basePath),
      'packages/ui/src/tailwind.css',
    )

    await fs.writeFile(
      'packages/ui/src/components/button.tsx',
      'export function Button() {\n  return <button>Button</button>\n}',
      'utf-8',
    )

    await fs.copyFile(
      new URL('src/lib/utils.ts', basePath),
      'packages/ui/src/index.ts',
    )
    packageJsonContent.exports = {
      '.': {
        types: './dist/index.d.ts',
        default: './src/index.ts',
      },
      './*': {
        types: './dist/components/*.d.ts',
        default: './src/components/*.tsx',
      },
      'tailwind.css': './src/tailwind.css',
    }
  } else {
    const componentsJsonContent = await fs.readFile(
      new URL('components.json.hbs', basePath),
      'utf-8',
    )
    await fs.writeFile(
      'packages/ui/components.json',
      componentsJsonContent.replace(/{{ name }}/g, name),
      'utf-8',
    )

    await fs.cp(new URL('src', basePath), 'packages/ui/src', {
      recursive: true,
      force: true,
    })

    const files = await fs.readdir('packages/ui/src/components')
    for (const file of files) {
      if (file.endsWith('.tsx')) {
        const filePath = `packages/ui/src/components/${file}`
        let content = await fs.readFile(filePath, 'utf-8')
        content = content.replace(/@yuki\/ui/g, `@${name}/ui`)
        await fs.writeFile(filePath, content, 'utf-8')
      }
    }

    packageJsonContent.scripts = {
      ...packageJsonContent.scripts,
      'ui-add':
        'bunx --bun shadcn@latest add && prettier src --write --list-different',
    }
  }

  await fs.writeFile(
    'packages/ui/package.json',
    JSON.stringify(packageJsonContent, null, 2),
    'utf-8',
  )
}
