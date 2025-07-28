import {
  CodeIcon,
  LayersIcon,
  RocketIcon,
  ShieldIcon,
  TerminalIcon,
  ZapIcon,
} from 'lucide-react'

import { Badge } from '@/components/ui/badge'
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Typography } from '@/components/ui/typography'
import { cn } from '@/lib/utils'

export const FeaturesSection: React.FC = () => (
  <section id='features' className='container py-20'>
    <div className='mb-16 text-center'>
      <Badge variant='outline' className='mb-4'>
        Features
      </Badge>
      <Typography variant='h3' component='h2'>
        Everything you need to build amazing apps
      </Typography>
      <Typography className='text-muted-foreground'>
        Yuki Stack comes pre-configured with industry-standard tools and best
        practices, so you can focus on building features instead of setting up
        infrastructure.
      </Typography>
    </div>

    <div className='grid gap-8 md:grid-cols-2 lg:grid-cols-3'>
      {features.map((feature) => (
        <Card
          key={feature.title}
          className='border-0 shadow-lg transition-shadow hover:shadow-xl'
        >
          <CardHeader>
            <div
              className={cn(
                'mb-4 flex h-12 w-12 items-center justify-center rounded-lg',
                feature.iconBg,
              )}
            >
              <feature.icon className={cn('size-6', feature.iconColor)} />
            </div>
            <CardTitle>{feature.title}</CardTitle>
            <CardDescription>{feature.description}</CardDescription>
          </CardHeader>
        </Card>
      ))}
    </div>
  </section>
)

const features = [
  {
    icon: ZapIcon,
    iconColor: 'text-purple-600 dark:text-purple-400',
    iconBg: 'bg-purple-100 dark:bg-purple-900',
    title: 'Fully Customizable',
    description:
      'Choose from multiple frontend, backend, database, and authentication options to build your perfect stack.',
  },
  {
    icon: CodeIcon,
    iconColor: 'text-blue-600 dark:text-blue-400',
    iconBg: 'bg-blue-100 dark:bg-blue-900',
    title: 'Type Safe',
    description:
      'Full TypeScript support with strict type checking, auto-completion, and compile-time error detection.',
  },
  {
    icon: ShieldIcon,
    iconColor: 'text-green-600 dark:text-green-400',
    iconBg: 'bg-green-100 dark:bg-green-900',
    title: 'Secure by Default',
    description:
      'Built-in authentication, CSRF protection, and security headers configured out of the box.',
  },
  {
    icon: LayersIcon,
    iconColor: 'text-orange-600 dark:text-orange-400',
    iconBg: 'bg-orange-100 dark:bg-orange-900',
    title: 'Full Stack',
    description:
      'Complete solution with frontend, backend, database, and deployment configuration included.',
  },
  {
    icon: TerminalIcon,
    iconColor: 'text-pink-600 dark:text-pink-400',
    iconBg: 'bg-pink-100 dark:bg-pink-900',
    title: 'Developer Experience',
    description:
      'Hot reload, error boundaries, debugging tools, and comprehensive logging for smooth development.',
  },
  {
    icon: RocketIcon,
    iconColor: 'text-indigo-600 dark:text-indigo-400',
    iconBg: 'bg-indigo-100 dark:bg-indigo-900',
    title: 'Production Ready',
    description:
      'Optimized builds, caching strategies, and deployment configurations for scalable applications.',
  },
]
