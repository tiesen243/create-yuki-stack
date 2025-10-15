'use client'

import { TerminalIcon } from 'lucide-react'

import { usePage } from '@/app/builder/_components/context'
import { Label } from '@/components/ui/label'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { Typography } from '@/components/ui/typography'
import { cn } from '@/lib/utils'

export function DatabaseSelector() {
  const { options, handleSetOptions } = usePage()

  return (
    <section>
      <div className='mb-4 flex items-center gap-2 border-b pb-2'>
        <TerminalIcon />

        <Typography variant='h5' component='h3' className='mb-0'>
          Select Database ORM
        </Typography>
      </div>

      <RadioGroup
        defaultValue={options.database}
        onValueChange={(value) => {
          handleSetOptions('database', value)
        }}
        className='grid grid-cols-4 gap-4'
      >
        {databaseOptions.map((option) => {
          const id = `database-${option.id}`

          return (
            <Label
              key={option.id}
              htmlFor={id}
              className={cn(
                'flex h-20 flex-col items-start justify-center rounded-md border bg-card px-4 py-2',
                options.database.includes(option.id) && option.color,
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

export const DatabaseAdapterSelector = () => {
  const { options, handleSetOptions } = usePage()
  if (options.database === 'none' || options.database === 'mongoose')
    return null

  return (
    <section className='mt-4'>
      <div className='mb-4 flex items-center gap-2 border-b pb-2'>
        <TerminalIcon />

        <Typography variant='h5' component='h3' className='mb-0'>
          Select Database Adapter
        </Typography>
      </div>

      <RadioGroup
        defaultValue={options.databaseAdapter}
        onValueChange={(value) => {
          handleSetOptions('databaseAdapter', value)
        }}
        className='mt-4 grid grid-cols-4 gap-4'
      >
        {databaseAdapterOptions.map((option) => {
          const id = `database-adapter-${option.id}`

          return (
            <Label
              key={option.id}
              htmlFor={id}
              className={cn(
                'flex h-20 flex-col items-start justify-center rounded-md border bg-card px-4 py-2',
                options.databaseAdapter === option.id && option.color,
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

const databaseOptions = [
  {
    id: 'none',
    label: 'None',
    description: 'No database ORM selected',
    color: 'border-primary bg-primary/20',
  },
  {
    id: 'drizzle',
    label: 'Drizzle',
    description:
      'A lightweight and performant TypeScript ORM with developer experience in mind',
    color: 'border-blue-500 bg-blue-500/20',
  },
  {
    id: 'prisma',
    label: 'Prisma',
    description:
      'Ship at lightning speed, and scale to a global audience effortlessly with our next-gen serverless Postgres database',
    color: 'border-green-500 bg-green-500/20',
  },
  {
    id: 'mongoose',
    label: 'Mongoose',
    description: 'Elegant MongoDB object modeling for Node.js',
    color: 'border-purple-500 bg-purple-500/20',
  },
] as const

const databaseAdapterOptions = [
  {
    id: 'none',
    label: 'None',
    description: 'No database adapter selected',
    color: 'border-primary bg-primary/20',
  },
  {
    id: 'neon',
    label: 'Neon',
    description:
      'The database developers trust, on a serverless platform designed to help you build reliable and scalable applications faster',
    color: 'border-green-500 bg-green-500/20',
  },
]
