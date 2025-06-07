'use client'

import { useRouter } from 'next/navigation'
import { useQueryStates } from 'nuqs'

import { Button } from '@yuki/ui/button'
import { useForm } from '@yuki/ui/form'
import { Input } from '@yuki/ui/input'
import { toast } from '@yuki/ui/sonner'
import { signUpSchema } from '@yuki/validators/auth'

import { useTRPC } from '@/lib/trpc/react'
import { redirect } from '../_search-params'

export const RegisterForm: React.FC = () => {
  const [{ redirectTo }] = useQueryStates(redirect.parsers, redirect.configs)
  const { trpcClient } = useTRPC()
  const router = useRouter()

  const form = useForm({
    defaultValues: { name: '', email: '', password: '', confirmPassword: '' },
    validator: signUpSchema,
    onSubmit: trpcClient.auth.signUp.mutate,
    onSuccess: () => {
      toast.success('You have successfully registered!')
      router.push(`/login?redirect_to=${redirectTo}`)
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
