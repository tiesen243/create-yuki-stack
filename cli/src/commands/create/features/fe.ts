import fs from 'fs/promises'

import { shadcnConfigs } from './shadcn'

export async function feFeatures(apps: string[], useShadcn: boolean) {
  if (apps.includes('nextjs')) {
    await fs.cp(
      new URL('../templates/apps/nextjs', import.meta.url),
      `apps/nextjs`,
      { recursive: true },
    )
    if (useShadcn) await addShadcnComponents('nextjs')
  }

  if (apps.includes('react-router')) {
    await fs.cp(
      new URL('../templates/apps/react-router', import.meta.url),
      `apps/react-router`,
      { recursive: true },
    )
    if (useShadcn) await addShadcnComponents('react-router')
  }

  if (apps.includes('tanstack-start')) {
    await fs.cp(
      new URL('../templates/apps/tanstack-start', import.meta.url),
      `apps/tanstack-start`,
      { recursive: true },
    )
    if (useShadcn) await addShadcnComponents('tanstack-start')
  }
}

function addShadcnComponents(appName: string): Promise<void> {
  return fs.writeFile(
    `apps/${appName}/components.json`,
    JSON.stringify(shadcnConfigs, null, 2),
    'utf-8',
  )
}
