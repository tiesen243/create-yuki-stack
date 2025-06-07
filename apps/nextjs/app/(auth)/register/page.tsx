import type { SearchParams } from 'nuqs'
import Link from 'next/link'

import {
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@yuki/ui/card'

import { loader } from '../_search-params'
import { RegisterForm } from './page.client'

export default async function RegisterPage(props: {
  searchParams: Promise<SearchParams>
}) {
  const { redirectTo } = await loader(props.searchParams)

  return (
    <>
      <CardHeader>
        <CardTitle>Register</CardTitle>
        <CardDescription>
          Enter your credentials below to register for an account.
        </CardDescription>
      </CardHeader>

      <CardContent>
        <RegisterForm />

        <p className="mt-4 text-sm">
          Already have an account?{' '}
          <Link
            href={`/login?redirect_to=${redirectTo}`}
            className="hover:underline"
          >
            Login
          </Link>
        </p>
      </CardContent>
    </>
  )
}
