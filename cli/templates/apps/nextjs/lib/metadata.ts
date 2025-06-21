import type { Metadata as NextMetadata } from 'next'

import { getBaseUrl } from '@/lib/utils'

export interface Metadata extends NextMetadata {
  title?: string
}

export function createMetadata(override: Metadata = {}): Metadata {
  const siteName = '{{ name }}'
  const baseUrl = getBaseUrl()

  const title = override.title ? `${override.title} | ${siteName}` : siteName
  const description = 'Generate by Create Yuki Stack'
  const url = override.openGraph?.url
    ? `${baseUrl}${override.openGraph.url}`
    : baseUrl

  const images = [
    { url: '/api/og', alt: 'Open Graph Image' },
    ...(override.openGraph?.images
      ? Array.isArray(override.openGraph.images)
        ? override.openGraph.images
        : [override.openGraph.images]
      : []),
  ]

  return {
    ...override,
    metadataBase: new URL(baseUrl),
    applicationName: siteName,
    title,
    description,
    openGraph: {
      ...override.openGraph,
      title,
      description,
      siteName,
      url,
      images,
    },
    twitter: { card: 'summary_large_image' },
    icons: { icon: '/favicon.ico' },
    alternates: { canonical: url },
  }
}
