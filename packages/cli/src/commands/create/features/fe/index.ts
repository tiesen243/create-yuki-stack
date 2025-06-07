import fs from 'fs/promises'

export async function feFeatures(apps: string[]) {
  if (apps.includes('nextjs'))
    await fs.cp(
      new URL('../templates/apps/nextjs', import.meta.url),
      `apps/nextjs`,
      { recursive: true },
    )
}
