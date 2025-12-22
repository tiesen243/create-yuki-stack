import '@/app/globals.css'

import { cn } from '@{{ name }}/ui'
import { Geist, Geist_Mono } from 'next/font/google'

import { Providers } from '@/components/providers'
import { createMetadata } from '@/lib/metadata'

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
})

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
})

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang='en' suppressHydrationWarning>
      <body
        className={cn(
          'flex min-h-dvh flex-col font-sans antialiased',
          geistSans.variable,
          geistMono.variable,
        )}
      >
        <Providers>{children}</Providers>
      </body>
    </html>
  )
}

export const metadata = createMetadata({ title: 'Next.js' })
