import fs from 'fs/promises'

import { shadcnConfigs } from './shadcn'

export async function feFeatures(apps: string[], useShadcn: boolean) {
  if (apps.includes('nextjs')) {
    await fs.cp(
      new URL('../templates/apps/nextjs', import.meta.url),
      `apps/nextjs`,
      { recursive: true },
    )
    if (useShadcn)
      await fs.writeFile(
        'apps/nextjs/components.json',
        JSON.stringify(shadcnConfigs, null, 2),
        'utf-8',
      )
  }

  if (apps.includes('react-router')) {
    await fs.cp(
      new URL('../templates/apps/react-router', import.meta.url),
      `apps/react-router`,
      { recursive: true },
    )
    if (useShadcn)
      await fs.writeFile(
        'apps/react-router/components.json',
        JSON.stringify(shadcnConfigs, null, 2),
        'utf-8',
      )
  }
}
