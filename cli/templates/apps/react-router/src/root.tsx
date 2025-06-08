import '@/globals.css'

import {
  isRouteErrorResponse,
  Links,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
} from 'react-router'

import { ThemeProvider } from '@{{ name }}/ui'

import type { Route } from './+types/root'
import { createMetadata } from '@/lib/metadata'

export function Layout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <Meta />
        <Links />
      </head>

      <body className="flex min-h-dvh flex-col font-sans antialiased">
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          disableTransitionOnChange
        >
          {children}
        </ThemeProvider>
        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  )
}

export default function App() {
  return <Outlet />
}

export function ErrorBoundary({ error }: Route.ErrorBoundaryProps) {
  let message = 'Oops!'
  let details = 'An unexpected error occurred.'
  let stack: string | undefined

  if (isRouteErrorResponse(error)) {
    message = error.status === 404 ? '404' : 'Error'
    details =
      error.status === 404
        ? 'This page could not be found.'
        : error.statusText || details
  } else if (error instanceof Error) {
    details = error.message
    // eslint-disable-next-line no-restricted-properties
    stack = process.env.NODE_ENV === 'development' ? error.stack : undefined
  }

  return (
    <main className="flex min-h-dvh min-w-1/2 flex-col items-center justify-center">
      <div>
        <h1 className="mr-5 inline-block border-r pr-6 align-top text-2xl leading-12 font-medium">
          {message}
        </h1>
        <div className="inline-block">
          <p className="text-sm leading-12">{details}</p>
        </div>
      </div>

      {stack && (
        <pre className="bg-secondary container mt-4 max-w-2xl overflow-x-auto rounded-md p-4">
          <code>{stack}</code>
        </pre>
      )}
    </main>
  )
}

export const meta = createMetadata()

export const links: Route.LinksFunction = () => [
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
]
