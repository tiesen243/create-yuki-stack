'use client'

import { TerminalIcon } from 'lucide-react'

import { usePage } from '@/app/builder/_components/context'
import { Checkbox } from '@/components/ui/checkbox'
import { Label } from '@/components/ui/label'
import { Typography } from '@/components/ui/typography'
import { cn } from '@/lib/utils'

export function FrontendSelector() {
  const { options, handleSetOptions } = usePage()

  return (
    <section>
      <div className='mb-4 flex items-center gap-2 border-b pb-2'>
        <TerminalIcon />

        <Typography variant='h5' component='h3' className='mb-0'>
          Select Frontend Framework
        </Typography>
      </div>

      <div className='grid grid-cols-4 gap-4'>
        {frontendOptions.map((option) => {
          const id = `frontend-${option.id}`

          return (
            <Label
              key={option.id}
              htmlFor={id}
              className={cn(
                'flex h-20 flex-col items-start justify-center rounded-md border bg-card px-4 py-2',
                options.frontend.includes(option.id) && option.color,
              )}
            >
              <Checkbox
                id={id}
                checked={options.frontend.includes(option.id)}
                onCheckedChange={(checked) => {
                  handleSetOptions(
                    'frontend',
                    checked
                      ? [...options.frontend, option.id]
                      : options.frontend.filter((f) => f !== option.id),
                  )
                }}
                hidden
              />
              <span className='text-sm font-semibold'>{option.label}</span>
              <span className='line-clamp-2 flex-1 text-xs text-muted-foreground'>
                {option.description}
              </span>
            </Label>
          )
        })}
      </div>
    </section>
  )
}

const frontendOptions = [
  {
    id: 'nextjs',
    label: 'Next.js',
    description: 'The React Framework for Production',
    color: 'border-primary bg-primary/20',
  },
  {
    id: 'react-router',
    label: 'React Router',
    description:
      'A user‑obsessed, standards‑focused, multi‑strategy router you can deploy anywhere',
    color: 'border-blue-500 bg-blue-500/20',
  },
  {
    id: 'tanstack-start',
    label: 'TanStack Start',
    description:
      'Full-stack React and Solid framework powered by TanStack Router',
    color: 'border-purple-500 bg-purple-500/20',
  },
] as const
