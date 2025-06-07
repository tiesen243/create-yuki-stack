'use client'

import * as React from 'react'
import * as Linking from 'expo-linking'
import * as Browser from 'expo-web-browser'

import type { SessionResult } from '@yuki/auth'

import { deleteToken, getToken, setToken } from '@/lib/session'
import { getBaseUrl } from '@/lib/utils'

interface SessionContextValue {
  session: SessionResult
  status: 'loading' | 'authenticated' | 'unauthenticated'
  signIn: () => Promise<void>
  signOut: () => Promise<void>
}

const SessionContext = React.createContext<SessionContextValue | undefined>(
  undefined,
)

export function useSession() {
  const ctx = React.use(SessionContext)
  if (!ctx) throw new Error('useSession must be used within a SessionProvider')
  return ctx
}

export function SessionProvider(
  props: Readonly<{
    children: React.ReactNode
  }>,
) {
  const [isLoading, setIsLoading] = React.useState(false)
  const [session, setSession] = React.useState<SessionResult>({
    expires: new Date(),
  })

  const status = React.useMemo(() => {
    if (isLoading) return 'loading' as const
    return session.user
      ? ('authenticated' as const)
      : ('unauthenticated' as const)
  }, [session, isLoading])

  const fetchSession = React.useCallback(
    async (token: string | null): Promise<void> => {
      setIsLoading(true)
      try {
        const res = await fetch(`${getBaseUrl()}/api/auth`, {
          headers: token ? { Authorization: `Bearer ${token}` } : {},
        })
        if (!res.ok) throw new Error(`Failed to fetch session: ${res.status}`)

        const sessionData = (await res.json()) as SessionResult
        setSession(sessionData)
      } catch (error) {
        console.error('Error fetching session:', error)
        setSession({ expires: new Date() })
      } finally {
        setIsLoading(false)
      }
    },
    [],
  )

  React.useEffect(() => {
    void fetchSession(getToken())
  }, [fetchSession])

  const signIn = React.useCallback(async () => {
    const redirectTo = Linking.createURL('/')
    const result = await Browser.openAuthSessionAsync(
      `${getBaseUrl()}/login?redirect_to=${encodeURIComponent(redirectTo)}`,
      redirectTo,
    )

    if (result.type !== 'success') throw new Error('Failed to sign in')
    const url = Linking.parse(result.url)
    const sessionToken = String(url.queryParams?.token)
    if (!sessionToken) throw new Error('No session token found')
    setToken(sessionToken)
    await fetchSession(sessionToken)
  }, [fetchSession])

  const signOut = React.useCallback(async () => {
    await fetch(`${getBaseUrl()}/api/auth/sign-out`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${getToken()}` },
    })

    await deleteToken()
    setSession({ expires: new Date() })
  }, [])

  const value = React.useMemo(
    () => ({
      session,
      status,
      signIn,
      signOut,
    }),
    [session, status, signIn, signOut],
  )

  return <SessionContext value={value}>{props.children}</SessionContext>
}
