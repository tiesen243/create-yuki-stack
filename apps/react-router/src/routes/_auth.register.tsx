import { Link, useNavigate } from 'react-router'

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
import { signUpSchema } from '@yuki/validators/auth'

import { useTRPC } from '@/lib/trpc/react'

export default function RegisterPage() {
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
          <Link to="/login" className="hover:underline">
            Login
          </Link>
        </p>
      </CardContent>
    </>
  )
}

const RegisterForm: React.FC = () => {
  const router = useNavigate()
  const { trpcClient } = useTRPC()

  const form = useForm({
    defaultValues: { name: '', email: '', password: '', confirmPassword: '' },
    validator: signUpSchema,
    onSubmit: trpcClient.auth.signUp.mutate,
    onSuccess: async () => {
      await router('/login')
      toast.success('You have successfully registered!')
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
      {formItems.map((item) => (
        <form.Field
          key={item.name}
          name={item.name}
          render={({ field, meta }) => (
            <div id={meta.id} className="grid gap-2">
              <form.Label>{item.label}</form.Label>
              <form.Control {...field}>
                <Input {...item} />
              </form.Control>
              <form.Message />
            </div>
          )}
        />
      ))}

      <Button disabled={form.state.isPending}>Register</Button>
    </form>
  )
}

const formItems = [
  {
    name: 'name' as const,
    label: 'Name',
    type: 'text',
    placeholder: 'Yuki',
  },
  {
    name: 'email' as const,
    label: 'Email',
    type: 'email',
    placeholder: 'yuki@example.com',
  },
  {
    name: 'password' as const,
    label: 'Password',
    type: 'password',
    placeholder: '••••••••',
  },
  {
    name: 'confirmPassword' as const,
    label: 'Confirm Password',
    type: 'password',
    placeholder: '••••••••',
  },
]
