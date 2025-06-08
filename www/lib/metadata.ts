import type { Metadata as NextMetadata } from 'next'

import { getBaseUrl } from '@/lib/utils'

type Metadata = Omit<NextMetadata, 'title' | 'keywords'> & {
  title: string
  keywords: string[]
}

export const createMetadata = (override: Partial<Metadata> = {}): Metadata => {
  const siteName = 'Create Yuki Stack'
  const title = override.title ? `${override.title} | ${siteName}` : siteName
  const description =
    override.description ??
    'A CLI tool for scaffolding type-safe, full-stack TypeScript applications with best practices and customizable.'

  const {
    title: _,
    description: __,
    keywords = [],
    openGraph,
    ...restOverride
  } = override
  const { images: ogImages, url: ogUrl, ...restOpenGraph } = openGraph ?? {}
  const url = `${getBaseUrl()}${ogUrl ?? ''}`

  return {
    metadataBase: new URL(getBaseUrl()),
    applicationName: siteName,
    title,
    description,
    keywords: [...keywords, 'Turborepo'],
    openGraph: {
      url,
      title,
      description,
      siteName,
      type: 'website',
      images: [
        ...(Array.isArray(ogImages) ? ogImages : ogImages ? [ogImages] : []),
        { url: '/api/og', alt: 'Yuki' },
      ],
      ...restOpenGraph,
    },
    twitter: {
      card: 'summary_large_image',
      ...override.twitter,
    },
    icons: {
      icon: '/favicon.ico',
      shortcut: '/favicon-16x16.png',
      apple: '/apple-touch-icon.png',
    },
    alternates: {
      canonical: url,
      ...override.alternates,
    },
    ...restOverride,
  }
}
