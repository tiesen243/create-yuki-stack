import { nextjsFeatures } from './nextjs'

export async function feFeatures(name: string, apps: string[]) {
  if (apps.includes('nextjs')) await nextjsFeatures(name)
}
