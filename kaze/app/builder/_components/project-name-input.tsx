'use client'

import { usePage } from '@/app/builder/_components/context'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

export function ProjectNameInput() {
  const { options, handleSetOptions } = usePage()

  return (
    <div className='grid gap-2'>
      <Label htmlFor='project-name'>Project Name</Label>
      <Input
        id='project-name'
        value={options.name}
        onChange={(e) => {
          handleSetOptions('name', e.target.value)
        }}
        placeholder='my-yuki-app'
      />
    </div>
  )
}
