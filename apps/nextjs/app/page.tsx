import { Suspense } from 'react'
import { cookies, headers } from 'next/headers'
import Link from 'next/link'

import { auth, signOut } from '@yuki/auth'
import { Button } from '@yuki/ui/button'
import { GithubIcon } from '@yuki/ui/icons'
import { Typography } from '@yuki/ui/typography'

import { getQueryClient, HydrateClient, trpc } from '@/lib/trpc/server'
import {
  CreatePost,
  PostCardSkeleton,
  PostList,
  SubscriptionStatus,
} from './page.client'

export default function HomePage() {
  void getQueryClient().prefetchQuery(trpc.post.all.queryOptions())

  return (
    <HydrateClient>
      <main className="container max-w-2xl py-4">
        <Typography variant="h2" className="text-center" component="h1">
          Create
          <span className="text-[#46120d] dark:text-[#a96249]"> Yuki </span>
          Turbo
        </Typography>

        <Typography className="text-center">
          A type-safe fullstack framework for building web applications.
        </Typography>

        <div className="mt-4 flex justify-center">
          <Button variant="outline" size="sm" className="mx-auto" asChild>
            <a
              href="https://github.com/tiesen243/create-yuki-turbo"
              target="_blank"
              rel="noopener noreferrer"
            >
              <GithubIcon /> See on GitHub
            </a>
          </Button>
        </div>

        <AuthShowcase />

        <section className="mt-4 flex flex-col gap-4">
          <h2 className="sr-only">Posts List Section</h2>

          <CreatePost />

          <SubscriptionStatus />

          <Suspense
            fallback={Array.from({ length: 5 }, (_, i) => (
              <PostCardSkeleton key={i} />
            ))}
          >
            <PostList />
          </Suspense>
        </section>
      </main>
    </HydrateClient>
  )
}

const AuthShowcase: React.FC = async () => {
  const session = await auth({ headers: await headers() })

  return (
    <section className="mt-4 flex flex-col gap-4">
      <h2 className="sr-only">Authenticating Section</h2>

      {!session.user && (
        <Button asChild>
          <Link href="/login">Login</Link>
        </Button>
      )}

      {session.user && (
        <div className="flex justify-between">
          <Typography variant="h5" component="h3">
            Welcome, {session.user.name}
          </Typography>
          <form
            action={async () => {
              'use server'
              await signOut({ headers: await headers() })
              ;(await cookies()).delete('auth_token')
            }}
          >
            <Button variant="secondary">Logout</Button>
          </form>
        </div>
      )}
    </section>
  )
}
