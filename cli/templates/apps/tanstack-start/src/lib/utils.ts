import { env } from '@{{ name }}/validators/env'

export function getBaseUrl(): string {
  if (typeof window !== 'undefined') return window.location.origin
  else if (env.VERCEL_URL) return `https://${env.VERCEL_URL}`
  else if (env.VERCEL_PROJECT_PRODUCTION_URL)
    return `https://${env.VERCEL_PROJECT_PRODUCTION_URL}`
  // eslint-disable-next-line no-restricted-properties
  return `http://localhost:${process.env.PORT ?? 3002}`
}
