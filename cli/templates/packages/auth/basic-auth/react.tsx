import * as React from 'react'
import { useMutation, useQuery } from '@tanstack/react-query'

import type { SessionWithUser } from '@/types'

type SessionContextValue = (
  | { status: 'loading'; session: SessionWithUser }
  | { status: 'unauthenticated'; session: null }
  | {
      status: 'authenticated'
      session: SessionWithUser & { user: NonNullable<SessionWithUser['user']> }
    }
) & {
  signIn: (credentials: {
    email: string
    password: string
  }) => Promise<{ token: string }>

  signOut: () => Promise<void>
}

interface SessionProviderProps {
  children: React.ReactNode
  session?: SessionWithUser
  basePath?: string
}

const SessionContext = React.createContext<SessionContextValue | null>(null)

const useSession = () => {
  const context = React.use(SessionContext)
  if (!context)
    throw new Error('useSession must be used within a SessionProvider')
  return context
}

function SessionProvider(props: Readonly<SessionProviderProps>) {
  const { session, basePath = '/api/auth' } = props

  const { data, isLoading, refetch } = useQuery({
    queryKey: ['auth', 'get-session'],
    initialData: session,
    enabled: !session,
    queryFn: async () => {
      const res = await fetch(`${basePath}/get-session`)
      if (!res.ok) throw new Error('Failed to fetch session')
      return res.json() as Promise<SessionWithUser>
    },
  })

  const { mutateAsync: signIn } = useMutation({
    mutationKey: ['auth', 'sign-in'],
    mutationFn: async (
      credentials: Parameters<SessionContextValue['signIn']>[0],
    ) => {
      const res = await fetch(`${basePath}/sign-in`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(credentials),
      })
      if (!res.ok) throw new Error('Invalid credentials')
      return res.json() as Promise<{ token: string }>
    },
    onSuccess: () => refetch(),
  })

  const { mutateAsync: signOut } = useMutation({
    mutationKey: ['auth', 'sign-out'],
    mutationFn: async () => {
      const res = await fetch(`${basePath}/sign-out`, { method: 'POST' })
      if (!res.ok) throw new Error('Failed to sign out')
    },
    onSuccess: () => refetch(),
  })

  const value = React.useMemo(() => {
    const status = isLoading
      ? 'loading'
      : data?.user
        ? 'authenticated'
        : 'unauthenticated'

    return { status, session: data, signIn, signOut } as SessionContextValue
  }, [data, isLoading, signIn, signOut])

  return <SessionContext value={value}>{props.children}</SessionContext>
}

export { SessionProvider, useSession }
