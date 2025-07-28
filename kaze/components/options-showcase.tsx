'use client'

import {
  CodeIcon,
  DatabaseIcon,
  GitBranchIcon,
  MonitorIcon,
  PackageIcon,
  PlusIcon,
  ServerIcon,
  ShieldIcon,
  ZapIcon,
} from 'lucide-react'

import { Badge } from '@/components/ui/badge'
import { Card, CardHeader, CardTitle } from '@/components/ui/card'
import { Typography } from '@/components/ui/typography'
import { cn } from '@/lib/utils'

export function OptionsShowcase() {
  return (
    <section id='stack' className='bg-secondary py-20'>
      <div className='container mb-16 text-center'>
        <Badge variant='outline' className='mb-4'>
          Customizable Options
        </Badge>
        <Typography variant='h3' component='h2'>
          Choose your perfect stack
        </Typography>
        <Typography className='text-muted-foreground'>
          Mix and match from our carefully curated selection of modern tools and
          frameworks to create your ideal development environment.
        </Typography>
      </div>

      <div className='container grid gap-6 md:grid-cols-2 lg:grid-cols-3'>
        {options.map((option) => (
          <Card
            key={option.category}
            className='hover:border-border border-transparent shadow-md transition-shadow hover:shadow-lg'
          >
            <CardHeader>
              <div className='mb-4 flex items-center space-x-3'>
                <div
                  className={cn(
                    'flex size-10 items-center justify-center rounded-lg',
                    option.color,
                  )}
                >
                  <option.icon className='size-5' />
                </div>
                <CardTitle className='text-lg'>{option.category}</CardTitle>
              </div>
              <div className='flex flex-wrap gap-2'>
                {option.choices.map((choice) => (
                  <Badge key={choice} variant='secondary' className='text-xs'>
                    {choice}
                  </Badge>
                ))}
              </div>
            </CardHeader>
          </Card>
        ))}
      </div>

      <div className='mt-12 text-center'>
        <div className='bg-popover inline-flex items-center space-x-4 rounded-lg p-6 shadow-lg'>
          <div className='flex items-center space-x-2'>
            <PackageIcon className='size-5' />
            <span className='text-sm font-medium'>Package Managers:</span>
          </div>
          <div className='flex space-x-2'>
            {['npm', 'yarn', 'pnpm', 'bun'].map((pm) => (
              <Badge key={pm} variant='outline' className='text-xs'>
                {pm}
              </Badge>
            ))}
          </div>
          <div className='ml-6 flex items-center space-x-2'>
            <GitBranchIcon className='size-5' />
            <span className='text-sm font-medium'>
              Git initialization included
            </span>
          </div>
        </div>
      </div>
    </section>
  )
}

const options = [
  {
    category: 'Language',
    icon: CodeIcon,
    color: 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300',
    choices: ['TypeScript', 'JavaScript'],
  },
  {
    category: 'Frontend',
    icon: MonitorIcon,
    color: 'bg-blue-100 text-blue-700 dark:bg-blue-800 dark:text-blue-300',
    choices: ['Next.js', 'React Router', 'TanStack Start'],
  },
  {
    category: 'Database',
    icon: DatabaseIcon,
    color: 'bg-green-100 text-green-700 dark:bg-green-800 dark:text-green-300',
    choices: ['None', 'Drizzle', 'Prisma', 'Mongoose'],
  },
  {
    category: 'Database Adapter',
    icon: ServerIcon,
    color: 'bg-teal-100 text-teal-700 dark:bg-teal-800 dark:text-teal-300',
    choices: ['None', 'Neon'],
  },
  {
    category: 'Backend',
    icon: ServerIcon,
    color:
      'bg-purple-100 text-purple-700 dark:bg-purple-800 dark:text-purple-300',
    choices: ['None', 'Express', 'Elysia', 'Hono'],
  },
  {
    category: 'API Framework',
    icon: ZapIcon,
    color:
      'bg-orange-100 text-orange-700 dark:bg-orange-800 dark:text-orange-300',
    choices: ['None', 'Eden', 'Hono Client', 'tRPC', 'oRPC'],
  },
  {
    category: 'Authentication',
    icon: ShieldIcon,
    color: 'bg-red-100 text-red-700 dark:bg-red-800 dark:text-red-300',
    choices: ['None', 'Basic Auth', 'Better Auth', 'NextAuth.js'],
  },
  {
    category: 'Extra Packages',
    icon: PlusIcon,
    color:
      'bg-indigo-100 text-indigo-700 dark:bg-indigo-800 dark:text-indigo-300',
    choices: ['GitHub Actions', 'Email Setup'],
  },
]
