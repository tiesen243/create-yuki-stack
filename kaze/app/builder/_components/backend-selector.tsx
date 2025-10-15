'use client'

import * as React from 'react'
import { TerminalIcon } from 'lucide-react'

import { usePage } from '@/app/builder/_components/context'
import { Label } from '@/components/ui/label'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { Typography } from '@/components/ui/typography'
import { cn } from '@/lib/utils'

export function BackendSelector() {
  const { options, handleSetOptions } = usePage()

  return (
    <section>
      <div className='mb-4 flex items-center gap-2 border-b pb-2'>
        <TerminalIcon />

        <Typography variant='h5' component='h3' className='mb-0'>
          Select Backend Framework
        </Typography>
      </div>

      <RadioGroup
        defaultValue={options.backend}
        onValueChange={(value) => {
          handleSetOptions('backend', value)
        }}
        className='grid grid-cols-4 gap-4'
      >
        {backendOptions.map((option) => {
          const id = `backend-${option.id}`

          return (
            <Label
              key={option.id}
              htmlFor={id}
              className={cn(
                'flex h-20 flex-col items-start justify-center rounded-md border bg-card px-4 py-2',
                options.backend === option.id && option.color,
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

const backendOptions = [
  {
    id: 'none',
    label: 'None',
    description: 'No backend framework selected',
    color: 'border-primary bg-primary/20',
  },
  {
    id: 'elysia',
    label: 'Elysia',
    description: 'Ergonomic Framework for Humans & Fox Girls',
    color: 'border-blue-500 bg-blue-500/20',
  },
  {
    id: 'express',
    label: 'Express',
    description: 'Fast, unopinionated, minimalist web framework for Node.js',
    color: 'border-green-500 bg-green-500/20',
  },
  {
    id: 'hono',
    label: 'Hono',
    description:
      'Fast, lightweight, built on Web Standards. Support for any JavaScript runtime',
    color: 'border-yellow-500 bg-yellow-500/20',
  },
  {
    id: 'spring-boot',
    label: 'Spring Boot',
    description:
      'Production-ready Java framework for building web applications',
    color: 'border-red-500 bg-red-500/20',
  },
] as const
