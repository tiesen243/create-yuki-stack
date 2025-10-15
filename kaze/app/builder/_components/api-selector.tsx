'use client'

import * as React from 'react'
import { TerminalIcon } from 'lucide-react'

import { usePage } from '@/app/builder/_components/context'
import { Label } from '@/components/ui/label'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { Typography } from '@/components/ui/typography'
import { cn } from '@/lib/utils'

export function ApiSelector() {
  const { options, handleSetOptions } = usePage()
  if (options.backend === 'spring-boot') return null

  return (
    <section>
      <div className='mb-4 flex items-center gap-2 border-b pb-2'>
        <TerminalIcon />

        <Typography variant='h5' component='h3' className='mb-0'>
          Select API Framework
        </Typography>
      </div>

      <RadioGroup
        defaultValue={options.api}
        onValueChange={(value) => {
          handleSetOptions('api', value)
        }}
        className='grid grid-cols-4 gap-4'
      >
        {apiOptions(options.backend).map((option) => {
          const id = `api-${option.id}`

          return (
            <Label
              key={option.id}
              htmlFor={id}
              className={cn(
                'flex h-20 flex-col items-start justify-center rounded-md border bg-card px-4 py-2',
                options.api === option.id && option.color,
              )}
            >
              <RadioGroupItem id={id} value={option.id} hidden />
              <span className='text-sm font-semibold'>{option.label}</span>
              <span className='line-clamp-2 flex-1 text-xs text-muted-foreground'>
                {option.description}
              </span>
            </Label>
          )
        })}
      </RadioGroup>
    </section>
  )
}

const apiOptions = (backend: string) =>
  [
    {
      id: 'none',
      label: 'None',
      description: 'No API framework selected',
      color: 'border-primary bg-primary/20',
    },
    ...(backend === 'elysia'
      ? [
          {
            id: 'eden',
            label: 'Eden Treaty',
            description: 'End-to-end type-safe APIs with Elysia',
            color: 'border-purple-500 bg-purple-500/20',
          },
        ]
      : []),
    ...(backend === 'hono'
      ? [
          {
            id: 'hc',
            label: 'Hono Client',
            description:
              'The RPC feature allows sharing of the API specifications between the server and the client',
            color: 'border-yellow-500 bg-yellow-500/20',
          },
        ]
      : []),
    {
      id: 'trpc',
      label: 'tRPC',
      description:
        'Move Fast and Break Nothing. End-to-end typesafe APIs made easy',
      color: 'border-blue-500 bg-blue-500/20',
    },
    {
      id: 'orpc',
      label: 'oRPC',
      description:
        'Easy to build APIs that are end-to-end type-safe and adhere to OpenAPI standards',
      color: 'border-cyan-500 bg-cyan-500/20',
    },
  ] as const
