import type { SearchParams } from 'nuqs'
import { Suspense } from 'react'
import Link from 'next/link'

import {
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@yuki/ui/card'

import { loader } from '../_search-params'
import { LoginForm } from './page.client'

export default async function LoginPage(props: {
  searchParams: Promise<SearchParams>
}) {
  const { redirectTo } = await loader(props.searchParams)

  return (
    <>
      <CardHeader>
        <CardTitle>Login</CardTitle>
        <CardDescription>
          Enter your credentials below to login to your account.
        </CardDescription>
      </CardHeader>

      <CardContent>
        <Suspense>
          <LoginForm />
        </Suspense>

        <p className="mt-4 text-sm">
          Don&apos;t have an account?{' '}
          <Link
            href={`/register?redirect_to=${redirectTo}`}
            className="hover:underline"
          >
            Register
          </Link>
        </p>
      </CardContent>
    </>
  )
}
