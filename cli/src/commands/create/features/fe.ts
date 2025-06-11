import fs from 'fs/promises'

import { shadcnConfigs } from './shadcn'

const appConfigs = [
  { name: 'nextjs', path: 'nextjs' },
  { name: 'react-router', path: 'react-router' },
  { name: 'tanstack-start', path: 'tanstack-start' },
]

export async function feFeatures(apps: string[], useShadcn: boolean) {
  await Promise.all(
    appConfigs
      .filter((config) => apps.includes(config.name))
      .map(async (config) => {
        await fs.cp(
          new URL(`../templates/apps/${config.path}`, import.meta.url),
          `apps/${config.path}`,
          { recursive: true },
        )
        if (useShadcn) await addShadcnComponents(config.path)
      }),
  )
}

function addShadcnComponents(appName: string): Promise<void> {
  return fs.writeFile(
    `apps/${appName}/components.json`,
    JSON.stringify(shadcnConfigs, null, 2),
    'utf-8',
  )
}
