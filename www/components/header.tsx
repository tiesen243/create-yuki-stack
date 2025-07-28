import Image from 'next/image'
import Link from 'next/link'

import { Button } from '@/components/ui/button'
import { GithubIcon } from '@/components/ui/icons'

export const Header: React.FC = () => (
  <header className='sticky inset-0 z-50 flex h-16 items-center border-b bg-background/70 backdrop-blur-xl backdrop-saturate-150'>
    <div className='container flex items-center justify-between'>
      <Link href='/' className='flex items-center space-x-2'>
        <Image
          src='/assets/logo.svg'
          alt='Logo'
          width={36}
          height={36}
          className='size-9 dark:invert'
          priority
        />
        <span className='text-2xl font-bold'>Yuki Stack</span>
      </Link>

      <nav className='hidden items-center space-x-6 md:flex'>
        {navItems.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className='text-sm font-medium transition-colors hover:text-purple-600'
          >
            {item.title}
          </Link>
        ))}
      </nav>

      <Button variant='outline' size='sm' asChild>
        <Link
          href='https://github.com/tiesen243/create-yuki-stack'
          target='_blank'
          rel='noopener noreferrer'
        >
          <GithubIcon />
          <span className='hidden sm:inline'>GitHub</span>
        </Link>
      </Button>
    </div>
  </header>
)

const navItems = [
  {
    title: 'Features',
    href: '#features',
  },
  {
    title: 'Tech Stack',
    href: '#stack',
  },
  {
    title: 'Get Started',
    href: '#getting-started',
  },
  {
    title: 'Reviews',
    href: '#testimonials',
  },
]
