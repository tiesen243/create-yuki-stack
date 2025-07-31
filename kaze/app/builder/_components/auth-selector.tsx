'use client'

import * as React from 'react'
import { TerminalIcon } from 'lucide-react'

import { usePage } from '@/app/builder/_components/context'
import { Label } from '@/components/ui/label'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { Typography } from '@/components/ui/typography'
import { cn } from '@/lib/utils'

export function AuthSelector() {
  const { options, handleSetOptions } = usePage()
  if (options.database === 'none') return null

  return (
    <section>
      <div className='mb-4 flex items-center gap-2 border-b pb-2'>
        <TerminalIcon />

        <Typography variant='h5' component='h3' className='mb-0'>
          Select Authentication Method
        </Typography>
      </div>

      <RadioGroup
        defaultValue={options.auth}
        onValueChange={(value) => {
          handleSetOptions('auth', value)
        }}
        className='grid grid-cols-4 gap-4'
      >
        {authOptions(options.frontend).map((option) => {
          const id = `auth-${option.id}`

          return (
            <Label
              key={option.id}
              htmlFor={id}
              className={cn(
                'bg-card flex h-20 flex-col items-start justify-center rounded-md border px-4 py-2',
                options.auth === option.id && option.color,
              )}
            >
              <RadioGroupItem id={id} value={option.id} hidden />
              <span className='text-sm font-semibold'>{option.label}</span>
              <span className='text-muted-foreground line-clamp-2 flex-1 text-xs'>
                {option.description}
              </span>
            </Label>
          )
        })}
      </RadioGroup>
    </section>
  )
}

const authOptions = (frontend: string[]) =>
  [
    {
      id: 'none',
      label: 'None',
      description: 'No authentication method selected',
      color: 'border-primary bg-primary/20',
    },
    {
      id: 'basic-auth',
      label: 'Basic Auth',
      description: 'Basic authentication built from scratch based on Lucia',
      color: 'border-blue-500 bg-blue-500/20',
    },
    {
      id: 'better-auth',
      label: 'Better Auth',
      description:
        'The most comprehensive authentication framework for TypeScript',
      color: 'border-green-500 bg-green-500/20',
    },
    ...(frontend.includes('nextjs') && frontend.length === 1
      ? [
          {
            id: 'next-auth',
            label: 'NextAuth.js',
            description: 'Authentication for Next.js applications',
            color: 'border-purple-500 bg-purple-500/20',
          },
        ]
      : []),
  ] as const
