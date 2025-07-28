'use client'

import { TerminalIcon } from 'lucide-react'

import { usePage } from '@/app/builder/_components/context'
import { Checkbox } from '@/components/ui/checkbox'
import { Label } from '@/components/ui/label'
import { Typography } from '@/components/ui/typography'
import { cn } from '@/lib/utils'

export function ExtrasSelector() {
  const { options, handleSetOptions } = usePage()

  return (
    <section>
      <div className='mb-4 flex items-center gap-2 border-b pb-2'>
        <TerminalIcon />

        <Typography variant='h5' component='h3' className='mb-0'>
          Select Extra Packages
        </Typography>
      </div>

      <div className='grid grid-cols-4 gap-4'>
        {extrasOptions.map((option) => (
          <Label
            key={option.id}
            htmlFor={option.id}
            className={cn(
              'bg-card flex h-20 flex-col items-start justify-center rounded-md border px-4 py-2',
              options.extras.includes(option.id) && option.color,
            )}
          >
            <Checkbox
              id={option.id}
              checked={options.extras.includes(option.id)}
              onCheckedChange={(checked) => {
                handleSetOptions(
                  'extras',
                  checked
                    ? [...options.extras, option.id]
                    : options.extras.filter((f) => f !== option.id),
                )
              }}
              hidden
            />
            <span className='text-sm font-semibold'>{option.label}</span>
            <span className='text-muted-foreground line-clamp-2 flex-1 text-xs'>
              {option.description}
            </span>
          </Label>
        ))}
      </div>
    </section>
  )
}

const extrasOptions = [
  {
    id: 'gh-actions',
    label: 'GitHub Actions',
    description: 'CI/CD pipeline with type checking, linting, and formatting',
    color: 'border-green-500 bg-green-500/20',
  },
  {
    id: 'email',
    label: 'Email',
    description: 'Email service with Resend provider and React Email templates',
    color: 'border-yellow-500 bg-yellow-500/20',
  },
] as const
