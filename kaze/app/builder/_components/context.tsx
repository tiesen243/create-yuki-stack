'use client'

import * as React from 'react'
import { CheckIcon, CopyIcon } from 'lucide-react'

import { Button } from '@/components/ui/button'

export interface PageContextValue {
  options: {
    name: string
    frontend: ('nextjs' | 'react-router' | 'tanstack-start')[]
    database: 'prisma' | 'drizzle' | 'mongoose' | 'none'
    databaseAdapter: 'neon' | 'none'
    backend: 'express' | 'elysia' | 'hono' | 'none'
    api: 'eden' | 'hc' | 'trpc' | 'orpc' | 'none'
    auth: 'basic-auth' | 'better-auth' | 'next-auth' | 'none'
    extras: ('gh-actions' | 'email')[]
    packageManager: 'npm' | 'yarn' | 'pnpm' | 'bun'
    install: boolean
    git: boolean
  }
  setOptions: React.Dispatch<React.SetStateAction<PageContextValue['options']>>
  handleSetOptions: (
    key: keyof PageContextValue['options'],
    value: PageContextValue['options'][keyof PageContextValue['options']],
  ) => void
}

const PageContext = React.createContext<PageContextValue | null>(null)

const usePage = () => {
  const context = React.use(PageContext)
  if (!context) throw new Error('usePage must be used within a PageProvider')
  return context
}

function PageProvider({ children }: Readonly<{ children: React.ReactNode }>) {
  const [options, setOptions] = React.useState<PageContextValue['options']>({
    name: 'my-yuki-app',
    frontend: ['nextjs'],
    database: 'none',
    databaseAdapter: 'none',
    backend: 'none',
    api: 'none',
    auth: 'none',
    extras: [],
    packageManager: 'bun',
    install: true,
    git: true,
  })

  const handleSetOptions = React.useCallback(
    (
      key: keyof PageContextValue['options'],
      value: PageContextValue['options'][keyof PageContextValue['options']],
    ) => {
      setOptions((prev) => ({ ...prev, [key]: value }))
    },
    [],
  )

  const value = React.useMemo(
    () => ({ options, setOptions, handleSetOptions }),
    [handleSetOptions, options],
  )
  return <PageContext value={value}>{children}</PageContext>
}

function BuildPrompt() {
  const [isCopied, setIsCopied] = React.useState(false)
  const { options } = usePage()

  const prompt = React.useMemo(() => {
    let prompt = `${options.packageManager} create yuki-stack@latest ${options.name}`

    if (options.frontend.length > 0)
      prompt += ` --frontend ${options.frontend.join(' ')}`

    if (options.database !== 'none') prompt += ` --database ${options.database}`
    if (options.database === 'prisma' || options.database === 'drizzle')
      prompt += ` --adapter ${options.databaseAdapter}`

    if (options.backend !== 'none') prompt += ` --backend ${options.backend}`
    if (options.api !== 'none') prompt += ` --api ${options.api}`

    if (options.auth !== 'none' && options.database !== 'none')
      prompt += ` --auth ${options.auth}`

    if (options.extras.length > 0)
      prompt += ` --extras ${options.extras.join(' ')}`

    if (options.install) prompt += ' --install'
    if (options.git) prompt += ' --git'

    return prompt
  }, [
    options.api,
    options.auth,
    options.backend,
    options.database,
    options.databaseAdapter,
    options.extras,
    options.frontend,
    options.git,
    options.install,
    options.name,
    options.packageManager,
  ])

  const handleCopy = React.useCallback(async () => {
    await navigator.clipboard.writeText(prompt)
    setIsCopied(true)
    setTimeout(() => {
      setIsCopied(false)
    }, 2000)
  }, [prompt])

  return (
    <div className='flex-1'>
      <div className='flex flex-col items-end gap-4 rounded-md border p-4'>
        <code className='w-full text-sm'>{prompt}</code>

        <Button size='sm' variant='outline' onClick={handleCopy}>
          {isCopied ? <CheckIcon /> : <CopyIcon />}
          Copy
        </Button>
      </div>
    </div>
  )
}

export { PageProvider, usePage, BuildPrompt }
