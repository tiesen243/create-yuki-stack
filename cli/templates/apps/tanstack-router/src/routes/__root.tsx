import {
  createRootRoute,
  HeadContent,
  Outlet,
  Scripts,
} from '@tanstack/react-router'

import { ThemeProvider } from '@{{ name }}/ui'

import globalsCss from '@/globals.css?url'
import { createMetadata } from '@/lib/metadata';

function RootLayout() {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <HeadContent />
      </head>
      <body className="flex min-h-dvh flex-col font-sans antialiased">
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          disableTransitionOnChange
        >
          <Outlet />
        </ThemeProvider>

        <Scripts />
      </body>
    </html>
  )
}

function ErrorBoundary(
  error: Readonly<{ message: string; details: string; stack?: string }>,
) {
  return (
    <main className="flex min-h-dvh min-w-1/2 flex-col items-center justify-center">
      <div>
        <h1 className="mr-5 inline-block border-r pr-6 align-top text-2xl leading-12 font-medium">
          {error.message}
        </h1>
        <div className="inline-block">
          <p className="text-sm leading-12">{error.details}</p>
        </div>
      </div>

      {error.stack && (
        <pre className="bg-secondary container mt-4 max-w-2xl overflow-x-auto rounded-md p-4">
          <code>{error.stack}</code>
        </pre>
      )}
    </main>
  )
}

export const Route = createRootRoute({
  head: () => ({
    meta: createMetadata(),
    links: [
      { rel: 'stylesheet', href: globalsCss },
      { rel: 'preconnect', href: 'https://fonts.googleapis.com' },
      {
        rel: 'preconnect',
        href: 'https://fonts.gstatic.com',
        crossOrigin: 'anonymous',
      },
      {
        rel: 'stylesheet',
        href: 'https://fonts.googleapis.com/css2?family=Geist:wght@100..900&display=swap',
      },
      {
        rel: 'stylesheet',
        href: 'https://fonts.googleapis.com/css2?family=Geist+Mono:wght@100..900&display=swap',
      },
      {
        rel: 'icon',
        type: 'image/x-icon',
        href: 'https://tiesen.id.vn/favicon.ico',
      },
      {
        rel: 'shortcut icon',
        type: 'image/png',
        href: 'https://tiesen.id.vn/favicon-16x16.png',
      },
      {
        rel: 'apple-touch-icon',
        type: 'image/png',
        href: 'https://tiesen.id.vn/apple-touch-icon.png',
      },
    ],
  }),
  component: RootLayout,
  errorComponent: ({ error }) => (
    <ErrorBoundary
      message={error.name}
      details={error.message}
      stack={error.stack}
    />
  ),
  notFoundComponent: () => (
    <ErrorBoundary message="404" details="This page could not be found." />
  ),
})
