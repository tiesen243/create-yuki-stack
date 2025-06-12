import { baseFeatures } from './base'

export async function authFeature() {
  await baseFeatures('auth')
}
