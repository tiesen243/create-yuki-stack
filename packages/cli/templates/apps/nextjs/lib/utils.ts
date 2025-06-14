import { env } from '@{{ name }}/env'

export const getBaseUrl = () => {
  if (typeof window !== 'undefined') return window.location.origin
  if (env.VERCEL_PROJECT_PRODUCTION_URL)
    return `https://${env.VERCEL_PROJECT_PRODUCTION_URL}`
  if (env.VERCEL_URL) return `https://${env.VERCEL_URL}`
  // eslint-disable-next-line no-restricted-properties
  return `http://localhost:${process.env.PORT ?? 3000}`
}
