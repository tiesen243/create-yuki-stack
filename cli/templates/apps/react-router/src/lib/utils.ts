import { env } from '@{{ name }}/validators/env.vite'

export function getBaseUrl(): string {
  if (typeof window !== 'undefined') return window.location.origin
  else if (env.VITE_VERCEL_PROJECT_PRODUCTION_URL)
    return `https://${env.VITE_VERCEL_PROJECT_PRODUCTION_URL}`
  else if (env.VITE_VERCEL_URL) return `https://${env.VITE_VERCEL_URL}`
  // eslint-disable-next-line no-restricted-properties
  return `http://localhost:${process.env.PORT ?? 5173}`
}
