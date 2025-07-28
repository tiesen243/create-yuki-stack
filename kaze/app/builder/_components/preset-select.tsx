'use client'

import { usePage } from '@/app/builder/_components/context'
import * as presets from '@/app/builder/_page.config'
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'

export const PresetSelect: React.FC = () => {
  const { setOptions } = usePage()
  return (
    <div className='grid max-h-[calc(100dvh-35rem)] gap-4 overflow-y-auto'>
      {Object.entries(presets).map(([key, preset]) => (
        <Card
          key={key}
          className='hover:bg-accent hover:text-accent-foreground cursor-pointer capitalize'
          onClick={() => {
            setOptions(preset.options)
          }}
        >
          <CardHeader>
            <CardTitle>{preset.name}</CardTitle>
            <CardDescription>{preset.description}</CardDescription>
          </CardHeader>
        </Card>
      ))}
    </div>
  )
}
