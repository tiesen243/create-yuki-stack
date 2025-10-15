'use client'

import { TerminalIcon } from 'lucide-react'

import { usePage } from '@/app/builder/_components/context'
import { Label } from '@/components/ui/label'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { Typography } from '@/components/ui/typography'
import { cn } from '@/lib/utils'

export function JavaBuildToolSelector() {
  const { options, handleSetOptions } = usePage()
  if (options.backend !== 'spring-boot') return null

  return (
    <section>
      <div className='mb-4 flex items-center gap-2 border-b pb-2'>
        <TerminalIcon />

        <Typography variant='h5' component='h3' className='mb-0'>
          Select Java Build Tool
        </Typography>
      </div>

      <RadioGroup
        defaultValue={options.javaBuildTool}
        onValueChange={(value) => {
          handleSetOptions('javaBuildTool', value)
        }}
        className='grid grid-cols-4 gap-4'
      >
        {javaBuildToolOptions.map((option) => {
          const id = `java-build-tool-${option.id}`

          return (
            <Label
              key={option.id}
              htmlFor={id}
              className={cn(
                'flex h-20 flex-col items-start justify-center rounded-md border bg-card px-4 py-2',
                options.javaBuildTool === option.id && option.color,
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

const javaBuildToolOptions = [
  {
    id: 'gradle',
    label: 'Gradle',
    description: 'A flexible build automation tool for Java projects',
    color: 'border-blue-500 bg-blue-500/20',
  },
  {
    id: 'maven',
    label: 'Maven',
    description: 'A powerful build automation tool for Java projects',
    color: 'border-red-500 bg-red-500/20',
  },
] as const
