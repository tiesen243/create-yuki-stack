import Image from 'next/image'
import {
  CheckCircleIcon,
  ClockIcon,
  ShieldIcon,
  SparklesIcon,
} from 'lucide-react'

import { Badge } from '@/components/ui/badge'
import { Typography } from '@/components/ui/typography'
import { cn } from '@/lib/utils'

export const BenefitsSection: React.FC = () => (
  <section className='bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-50 py-20 dark:from-purple-950 dark:via-blue-950 dark:to-indigo-950'>
    <div className='container'>
      <div className='mb-16 text-center'>
        <Badge variant='outline' className='mb-4'>
          Benefits
        </Badge>
        <Typography variant='h3' component='h2'>
          Why choose Yuki Stack?
        </Typography>
        <Typography className='text-muted-foreground'>
          Save weeks of setup time and focus on what matters most - building
          great features for your users.
        </Typography>
      </div>

      <div className='grid items-center gap-12 lg:grid-cols-2'>
        <div className='space-y-8'>
          {benefits.map((benefit) => (
            <div key={benefit.title} className='flex items-start space-x-4'>
              <div
                className={cn(
                  'mt-1 flex size-8 flex-shrink-0 items-center justify-center rounded-lg',
                  benefit.iconBg,
                )}
              >
                <benefit.icon className={cn('size-5', benefit.iconColor)} />
              </div>
              <div>
                <Typography variant='h6' component='h3'>
                  {benefit.title}
                </Typography>
                <Typography className='text-muted-foreground'>
                  {benefit.description}
                </Typography>
              </div>
            </div>
          ))}
        </div>

        <div className='relative'>
          <Image
            src='/assets/yukikaze.gif'
            width={500}
            height={400}
            alt='Developer Experience'
            className='aspect-square rounded-lg object-cover shadow-2xl'
          />
          <div className='absolute -top-4 -right-4 size-24 rounded-full bg-gradient-to-br from-purple-800 to-blue-800 opacity-20 blur-xl dark:from-purple-400 dark:to-blue-400' />
          <div className='absolute -bottom-4 -left-4 size-32 rounded-full bg-gradient-to-br from-blue-800 to-indigo-800 opacity-20 blur-xl dark:from-blue-400 dark:to-indigo-400' />
        </div>
      </div>
    </div>
  </section>
)

const benefits = [
  {
    icon: ClockIcon,
    iconColor: 'text-green-600 dark:text-green-400',
    iconBg: 'bg-green-100 dark:bg-green-900',
    title: 'Reduced Development Time',
    description:
      'Skip the tedious setup process and start building features immediately. Our pre-configured stack saves you 2-3 weeks of initial setup time.',
  },
  {
    icon: CheckCircleIcon,
    iconColor: 'text-blue-600 dark:text-blue-400',
    iconBg: 'bg-blue-100 dark:bg-blue-900',
    title: 'Improved Code Quality',
    description:
      'Built-in linting, formatting, and testing tools ensure consistent, high-quality code across your entire team.',
  },
  {
    icon: SparklesIcon,
    iconColor: 'text-purple-600 dark:text-purple-400',
    iconBg: 'bg-purple-100 dark:bg-purple-900',
    title: 'Enhanced Developer Experience',
    description:
      'Hot reload, TypeScript intellisense, and comprehensive error handling make development smooth and enjoyable.',
  },
  {
    icon: ShieldIcon,
    iconColor: 'text-orange-600 dark:text-orange-400',
    iconBg: 'bg-orange-100 dark:bg-orange-900',
    title: 'Production Ready',
    description:
      'Security best practices, performance optimizations, and scalable architecture patterns built-in from day one.',
  },
]
