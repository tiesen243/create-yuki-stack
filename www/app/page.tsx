import Link from 'next/link'

import { Button } from '@yuki/ui/button'
import {
  CheckCircleIcon,
  Code2Icon,
  DatabaseIcon,
  GithubIcon,
  GlobeIcon,
  LayersIcon,
  PaletteIcon,
  SmartphoneIcon,
  TerminalIcon,
  ZapIcon,
} from '@yuki/ui/icons'
import { Typography } from '@yuki/ui/typography'

export default function HomePage() {
  return (
    <>
      {/* Header */}
      <header className="bg-background/90 sticky top-0 z-50 border-b backdrop-blur-sm">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-600">
              <TerminalIcon className="h-4 w-4 text-white" />
            </div>
            <span className="text-xl font-bold">Yuki Stack</span>
          </div>
          <nav className="hidden items-center gap-6 md:flex">
            <Link
              href="#frontend"
              className="transition-colors hover:text-blue-600 dark:hover:text-blue-400"
            >
              Frontend
            </Link>
            <Link
              href="#api"
              className="transition-colors hover:text-blue-600 dark:hover:text-blue-400"
            >
              API
            </Link>
            <Link
              href="#database"
              className="transition-colors hover:text-blue-600 dark:hover:text-blue-400"
            >
              Database
            </Link>
            <Link
              href="#getting-started"
              className="transition-colors hover:text-blue-600 dark:hover:text-blue-400"
            >
              Getting Started
            </Link>
            <Button asChild>
              <a
                href="https://github.com/tiesen243/create-yuki-stack"
                target="_blank"
                rel="noopener noreferrer"
              >
                <GithubIcon /> GitHub
              </a>
            </Button>
          </nav>
        </div>
      </header>

      {/* Hero Section */}
      <section className="mx-auto max-w-6xl px-4 py-20 text-center">
        <div className="mb-6 inline-flex items-center gap-2 rounded-full bg-blue-50 px-3 py-1 text-sm font-medium text-blue-700 dark:bg-blue-900/30 dark:text-blue-300">
          <ZapIcon className="h-3 w-3" />
          Turborepo Ready
        </div>
        <Typography
          variant="h1"
          className="mb-6 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent"
        >
          Yuki Stack
        </Typography>
        <Typography className="mx-auto mb-8 max-w-2xl text-xl">
          The ultimate full-stack TypeScript monorepo boilerplate with your
          choice of frontend, API, database, and UI technologies.
        </Typography>

        <div className="bg-secondary text-secondary-foreground mb-8 inline-flex items-center gap-2 rounded-lg px-6 py-4 font-mono text-sm">
          <TerminalIcon className="h-4 w-4" />
          npx create-yuki-stack@latest
        </div>

        <div className="text-muted-foreground mb-12 flex flex-wrap justify-center gap-6 text-sm">
          <div className="flex items-center gap-2">
            <CheckCircleIcon className="size-4 text-green-500" />
            TypeScript
          </div>
          <div className="flex items-center gap-2">
            <CheckCircleIcon className="size-4 text-green-500" />
            Turborepo
          </div>
          <div className="flex items-center gap-2">
            <CheckCircleIcon className="size-4 text-green-500" />
            Multiple Frontends
          </div>
          <div className="flex items-center gap-2">
            <CheckCircleIcon className="size-4 text-green-500" />
            Type-Safe APIs
          </div>
        </div>
      </section>

      {/* Frontend Section */}
      <section id="frontend" className="bg-secondary py-20">
        <div className="mx-auto max-w-6xl px-4">
          <div className="mb-16 text-center">
            <Typography variant="h3" component="h2" className="mb-4">
              Choose Your Frontend
            </Typography>
            <Typography className="mx-auto max-w-2xl">
              Select the frontend framework or router that best suits your
              project needs.
            </Typography>
          </div>

          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
            {/* Next.js */}
            <div className="bg-card rounded-xl border p-6 transition-colors hover:border-blue-300 dark:border-gray-700 dark:hover:border-blue-500">
              <div className="mb-6 flex h-12 w-12 items-center justify-center rounded-lg bg-blue-100 dark:bg-blue-900">
                <Code2Icon className="h-6 w-6 text-blue-600 dark:text-blue-400" />
              </div>
              <Typography variant="h5" component="h3" className="mb-3">
                Next.js
              </Typography>
              <Typography className="mb-6">
                Full-stack React framework with server components and built-in
                routing.
              </Typography>
              <ul className="text-muted-foreground space-y-2 text-sm">
                <li className="flex items-center gap-2">
                  <CheckCircleIcon className="size-4 text-green-500" />
                  App Router
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircleIcon className="size-4 text-green-500" />
                  Server Components
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircleIcon className="size-4 text-green-500" />
                  Server Actions
                </li>
              </ul>
            </div>

            {/* React Router */}
            <div className="bg-card rounded-xl border p-6 transition-colors hover:border-red-300 dark:border-gray-700 dark:hover:border-red-500">
              <div className="mb-6 flex h-12 w-12 items-center justify-center rounded-lg bg-red-100 dark:bg-red-900">
                <GlobeIcon className="size-6 text-red-600 dark:text-red-400" />
              </div>
              <Typography variant="h5" component="h3" className="mb-3">
                React Router
              </Typography>
              <Typography className="mb-6">
                Standard routing library for React with declarative routing.
              </Typography>
              <ul className="text-muted-foreground space-y-2 text-sm">
                <li className="flex items-center gap-2">
                  <CheckCircleIcon className="size-4 text-green-500" />
                  Data loaders
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircleIcon className="size-4 text-green-500" />
                  Nested routes
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircleIcon className="size-4 text-green-500" />
                  Route actions
                </li>
              </ul>
            </div>

            {/* TanStack Router */}
            <div className="bg-card rounded-xl border p-6 transition-colors hover:border-purple-300 dark:border-gray-700 dark:hover:border-purple-500">
              <div className="mb-6 flex h-12 w-12 items-center justify-center rounded-lg bg-purple-100 dark:bg-purple-900">
                <LayersIcon className="size-6 text-purple-600 dark:text-purple-400" />
              </div>
              <Typography variant="h5" component="h3" className="mb-3">
                TanStack Router
              </Typography>
              <Typography className="mb-6">
                Type-safe routing with first-class search params and loaders.
              </Typography>
              <ul className="text-muted-foreground space-y-2 text-sm">
                <li className="flex items-center gap-2">
                  <CheckCircleIcon className="size-4 text-green-500" />
                  Type-safe routes
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircleIcon className="size-4 text-green-500" />
                  Search params
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircleIcon className="size-4 text-green-500" />
                  Optimistic updates
                </li>
              </ul>
            </div>

            {/* Expo */}
            <div className="bg-card rounded-xl border p-6 transition-colors hover:border-green-300 dark:border-gray-700 dark:hover:border-green-500">
              <div className="mb-6 flex h-12 w-12 items-center justify-center rounded-lg bg-green-100 dark:bg-green-900">
                <SmartphoneIcon className="size-6 text-green-600 dark:text-green-400" />
              </div>
              <Typography variant="h5" component="h3" className="mb-3">
                Expo
              </Typography>
              <Typography className="mb-6">
                React Native framework for building native mobile apps.
              </Typography>
              <ul className="text-muted-foreground space-y-2 text-sm">
                <li className="flex items-center gap-2">
                  <CheckCircleIcon className="size-4 text-green-500" />
                  iOS & Android
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircleIcon className="size-4 text-green-500" />
                  Native components
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircleIcon className="size-4 text-green-500" />
                  OTA updates
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* UI Section */}
      <section className="py-20">
        <div className="mx-auto max-w-6xl px-4">
          <div className="mb-16 text-center">
            <Typography variant="h3" component="h2" className="mb-4">
              UI Components
            </Typography>
            <Typography className="mx-auto max-w-2xl">
              Choose your preferred UI component library for building beautiful
              interfaces.
            </Typography>
          </div>

          <div className="mx-auto grid max-w-4xl gap-8 md:grid-cols-2">
            {/* shadcn/ui */}
            <div className="bg-card rounded-xl border p-8 transition-colors hover:border-blue-300 dark:hover:border-blue-500">
              <div className="mb-6 flex h-12 w-12 items-center justify-center rounded-lg bg-blue-100 dark:bg-blue-900">
                <PaletteIcon className="size-6 text-blue-600 dark:text-blue-400" />
              </div>
              <Typography variant="h5" component="h3" className="mb-3">
                shadcn/ui
              </Typography>
              <Typography className="mb-6">
                Beautiful, accessible components built with Radix UI and
                Tailwind CSS.
              </Typography>
              <ul className="text-muted-foreground space-y-2 text-sm">
                <li className="flex items-center gap-2">
                  <CheckCircleIcon className="h-4 w-4 text-green-500" />
                  Copy & paste components
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircleIcon className="h-4 w-4 text-green-500" />
                  Fully customizable
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircleIcon className="h-4 w-4 text-green-500" />
                  Accessible by default
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircleIcon className="h-4 w-4 text-green-500" />
                  Dark mode support
                </li>
              </ul>
            </div>

            {/* Tailwind CSS */}
            <div className="bg-card rounded-xl border p-8 transition-colors hover:border-cyan-300 dark:hover:border-cyan-500">
              <div className="mb-6 flex h-12 w-12 items-center justify-center rounded-lg bg-cyan-100 dark:bg-cyan-900">
                <Code2Icon className="size-6 text-cyan-600 dark:text-cyan-400" />
              </div>
              <Typography variant="h5" component="h3" className="mb-3">
                Tailwind CSS
              </Typography>
              <Typography className="mb-6">
                Utility-first CSS framework for rapid UI development.
              </Typography>
              <ul className="text-muted-foreground space-y-2 text-sm">
                <li className="flex items-center gap-2">
                  <CheckCircleIcon className="h-4 w-4 text-green-500" />
                  Utility-first approach
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircleIcon className="h-4 w-4 text-green-500" />
                  Highly customizable
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircleIcon className="h-4 w-4 text-green-500" />
                  Small bundle size
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircleIcon className="h-4 w-4 text-green-500" />
                  Responsive design
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* API Section */}
      <section id="api" className="bg-secondary py-20">
        <div className="mx-auto max-w-6xl px-4">
          <div className="mb-16 text-center">
            <Typography variant="h3" component="h2" className="mb-4">
              Type-Safe API Options
            </Typography>
            <Typography className="mx-auto max-w-2xl">
              Choose between tRPC or ORPC for end-to-end type safety in your
              application.
            </Typography>
          </div>

          <div className="mx-auto grid max-w-4xl gap-8 md:grid-cols-2">
            {/* tRPC */}
            <div className="bg-card rounded-xl border p-8 transition-colors hover:border-blue-300 dark:hover:border-blue-500">
              <div className="mb-6 flex h-12 w-12 items-center justify-center rounded-lg bg-blue-100 dark:bg-blue-900">
                <Code2Icon className="h-6 w-6 text-blue-600 dark:text-blue-400" />
              </div>
              <Typography variant="h5" component="h3" className="mb-3">
                tRPC
              </Typography>
              <Typography className="mb-6">
                End-to-end typesafe APIs with zero schema duplication.
              </Typography>
              <ul className="text-muted-foreground space-y-2 text-sm">
                <li className="flex items-center gap-2">
                  <CheckCircleIcon className="h-4 w-4 text-green-500" />
                  Full type inference
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircleIcon className="h-4 w-4 text-green-500" />
                  Automatic types
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircleIcon className="h-4 w-4 text-green-500" />
                  React Query integration
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircleIcon className="h-4 w-4 text-green-500" />
                  Middleware support
                </li>
              </ul>
            </div>

            {/* ORPC */}
            <div className="bg-card rounded-xl border p-8 transition-colors hover:border-purple-300 dark:hover:border-purple-500">
              <div className="mb-6 flex h-12 w-12 items-center justify-center rounded-lg bg-purple-100 dark:bg-purple-900">
                <LayersIcon className="h-6 w-6 text-purple-600 dark:text-purple-400" />
              </div>
              <Typography variant="h5" component="h3" className="mb-3">
                ORPC
              </Typography>
              <Typography className="mb-6">
                Optimized RPC with smaller bundle size and improved performance.
              </Typography>
              <ul className="text-muted-foreground space-y-2 text-sm">
                <li className="flex items-center gap-2">
                  <CheckCircleIcon className="h-4 w-4 text-green-500" />
                  Smaller bundle size
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircleIcon className="h-4 w-4 text-green-500" />
                  Faster performance
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircleIcon className="h-4 w-4 text-green-500" />
                  Type safety
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircleIcon className="h-4 w-4 text-green-500" />
                  Simple API
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Database Section */}
      <section id="database" className="py-20">
        <div className="mx-auto max-w-6xl px-4">
          <div className="mb-16 text-center">
            <Typography variant="h3" component="h2" className="mb-4">
              Choose Your Database Stack
            </Typography>
            <Typography className="mx-auto max-w-2xl">
              Pick the database solution that fits your project. All options
              come pre-configured with TypeScript support.
            </Typography>
          </div>

          <div className="grid gap-8 md:grid-cols-3">
            {/* Drizzle */}
            <div className="bg-card rounded-xl border p-6 transition-colors hover:border-green-300 dark:hover:border-green-500">
              <div className="mb-6 flex h-12 w-12 items-center justify-center rounded-lg bg-green-100 dark:bg-green-900">
                <DatabaseIcon className="h-6 w-6 text-green-600 dark:text-green-400" />
              </div>
              <Typography variant="h5" component="h3" className="mb-3">
                Drizzle ORM
              </Typography>
              <Typography className="mb-6">
                Lightweight, performant ORM with excellent TypeScript support
                and SQL-like syntax.
              </Typography>
              <ul className="text-muted-foreground space-y-2 text-sm">
                <li className="flex items-center gap-2">
                  <CheckCircleIcon className="h-4 w-4 text-green-500" />
                  Zero runtime overhead
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircleIcon className="h-4 w-4 text-green-500" />
                  SQL-like syntax
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircleIcon className="h-4 w-4 text-green-500" />
                  Edge runtime compatible
                </li>
              </ul>
            </div>

            {/* Prisma */}
            <div className="bg-card rounded-xl border p-6 transition-colors hover:border-blue-300 dark:hover:border-blue-500">
              <div className="mb-6 flex h-12 w-12 items-center justify-center rounded-lg bg-blue-100 dark:bg-blue-900">
                <LayersIcon className="h-6 w-6 text-blue-600 dark:text-blue-400" />
              </div>
              <Typography variant="h5" component="h3" className="mb-3">
                Prisma
              </Typography>
              <Typography className="mb-6">
                Modern database toolkit with powerful schema management and
                excellent developer experience.
              </Typography>
              <ul className="text-muted-foreground space-y-2 text-sm">
                <li className="flex items-center gap-2">
                  <CheckCircleIcon className="h-4 w-4 text-green-500" />
                  Visual database browser
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircleIcon className="h-4 w-4 text-green-500" />
                  Auto-generated types
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircleIcon className="h-4 w-4 text-green-500" />
                  Migration system
                </li>
              </ul>
            </div>

            {/* Mongoose */}
            <div className="bg-card rounded-xl border p-6 transition-colors hover:border-purple-300 dark:hover:border-purple-500">
              <div className="mb-6 flex h-12 w-12 items-center justify-center rounded-lg bg-purple-100 dark:bg-purple-900">
                <DatabaseIcon className="h-6 w-6 text-purple-600 dark:text-purple-400" />
              </div>
              <Typography variant="h5" component="h3" className="mb-3">
                Mongoose
              </Typography>
              <Typography className="mb-6">
                Elegant MongoDB object modeling with built-in type casting and
                validation.
              </Typography>
              <ul className="text-muted-foreground space-y-2 text-sm">
                <li className="flex items-center gap-2">
                  <CheckCircleIcon className="h-4 w-4 text-green-500" />
                  Schema validation
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircleIcon className="h-4 w-4 text-green-500" />
                  Middleware support
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircleIcon className="h-4 w-4 text-green-500" />
                  MongoDB native
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Getting Started Section */}
      <section
        id="getting-started"
        className="bg-secondary text-secondary-foreground py-20"
      >
        <div className="mx-auto max-w-4xl px-4">
          <div className="mb-16 text-center">
            <Typography variant="h3" component="h2" className="mb-4">
              Get Started in Minutes
            </Typography>
            <Typography className="mx-auto max-w-2xl">
              Create your new monorepo project with your preferred stack in just
              a few simple steps.
            </Typography>
          </div>

          <div className="space-y-8">
            <div className="bg-card text-card-foreground rounded-xl border p-6">
              <Typography variant="h5" component="h3" className="mb-4">
                1. Create Your Project
              </Typography>
              <div className="bg-secondary text-secondary-foreground mb-4 rounded-lg p-4 font-mono text-sm">
                <div className="text-green-400">
                  # Create a new Yuki Stack project
                </div>
                <div>npx create-yuki-stack@latest my-awesome-app</div>
              </div>
              <Typography className="text-muted-foreground">
                The CLI will guide you through selecting your preferred options.
              </Typography>
            </div>

            <div className="bg-card text-card-foreground rounded-xl border p-6">
              <Typography variant="h5" component="h3" className="mb-4">
                2. Choose Your Stack
              </Typography>
              <div className="bg-secondary text-secondary-foreground mb-4 rounded-lg p-4 font-mono text-sm">
                <div className="text-green-400">
                  # Interactive CLI will ask you:
                </div>
                <div>┌ Creating a new Yuki-Stack project...</div>
                <div>│</div>
                <div>◇ Will you be using TypeScript or JavaScript?</div>
                <div>│ &nbsp;TypeScript</div>
                <div>│</div>
                <div>◇ Which database would you like to use?</div>
                <div>│ &nbsp;Drizzle</div>
                <div>│</div>
                <div>◇ What type of API will you be using?</div>
                <div>│ &nbsp;tRPC</div>
                <div>│</div>
                <div>◇ Which backend framework would you like to use?</div>
                <div>│ &nbsp;None</div>
                <div>│</div>
                <div>◇ Which frontend framework would you like to use?</div>
                <div>│ &nbsp;Next.js</div>
                <div>│</div>
                <div>◇ Would you like to use shadcn/ui for your project?</div>
                <div>│ &nbsp;Yes</div>
                <div>│</div>
                <div>◇ Which package manager would you like to use?</div>
                <div>│ &nbsp;Bun</div>
                <div>│</div>
                <div>◇ Would you like to run bun install for you?</div>
                <div>│ &nbsp;Yes</div>
                <div>│</div>
                <div>◇ Would you like to initialize a git repository?</div>
                <div>│ &nbsp;Yes</div>
                <div>│</div>
                <div>◇ Project dasd created successfully!</div>
              </div>
              <Typography className="text-muted-foreground">
                Customize your monorepo with the technologies that best fit your
                project requirements.
              </Typography>
            </div>

            <div className="bg-card rounded-xl border p-6">
              <Typography variant="h5" component="h3" className="mb-4">
                3. Start Development
              </Typography>
              <div className="bg-secondary text-secondary-foreground mb-4 rounded-lg p-4 font-mono text-sm">
                <div className="text-green-400"># Navigate to your project</div>
                <div>cd my-awesome-app</div>
                <div className="text-green-400">
                  # Start all apps in development
                </div>
                <div>npm run dev</div>
              </div>
              <Typography className="text-muted-foreground">
                Your turborepo will start all applications with hot reloading
                and TypeScript checking.
              </Typography>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t">
        <div className="mx-auto max-w-6xl px-4 py-12">
          <div className="flex flex-col items-center justify-between md:flex-row">
            <div className="mb-4 flex items-center gap-2 md:mb-0">
              <div className="flex size-6 items-center justify-center rounded bg-blue-600">
                <TerminalIcon className="size-3" />
              </div>
              <span className="font-bold">Yuki Stack</span>
            </div>
            <div className="flex items-center gap-8 text-gray-600 dark:text-gray-400">
              <a
                href="https://github.com/tiesen243/create-yuki-stack"
                className="transition-colors hover:text-blue-600 dark:hover:text-blue-400"
                target="_blank"
                rel="noopener noreferrer"
              >
                GitHub
              </a>
              <a
                href="https://twitter.com/tiesen243"
                className="transition-colors hover:text-blue-600 dark:hover:text-blue-400"
                target="_blank"
                rel="noopener noreferrer"
              >
                Twitter
              </a>
            </div>
          </div>
        </div>
      </footer>
    </>
  )
}
