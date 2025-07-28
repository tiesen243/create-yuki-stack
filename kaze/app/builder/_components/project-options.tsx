'use client'

import { usePage } from '@/app/builder/_components/context'
import { Checkbox } from '@/components/ui/checkbox'
import { Label } from '@/components/ui/label'

export function ProjectOptions() {
  const { options, handleSetOptions } = usePage()

  return (
    <div className='grid gap-4'>
      <Label htmlFor='install'>
        <Checkbox
          id='install'
          checked={options.install}
          onCheckedChange={(checked) => {
            handleSetOptions('install', checked)
          }}
        />
        Install dependencies after project creation
      </Label>

      <Label htmlFor='git'>
        <Checkbox
          id='git'
          checked={options.git}
          onCheckedChange={(checked) => {
            handleSetOptions('git', checked)
          }}
        />
        Initialize a git repository
      </Label>
    </div>
  )
}
