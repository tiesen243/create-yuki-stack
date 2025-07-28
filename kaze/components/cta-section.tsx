import Link from 'next/link'
import { ArrowRightIcon, RocketIcon } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { GithubIcon } from '@/components/ui/icons'
import { Typography } from '@/components/ui/typography'

export const CtaSection: React.FC = () => (
  <section className='container py-20'>
    <Typography variant='h3' component='h2' className='text-center'>
      Ready to build your next project?
    </Typography>
    <Typography className='text-muted-foreground text-center'>
      Join thousands of developers who are building faster and better with Yuki
      Stack. Get started today and see the difference.
    </Typography>

    <div className='mt-10 flex flex-col justify-center gap-4 sm:flex-row'>
      <Button size='lg' className='text-purple-600' asChild>
        <Link href='/builder' className='group/get-started'>
          <RocketIcon /> Get Started Now
          <ArrowRightIcon className='transition-[translate] ease-in-out group-hover/get-started:translate-x-0.5' />
        </Link>
      </Button>
      <Button
        size='lg'
        variant='outline'
        className='hover:text-purple-600'
        asChild
      >
        <Link
          href='https://github.com/tiesen243/create-yuki-stack'
          target='_blank'
          rel='noopener noreferrer'
        >
          <GithubIcon /> View on GitHub
        </Link>
      </Button>
    </div>
  </section>
)
