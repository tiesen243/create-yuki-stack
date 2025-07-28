import Link from 'next/link'

import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { ArrowRightIcon, GithubIcon, TerminalIcon } from '@/components/ui/icons'
import { Typography } from '@/components/ui/typography'

export const GettingStartedSection: React.FC = () => (
  <section id='getting-started' className='container py-20'>
    <div className='mb-16 text-center'>
      <Badge variant='outline' className='mb-4'>
        Getting Started
      </Badge>
      <Typography variant='h3' component='h2'>
        Start building in minutes
      </Typography>
      <Typography className='text-muted-foreground'>
        Get up and running with Yuki Stack in just a few simple steps. No
        complex configuration required.
      </Typography>
    </div>

    <div className='mx-auto grid max-w-4xl gap-8 md:grid-cols-3'>
      <div className='text-center'>
        <div className='mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-purple-500 to-blue-500 text-xl font-bold text-white'>
          1
        </div>
        <Typography variant='h6' component='h3'>
          Create Project
        </Typography>
        <div className='mb-4 rounded-lg bg-slate-100 p-4 dark:bg-slate-900'>
          <code className='text-sm text-green-400'>
            npx create-yuki-stack@latest
          </code>
        </div>
        <Typography className='text-muted-foreground'>
          Run the CLI command to scaffold your new project with all dependencies
          and configurations.
        </Typography>
      </div>

      <div className='text-center'>
        <div className='mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-blue-500 to-indigo-500 text-xl font-bold text-white'>
          2
        </div>
        <Typography variant='h6' component='h3'>
          Setup Environment
        </Typography>
        <div className='mb-4 rounded-lg bg-slate-100 p-4 dark:bg-slate-900'>
          <code className='text-sm text-green-400'>cp .env.example .env</code>
        </div>
        <Typography className='text-muted-foreground'>
          Copy the environment example file and configure your database and
          authentication settings.
        </Typography>
      </div>

      <div className='text-center'>
        <div className='mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-indigo-500 to-purple-500 text-xl font-bold text-white'>
          3
        </div>
        <Typography variant='h6' component='h3'>
          Start Development Server
        </Typography>
        <div className='mb-4 rounded-lg bg-slate-100 p-4 dark:bg-slate-900'>
          <code className='text-sm text-green-400'>npm run dev</code>
        </div>
        <Typography className='text-muted-foreground'>
          Start the development server and begin building your amazing
          application.
        </Typography>
      </div>
    </div>

    <div className='mt-12 flex items-center justify-center gap-4'>
      <Button
        size='lg'
        className='group/view-document bg-gradient-to-r from-purple-600 to-blue-600 text-white hover:from-purple-700 hover:to-blue-700 dark:from-purple-700 dark:to-blue-700'
        asChild
      >
        <Link href='/builder'>
          <TerminalIcon /> Stack Builder
          <ArrowRightIcon className='transition-[translate] ease-in-out group-hover/view-document:translate-x-0.5' />
        </Link>
      </Button>

      <Button
        size='lg'
        variant='outline'
        className='group/view-document'
        asChild
      >
        <Link
          href='https://github.com/tiesen243/create-yuki-stack'
          target='_blank'
          rel='noopener noreferrer'
        >
          <GithubIcon /> View Documentation
          <ArrowRightIcon className='transition-[translate] ease-in-out group-hover/view-document:translate-x-0.5' />
        </Link>
      </Button>
    </div>
  </section>
)
