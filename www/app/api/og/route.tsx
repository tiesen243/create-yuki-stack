import type { NextRequest } from 'next/server'
import { ImageResponse } from 'next/og'

import { createMetadata } from '@/lib/metadata'
import { getBaseUrl } from '@/lib/utils'

export function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)

  const defaultMeta = createMetadata()
  const title = searchParams.get('title') ?? defaultMeta.title
  const description = searchParams.get('description') ?? defaultMeta.description

  return new ImageResponse(
    (
      <div
        style={{
          fontFamily: 'Geist',
          backgroundColor: '#0c0c0c',
          backgroundImage: `linear-gradient(to top right, #a96249, transparent)`,
        }}
        tw='flex h-full w-full flex-col p-12 text-white'
      >
        <div tw='mb-3 flex flex-row items-center text-white'>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={`${getBaseUrl()}/logo.svg`}
            alt='Logo'
            tw='mr-4 h-20 w-20'
            style={{ filter: 'invert(1)' }}
          />

          <p style={{ fontSize: '56px', fontWeight: 600 }}>
            {defaultMeta.title}
          </p>
        </div>

        <p
          style={{
            fontWeight: 800,
            fontSize: '48px',
          }}
        >
          {String(title)}
        </p>
        <p style={{ fontSize: '32px', color: 'rgba(240,240,240,0.8)' }}>
          {description}
        </p>
      </div>
    ),
    {
      width: 1200,
      height: 630,
    },
  )
}
