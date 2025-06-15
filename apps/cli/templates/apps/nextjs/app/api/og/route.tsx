import type { NextRequest } from 'next/server'
import { ImageResponse } from 'next/og'

import { createMetadata } from '@/lib/metadata'

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
        tw="flex flex-col w-full h-full p-12 text-white"
      >
        <div tw="flex flex-row items-center mb-3 text-white">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={`https://tiesen.id.vn/assets/logo.svg`}
            alt="Logo"
            tw="w-20 h-20 mr-4"
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
    { width: 1200, height: 630 },
  )
}
