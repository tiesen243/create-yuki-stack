import { Link, useNavigate } from 'react-router'

import { useSession } from '@yuki/auth/react'
import { Button } from '@yuki/ui/button'
import {
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@yuki/ui/card'
import { useForm } from '@yuki/ui/form'
import { Input } from '@yuki/ui/input'
import { toast } from '@yuki/ui/sonner'
import { signInSchema } from '@yuki/validators/auth'

import type { Route } from './+types/_auth.login'

export default function LoginPage(_: Route.ComponentProps) {
  return (
    <>
      <CardHeader>
        <CardTitle>Login</CardTitle>
        <CardDescription>
          Enter your credentials below to login to your account.
        </CardDescription>
      </CardHeader>

      <CardContent>
        <LoginForm />

        <p className="mt-4 text-sm">
          Don&apos;t have an account?{' '}
          <Link to="/register" className="hover:underline">
            Register{' '}
          </Link>{' '}
        </p>
      </CardContent>
    </>
  )
}

const LoginForm: React.FC = () => {
  const navigate = useNavigate()
  const { signIn } = useSession()
  const form = useForm({
    defaultValues: { email: '', password: '' },
    validator: signInSchema,
    onSubmit: (values) => signIn('credentials', values),
    onSuccess: async () => {
      toast.success('You have successfully logged in!')
      await navigate('/')
    },
    onError: (error) => {
      toast.error(error.message)
    },
  })

  return (
    <form
      className="grid gap-4"
      onSubmit={(e) => {
        e.preventDefault()
        e.stopPropagation()
        form.handleSubmit()
      }}
    >
      <form.Field
        name="email"
        render={({ field, meta }) => (
          <div id={meta.id} className="grid gap-2">
            <form.Label>Email</form.Label>
            <form.Control {...field}>
              <Input type="email" placeholder="yuki@example.com" />
            </form.Control>
            <form.Message />
          </div>
        )}
      />

      <form.Field
        name="password"
        render={({ field, meta }) => (
          <div id={meta.id} className="grid gap-2">
            <form.Label>Password</form.Label>
            <form.Control {...field}>
              <Input type="password" placeholder="••••••••" />
            </form.Control>
            <form.Message />
          </div>
        )}
      />

      <Button disabled={form.state.isPending}>Login</Button>
    </form>
  )
}
