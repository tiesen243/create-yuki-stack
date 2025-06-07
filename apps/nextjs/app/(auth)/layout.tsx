import { Suspense } from 'react'

import { Card } from '@yuki/ui/card'

import { OauthButtons } from './_oauth-buttons'

export default function AuthLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <main className="container grid min-h-dvh place-items-center">
      <Card className="w-full max-w-md">
        {children}

        <Suspense>
          <OauthButtons />
        </Suspense>
      </Card>
    </main>
  )
}
