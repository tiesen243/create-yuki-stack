import { Suspense } from 'react'
import { Form, Link } from 'react-router'

import { auth } from '@yuki/auth'
import { Button } from '@yuki/ui/button'
import { GithubIcon } from '@yuki/ui/icons'
import { Typography } from '@yuki/ui/typography'

import type { Route } from './+types/_index'
import { CreatePost, PostCardSkeleton, PostList } from '@/components/post'
import { HydrateClient } from '@/lib/trpc/react'
import { getQueryClient, trpc } from '@/lib/trpc/server'

export const loader = async ({ request }: Route.LoaderArgs) => {
  await getQueryClient().prefetchQuery(
    trpc(request.headers).post.all.queryOptions(),
  )

  const session = await auth(request)
  return { session }
}

export default function HomePage({
  loaderData: { session },
}: Route.ComponentProps) {
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

        <section className="mt-4 flex flex-col gap-4">
          <h2 className="sr-only">Authenticating Section</h2>

          {!session.user && (
            <Button asChild>
              <Link to="/login">Login</Link>
            </Button>
          )}

          {session.user && (
            <div className="flex justify-between">
              <Typography variant="h5" component="h3">
                Welcome, {session.user.name}
              </Typography>
              <Form action="/api/auth/sign-out" method="POST">
                <Button variant="secondary">Logout</Button>
              </Form>
            </div>
          )}
        </section>

        <section className="mt-4 flex flex-col gap-4">
          <h2 className="sr-only">Posts List Section</h2>

          <CreatePost />

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
