export const DEFAULT_NAME = 'yuki-app'

export const LOGO = `
 ██╗   ██╗██╗   ██╗██╗  ██╗██╗            
 ╚██╗ ██╔╝██║   ██║██║ ██╔╝██║            
  ╚████╔╝ ██║   ██║█████╔╝ ██║            
   ╚██╔╝  ██║   ██║██╔═██╗ ██║            
    ██║   ╚██████╔╝██║  ██╗██║            
    ╚═╝    ╚═════╝ ╚═╝  ╚═╝╚═╝            
                                         
 ███████╗████████╗ █████╗  ██████╗██╗  ██╗
 ██╔════╝╚══██╔══╝██╔══██╗██╔════╝██║ ██╔╝
 ███████╗   ██║   ███████║██║     █████╔╝ 
 ╚════██║   ██║   ██╔══██║██║     ██╔═██╗ 
 ███████║   ██║   ██║  ██║╚██████╗██║  ██╗
 ╚══════╝   ╚═╝   ╚═╝  ╚═╝ ╚═════╝╚═╝  ╚═╝`

export const COLORS = ['#5a7de4', '#9ab0e5', '#dbe6f6']

export const FRONTENDS = [
  {
    title: 'Next.js',
    value: 'nextjs',
    description: 'A React framework for server-rendered applications',
  },
  { title: 'React Router', value: 'react-router' },
  { title: 'React Native (Bare)', value: 'react-native-bare' },
  { title: 'React Native (Expo)', value: 'react-native-expo' },
] as const

export const BACKENDS = [
  {
    title: 'None',
    value: 'none',
  },
  {
    title: 'Elysia',
    value: 'elysia',
    description:
      'Backend TypeScript framework with End-to-End Type Safety, formidable speed, and exceptional DX across runtime.',
  },
  {
    title: 'Hono',
    value: 'hono',
    description:
      'Fast, lightweight, built on Web Standards. Support for any JavaScript runtime.',
  },
  {
    title: 'Express',
    value: 'express',
    description: 'Fast, unopinionated, minimalist web framework for Node.js',
  },
  {
    title: 'Spring Boot (Gradle)',
    value: 'spring-boot-gradle',
    description:
      'A Java-based framework used to create microservices, web applications, and RESTful APIs with ease.',
  },
  {
    title: 'Spring Boot (Maven)',
    value: 'spring-boot-maven',
    description:
      'A Java-based framework used to create microservices, web applications, and RESTful APIs with ease.',
  },
] as const

export const APIS = [
  {
    title: 'None',
    value: 'none',
  },
  {
    title: 'tRPC',
    value: 'trpc',
    description:
      'Move Fast and Break Nothing. End-to-end typesafe APIs made easy.',
  },
  {
    title: 'oRPC',
    value: 'orpc',
    description:
      'Easy to build APIs that are end-to-end type-safe and adhere to OpenAPI standards.',
  },
] as const

export const DATABASES = [
  {
    title: 'None',
    value: 'none',
  },
  {
    title: 'Drizzle',
    value: 'drizzle',
    description: 'A headless TypeScript ORM with a head.',
  },
  {
    title: 'Prisma',
    value: 'prisma',
    description: 'Next-generation Node.js and TypeScript ORM.',
  },
  {
    title: 'Mongoose',
    value: 'mongoose',
    description: 'Elegant MongoDB object modeling for Node.js.',
  },
] as const

export const EXTRA_FEATURES = [
  {
    title: 'Auth',
    value: 'auth',
    description:
      'Add authentication to your project using https://yuki-ui.vercel.app/docs/auth',
  },
  {
    title: 'Email (Resend)',
    value: 'email',
    description: 'Add email functionality to your project using Resend',
  },
  {
    title: 'Github Actions',
    value: 'github-actions',
    description: 'Add a Github Actions workflow to your project',
  },
  {
    title: 'Docker',
    value: 'docker',
    description: 'Add a Dockerfile and docker-compose.yml to your project',
  },
] as const

export const PACKAGE_MANAGERS = [
  {
    title: 'npm',
    value: 'npm',
  },
  {
    title: 'yarn',
    value: 'yarn',
  },
  {
    title: 'pnpm',
    value: 'pnpm',
  },
  {
    title: 'bun',
    value: 'bun',
  },
] as const
