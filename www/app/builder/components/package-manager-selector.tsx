'use client'

import { TerminalIcon } from 'lucide-react'

import { usePage } from '@/app/builder/components/context'
import { Label } from '@/components/ui/label'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { Typography } from '@/components/ui/typography'
import { cn } from '@/lib/utils'

export function PackageManagerSelector() {
  const { options, handleSetOptions } = usePage()

  return (
    <section>
      <div className='mb-4 flex items-center gap-2 border-b pb-2'>
        <TerminalIcon />

        <Typography variant='h5' component='h3' className='mb-0'>
          Select Package Manager
        </Typography>
      </div>

      <RadioGroup
        defaultValue={options.packageManager}
        onValueChange={(value) => {
          handleSetOptions('packageManager', value)
        }}
        className='grid grid-cols-4 gap-4'
      >
        {packageManagerOptions.map((option) => (
          <Label
            key={option.id}
            htmlFor={option.id}
            className={cn(
              'flex h-20 flex-col items-start justify-center rounded-md border bg-card px-4 py-2',
              options.packageManager === option.id && option.color,
            )}
          >
            <RadioGroupItem id={option.id} value={option.id} hidden />
            <span className='text-sm font-semibold'>{option.label}</span>
            <span className='line-clamp-2 flex-1 text-xs text-muted-foreground'>
              {option.description}
            </span>
          </Label>
        ))}
      </RadioGroup>
    </section>
  )
}

const packageManagerOptions = [
  {
    id: 'npm',
    label: 'NPM',
    description: 'The default package manager for Node.js',
    color: 'border-primary bg-primary/20',
  },
  {
    id: 'yarn',
    label: 'Yarn',
    description: 'Safe, stable, reproducible projects',
    color: 'border-blue-500 bg-blue-500/20',
  },
  {
    id: 'pnpm',
    label: 'PNPM',
    description: 'Fast, disk space efficient package manager',
    color: 'border-green-500 bg-green-500/20',
  },
  {
    id: 'bun',
    label: 'Bun',
    description: 'A fast JavaScript all-in-one toolkit',
    color: 'border-purple-500 bg-purple-500/20',
  },
] as const
