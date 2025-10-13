import {
  createRootRoute,
  HeadContent,
  Outlet,
  Scripts,
} from '@tanstack/react-router'

import { ThemeProvider } from '@{{ name }}/ui'

import globalsCss from '@/globals.css?url'
import { createMetadata } from '@/lib/metadata'

export const Route = createRootRoute({
  head: () => ({
    meta: createMetadata({ title: 'Tanstack Start' }),
    // prettier-ignore
    links: [
      { rel: 'preconnect', href: 'https://fonts.googleapis.com' },
      { rel: 'preconnect', href: 'https://fonts.gstatic.com', crossOrigin: 'anonymous' },
      { rel: 'stylesheet', href: 'https://fonts.googleapis.com/css2?family=Geist+Mono:wght@100..900&family=Geist:wght@100..900&display=swap' },
      { rel: 'stylesheet', href: globalsCss },
    ],
  }),

  component: RootLayout,
})

function RootLayout() {
  return (
    <html lang='en' suppressHydrationWarning>
      <head>
        <HeadContent />
      </head>
      <body className='flex min-h-dvh flex-col font-sans antialiased'>
        <ThemeProvider attribute='class' disableTransitionOnChange enableSystem>
          <Outlet />
        </ThemeProvider>

        <Scripts />
      </body>
    </html>
  )
}
