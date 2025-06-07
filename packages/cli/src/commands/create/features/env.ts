import fs from 'fs/promises'

import { baseFeatures } from './base'

export async function envFeatures(name: string) {
  await baseFeatures(name, 'env')
  await fs.mkdir('packages/env/src', { recursive: true })
  await fs.copyFile(
    new URL('../templates/packages/env/src/index.ts', import.meta.url),
    'packages/env/src/index.ts',
  )
}
