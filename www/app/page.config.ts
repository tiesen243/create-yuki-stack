import {
  Code2Icon,
  DatabaseIcon,
  GlobeIcon,
  LayersIcon,
  PaletteIcon,
  SmartphoneIcon,
} from 'lucide-react'

export const frontend = [
  {
    name: 'Next.js',
    description:
      'Full-stack React framework with server components and built-in routing.',
    icon: Code2Icon,
    iconColor: 'text-blue-500 dark:text-blue-400',
    iconBgColor: 'bg-blue-100 dark:bg-blue-900',
    hoverColor: 'hover:border-blue-300 dark:hover:border-blue-500',
    features: ['App Router', 'Server Components', 'Server Actions'],
  },
  {
    name: 'React Router',
    description: 'Standard routing library for React with declarative routing.',
    icon: GlobeIcon,
    iconColor: 'text-red-500 dark:text-red-400',
    iconBgColor: 'bg-red-100 dark:bg-red-900',
    hoverColor: 'hover:border-red-300 dark:hover:border-red-500',
    features: ['Data loaders', 'Nested routes', 'Route actions'],
  },
  {
    name: 'TanStack Router',
    description:
      'Type-safe routing with first-class search params and loaders.',
    icon: LayersIcon,
    iconColor: 'text-purple-500 dark:text-purple-400',
    iconBgColor: 'bg-purple-100 dark:bg-purple-900',
    hoverColor: 'hover:border-purple-300 dark:hover:border-purple-500',
    features: ['Type-safe routes', 'Search params', 'Optimistic updates'],
  },
  {
    name: 'Expo (soon)',
    description: 'React Native framework for building native mobile apps.',
    icon: SmartphoneIcon,
    iconColor: 'text-green-500 dark:text-green-400',
    iconBgColor: 'bg-green-100 dark:bg-green-900',
    hoverColor: 'hover:border-green-300 dark:hover:border-green-500',
    features: ['iOS & Android', 'Native components', 'OTA updates'],
  },
]

export const uiLibraries = [
  {
    name: 'shadcn/ui',
    description:
      'Beautiful, accessible components built with Radix UI and Tailwind CSS.',
    icon: PaletteIcon,
    iconColor: 'text-blue-600 dark:text-blue-400',
    iconBgColor: 'bg-blue-100 dark:bg-blue-900',
    hoverColor: 'hover:border-blue-300 dark:hover:border-blue-500',
    features: [
      'Copy & paste components',
      'Fully customizable',
      'Accessible by default',
      'Dark mode support',
    ],
  },
  {
    name: 'Tailwind CSS',
    description: 'Utility-first CSS framework for rapid UI development.',
    icon: Code2Icon,
    iconColor: 'text-cyan-600 dark:text-cyan-400',
    iconBgColor: 'bg-cyan-100 dark:bg-cyan-900',
    hoverColor: 'hover:border-cyan-300 dark:hover:border-cyan-500',
    features: [
      'Utility-first approach',
      'Highly customizable',
      'Small bundle size',
      'Responsive design',
    ],
  },
]

export const apiOptions = [
  {
    name: 'tRPC',
    description: 'End-to-end typesafe APIs with zero schema duplication.',
    icon: Code2Icon,
    iconColor: 'text-blue-600 dark:text-blue-400',
    iconBgColor: 'bg-blue-100 dark:bg-blue-900',
    hoverColor: 'hover:border-blue-300 dark:hover:border-blue-500',
    features: [
      'Full type inference',
      'Automatic types',
      'React Query integration',
      'Middleware support',
    ],
  },
  {
    name: 'ORPC',
    description:
      'Optimized RPC with smaller bundle size and improved performance.',
    icon: LayersIcon,
    iconColor: 'text-purple-600 dark:text-purple-400',
    iconBgColor: 'bg-purple-100 dark:bg-purple-900',
    hoverColor: 'hover:border-purple-300 dark:hover:border-purple-500',
    features: [
      'Smaller bundle size',
      'Faster performance',
      'Type safety',
      'Simple API',
    ],
  },
]

export const databaseOptions = [
  {
    name: 'Drizzle ORM',
    description:
      'Lightweight, performant ORM with excellent TypeScript support and SQL-like syntax.',
    icon: DatabaseIcon,
    iconColor: 'text-green-600 dark:text-green-400',
    iconBgColor: 'bg-green-100 dark:bg-green-900',
    hoverColor: 'hover:border-green-300 dark:hover:border-green-500',
    features: [
      'Zero runtime overhead',
      'SQL-like syntax',
      'Edge runtime compatible',
    ],
  },
  {
    name: 'Prisma',
    description:
      'Modern database toolkit with powerful schema management and excellent developer experience.',
    icon: LayersIcon,
    iconColor: 'text-blue-600 dark:text-blue-400',
    iconBgColor: 'bg-blue-100 dark:bg-blue-900',
    hoverColor: 'hover:border-blue-300 dark:hover:border-blue-500',
    features: [
      'Visual database browser',
      'Auto-generated types',
      'Migration system',
    ],
  },
  {
    name: 'Mongoose',
    description:
      'Elegant MongoDB object modeling with built-in type casting and validation.',
    icon: DatabaseIcon,
    iconColor: 'text-purple-600 dark:text-purple-400',
    iconBgColor: 'bg-purple-100 dark:bg-purple-900',
    hoverColor: 'hover:border-purple-300 dark:hover:border-purple-500',
    features: ['Schema validation', 'Middleware support', 'MongoDB native'],
  },
]
