import Link from 'next/link'
import {
  ArrowRightIcon,
  CheckCircleIcon,
  RocketIcon,
  StarIcon,
  UsersIcon,
} from 'lucide-react'

import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { GithubIcon } from '@/components/ui/icons'
import { Typography } from '@/components/ui/typography'

export const HeroSection: React.FC = () => (
  <section
    id='hero'
    className='bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-50 py-20 lg:py-32 dark:from-purple-950 dark:via-blue-950 dark:to-indigo-950'
  >
    <div className='container grid items-center gap-12 lg:grid-cols-2'>
      <div className='space-y-8'>
        <div className='space-y-4'>
          <Badge
            variant='secondary'
            className='cursor-pointer bg-purple-100 text-purple-700 hover:bg-purple-200 dark:bg-purple-900 dark:text-purple-300 dark:hover:bg-purple-800'
          >
            <StarIcon />
            Production Ready
          </Badge>

          <Typography variant='h2' component='h1'>
            Build Modern Apps with{' '}
            <span className='bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent'>
              Yuki Stack
            </span>
          </Typography>
          <Typography className='text-muted-foreground'>
            A modern CLI tool for scaffolding fully-typed, full-stack TypeScript
            applications with best practices and customizable technology
            choices.
          </Typography>
        </div>

        <div className='flex flex-col gap-4 sm:flex-row'>
          <Button
            size='lg'
            className='group/get-started bg-gradient-to-r from-purple-600 to-blue-600 text-white hover:from-purple-700 hover:to-blue-700'
            asChild
          >
            <Link href='#getting-started'>
              <RocketIcon /> Get Started
              <ArrowRightIcon className='transition-[translate] ease-in-out group-hover/get-started:translate-x-0.5' />
            </Link>
          </Button>
          <Button variant='outline' size='lg' asChild>
            <Link
              href='https://github.com/tiesen243/create-yuki-stack'
              target='_blank'
              rel='noopener noreferrer'
            >
              <GithubIcon /> View on GitHub
            </Link>
          </Button>
        </div>

        <div className='text-muted-foreground flex items-center space-x-6 text-sm'>
          <div className='flex items-center space-x-1'>
            <StarIcon className='size-4 fill-yellow-400 text-yellow-400' />
            <span>4 stars</span>
          </div>
          <div className='flex items-center space-x-1'>
            <UsersIcon className='size-4' />
            <span>Growing community</span>
          </div>
          <div className='flex items-center space-x-1'>
            <CheckCircleIcon className='size-4 text-green-500' />
            <span>MIT License</span>
          </div>
        </div>
      </div>

      <div className='relative rounded-lg bg-slate-900 p-6 shadow-2xl'>
        <div className='mb-4 flex items-center space-x-2'>
          <div className='size-3 rounded-full bg-red-500' />
          <div className='size-3 rounded-full bg-yellow-500' />
          <div className='size-3 rounded-full bg-green-500' />
        </div>

        <div className='max-h-[500px] overflow-y-auto font-mono text-sm'>
          <div className='mb-2 text-green-400'>
            $ npx create-yuki-stack@latest
          </div>
          <div className='text-muted-foreground mb-1'>│</div>
          <div className='mb-1'>
            ◇ What would you like to name your project?
          </div>
          <div className='text-muted-foreground mb-2'>│ &nbsp;my-yuki-app</div>

          <div className='text-muted-foreground mb-1'>│</div>
          <div className='mb-1'>◇ Which language would you like to use?</div>
          <div className='text-muted-foreground mb-2'>│ &nbsp;TypeScript</div>

          <div className='text-muted-foreground mb-1'>│</div>
          <div className='mb-1'>
            ◇ Which frontend framework would you like to use?
          </div>
          <div className='text-muted-foreground mb-2'>│ &nbsp;Next.js</div>

          <div className='text-muted-foreground mb-1'>│</div>
          <div className='mb-1'>◇ Which database would you like to use?</div>
          <div className='text-muted-foreground mb-2'>│ &nbsp;Drizzle</div>

          <div className='text-muted-foreground mb-1'>│</div>
          <div className='text-muted-foreground mb-1'>
            ◇ Which database adapter would you like to use?
          </div>
          <div className='text-muted-foreground mb-2'>│ &nbsp;None</div>

          <div className='text-muted-foreground mb-1'>│</div>
          <div className='text-muted-foreground mb-1'>
            ◆ Which backend framework would you like to use?
          </div>
          <div className='text-muted-foreground mb-2'>│ &nbsp;None</div>

          <div className='text-muted-foreground mb-1'>│</div>
          <div className='text-muted-foreground mb-1'>
            ◆ Which API framework would you like to use?
          </div>
          <div className='text-muted-foreground mb-2'>│ &nbsp;tRPC</div>

          <div className='text-muted-foreground mb-1'>│</div>
          <div className='text-muted-foreground mb-1'>
            ◇ Which authentication method would you like to use?
          </div>
          <div className='text-muted-foreground mb-2'>│ &nbsp;Basic Auth</div>

          <div className='text-muted-foreground mb-1'>│</div>
          <div className='text-muted-foreground mb-1'>
            ◆ Would you like to add any extra packages?
          </div>
          <div className='text-muted-foreground mb-2'>│ &nbsp;none</div>

          <div className='text-muted-foreground mb-1'>│</div>
          <div className='text-muted-foreground mb-1'>
            ◆ Which package manager would you like to use?
          </div>
          <div className='text-muted-foreground mb-2'>│ &nbsp;Bun</div>

          <div className='text-muted-foreground mb-1'>│</div>
          <div className='text-muted-foreground mb-1'>
            ◆ Would you like to install dependencies?
          </div>
          <div className='text-muted-foreground mb-2'>│ &nbsp;Yes</div>

          <div className='text-muted-foreground mb-1'>│</div>
          <div className='text-muted-foreground mb-1'>
            ◆ Would you like to initialize a Git repository?
          </div>
          <div className='text-muted-foreground mb-2'>│ &nbsp;Yes</div>

          <div className='text-muted-foreground mb-1'>│</div>
          <div>
            ◇ <span className='text-green-400'>Success!</span> Created
            my-yuki-app at{' '}
            <span className='text-green-400'>/path/to/my-yuki-app</span>
          </div>

          <div className='text-muted-foreground mb-1'>│</div>
          <div className='text-muted-foreground mb-1'>└ Next steps:</div>

          <div className='pl-10'>cd my-yuki-app</div>
          <div className='pl-10'>cp .env.example .env</div>
          <div className='pl-10'>bun run dev</div>
        </div>

        <div className='to-muted-foreground dark:to-muted-foreground absolute -right-4 -top-4 size-24 rounded-full bg-gradient-to-br from-purple-800 opacity-20 blur-xl dark:from-purple-400' />
        <div className='from-muted-foreground dark:from-muted-foreground absolute -bottom-4 -left-4 size-32 rounded-full bg-gradient-to-br to-indigo-800 opacity-20 blur-xl dark:to-indigo-400' />
      </div>
    </div>
  </section>
)
