import { env } from '@{{ name }}/validators/env.next'

export function getBaseUrl(): string {
  if (typeof window !== 'undefined') return window.location.origin
  else if (env.NEXT_PUBLIC_VERCEL_PROJECT_PRODUCTION_URL)
    return `https://${env.NEXT_PUBLIC_VERCEL_PROJECT_PRODUCTION_URL}`
  else if (env.NEXT_PUBLIC_VERCEL_URL)
    return `https://${env.NEXT_PUBLIC_VERCEL_URL}`
  // oxlint-disable-next-line no-process-env
  return `http://localhost:${process.env.PORT ?? 3000}`
}
