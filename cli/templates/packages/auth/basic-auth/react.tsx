'use client'

import * as React from 'react'
import { useQuery } from '@tanstack/react-query'

import type { Providers } from '@/config'
import type { Session, User } from '@/types'

type AuthProviders =
  | 'credentials'
  | (Providers extends never ? undefined : Providers)
type SessionResult = Omit<Session, 'token' | 'userAgent' | 'ipAddress'>

type SessionContextValue = {
  signIn: <
    TProvider extends AuthProviders,
    TData extends { token: string; expires: string },
  >(
    provider: TProvider,
    ...args: TProvider extends 'credentials'
      ? [{ identifier: string; password: string }]
      : [{ redirectUrl?: string }?]
  ) => Promise<TData | null>
  signOut: (opts?: { redirectUrl: string }) => Promise<void>
} & (
  | { status: 'loading'; session: SessionResult }
  | { status: 'unauthenticated'; session: SessionResult & { user: null } }
  | { status: 'authenticated'; session: SessionResult & { user: User } }
)

const SessionContext = React.createContext<SessionContextValue | null>(null)

function useSession() {
  const context = React.use(SessionContext)
  if (!context)
    throw new Error('useSession must be used within a SessionProvider')
  return context
}

function SessionProvider({
  session: _session,
  children,
}: Readonly<{ children: React.ReactNode; session?: SessionResult }>) {
  const {
    data: session,
    isLoading,
    refetch,
  } = useQuery({
    queryKey: ['auth', 'session'],
    queryFn: async ({ signal }) => {
      const res = await fetch('/api/auth/get-session', {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
        signal,
      })
      if (!res.ok) return { user: null, expires: new Date() }

      return (await res.json()) as SessionResult
    },
    initialData: _session ?? undefined,
    staleTime: 1000 * 60 * 5, // 5 minutes
  })

  const status = React.useMemo(() => {
    if (isLoading) return 'loading'
    return session?.user ? 'authenticated' : 'unauthenticated'
  }, [isLoading, session])

  const signIn = React.useCallback(
    async <
      TProvider extends AuthProviders,
      TData extends { token: string; expires: string },
    >(
      provider: TProvider,
      ...args: TProvider extends 'credentials'
        ? [{ identifier: string; password: string }]
        : [{ redirectUrl?: string }?]
    ): Promise<TData | null> => {
      if (provider === 'credentials') {
        const res = await fetch('/api/auth/sign-in', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(args[0]),
        })

        if (!res.ok) {
          const text = await res.text()
          throw new Error(text)
        } else {
          await refetch()
          const json = (await res.json()) as TData
          return json
        }
      } else {
        const redirectUrl = (args[0] as { redirectUrl?: string }).redirectUrl
        window.location.href = `/api/auth/${provider}${
          redirectUrl ? `?redirectUrl=${encodeURIComponent(redirectUrl)}` : ''
        }`
        return null
      }
    },
    [refetch],
  )

  const signOut = React.useCallback(
    async (opts?: { redirectUrl: string }) => {
      await fetch('/api/auth/sign-out', { method: 'POST' })
      await refetch()
      if (opts?.redirectUrl) window.location.href = opts.redirectUrl
    },
    [refetch],
  )

  const value = React.useMemo(
    () => ({ status, session, signIn, signOut }),
    [status, session, signIn, signOut],
  ) as SessionContextValue

  return <SessionContext value={value}>{children}</SessionContext>
}

export { useSession, SessionProvider }
