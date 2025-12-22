import type { NextRequest } from 'next/server'

import { ImageResponse } from 'next/og'

import { createMetadata } from '@/lib/metadata'

export const runtime = 'edge'

export function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const defaultMetadata = createMetadata()

    const appName = defaultMetadata.applicationName ?? ''
    const title = searchParams.get('title') ?? defaultMetadata.title ?? ''
    const description =
      searchParams.get('description') ?? defaultMetadata.description ?? ''
    const image = searchParams.get('image') ?? ''
    const logoUrl = `${request.nextUrl.origin}/assets/logo.svg`
    const theme = searchParams.get('theme') ?? 'dark'

    const backgroundColor = theme === 'dark' ? '#000000' : '#fafafa'
    const foregroundColor = theme === 'dark' ? '#ffffff' : '#000000'
    const primaryColor = theme === 'dark' ? '#dbe6f6' : '#14185a'

    return new ImageResponse(
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'flex-start',
          justifyContent: 'space-between',
          gap: '32px',

          width: '100%',
          height: '100%',
          padding: '32px 40px',

          backgroundColor,
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',

              width: '48px',
              height: '48px',
              borderRadius: '8px',

              backgroundColor: primaryColor,
            }}
          >
            <img
              src={logoUrl}
              alt='Logo'
              style={{
                width: '80%',
                height: '80%',
                margin: 0,

                objectFit: 'contain',
                filter: theme === 'dark' ? 'none' : 'invert(1)',
              }}
            />
          </div>

          <h1
            style={{
              fontSize: '28px',
              fontWeight: '500',
              color: foregroundColor,
            }}
          >
            {appName}
          </h1>
        </div>

        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '32px',

            flex: 1,
            width: '100%',
          }}
        >
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'flex-start',

              width: image ? '65%' : '100%',
              height: '100%',
            }}
          >
            <h2
              style={{
                fontSize: '48px',
                lineHeight: '1.1',
                fontWeight: '700',
                color: foregroundColor,

                margin: '0 0 24px 0',
              }}
            >
              {title}
            </h2>
            <p
              style={{
                fontSize: '24px',
                lineHeight: '1.2',
                fontWeight: '400',
                color: foregroundColor,

                height: '100%',
                overflow: 'hidden',
                margin: 0,
                opacity: 0.75,
              }}
            >
              {description}
            </p>
          </div>
          {image && (
            <img
              src={image}
              alt={title}
              style={{
                flex: 1,
                border: `0.5px solid ${foregroundColor}`,
                borderRadius: '16px',
                aspectRatio: '1 / 1',
                objectFit: 'cover',
              }}
            />
          )}
        </div>

        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',

            width: '100%',
          }}
        >
          <div
            style={{
              display: 'flex',
              flexDirection: 'row',
              alignItems: 'center',
              gap: '16px',
            }}
          >
            <hr
              style={{
                width: '60px',
                height: '4px',
                borderRadius: '2px',

                background: `linear-gradient(90deg, ${primaryColor}, ${backgroundColor})`,
              }}
            />
            <p
              style={{
                fontSize: '16px',
                fontWeight: '500',
                color: foregroundColor,

                margin: 0,
                opacity: 0.75,
              }}
            >
              {new URL(request.url).hostname}
            </p>
          </div>
        </div>
      </div>,
      {
        width: 1200,
        height: 630,
      },
    )
  } catch (e: unknown) {
    console.error(e)
    return new Response(`Failed to generate the image`, { status: 500 })
  }
}
