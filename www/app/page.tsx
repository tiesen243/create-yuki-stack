import Image from 'next/image'
import Link from 'next/link'

import { Button } from '@/components/ui/button'
import {
  CheckCircleIcon,
  GithubIcon,
  TerminalIcon,
  ZapIcon,
} from '@/components/ui/icons'
import { Typography } from '@/components/ui/typography'
import { cn } from '@/lib/utils'
import {
  apiOptions,
  databaseOptions,
  frontend,
  uiLibraries,
} from './page.config'

export default function HomePage() {
  return (
    <>
      {/* Header */}
      <header className="bg-background/90 sticky top-0 z-50 border-b backdrop-blur-sm">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4">
          <div className="flex items-center gap-2">
            <div className="bg-primary flex h-8 w-8 items-center justify-center rounded-lg">
              <Image
                src="/logo.svg"
                alt="Yuki Stack Logo"
                width={16}
                height={16}
                className="size-4 object-cover invert dark:invert-0"
              />
            </div>
            <span className="text-xl font-bold">Yuki Stack</span>
          </div>
          <nav className="hidden items-center gap-6 md:flex">
            <Link
              href="#frontend"
              className="hover:text-foreground text-muted-foreground transition-colors"
            >
              Frontend
            </Link>
            <Link
              href="#api"
              className="hover:text-foreground text-muted-foreground transition-colors"
            >
              API
            </Link>
            <Link
              href="#database"
              className="hover:text-foreground text-muted-foreground transition-colors"
            >
              Database
            </Link>
            <Link
              href="#getting-started"
              className="hover:text-foreground text-muted-foreground transition-colors"
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
        <div className="container grid gap-8 md:grid-cols-2 lg:grid-cols-4">
          {frontend.map((framework) => (
            <div
              key={framework.name}
              className={cn(
                `bg-card rounded-xl border p-6 transition-colors`,
                framework.hoverColor,
              )}
            >
              <div
                className={cn(
                  `mb-6 flex h-12 w-12 items-center justify-center rounded-lg`,
                  framework.iconBgColor,
                )}
              >
                <framework.icon className={cn(`size-6`, framework.iconColor)} />
              </div>
              <Typography variant="h5" component="h3" className="mb-3">
                {framework.name}
              </Typography>
              <Typography className="mb-6">{framework.description}</Typography>
              <ul className="text-muted-foreground space-y-2 text-sm">
                {framework.features.map((feature) => (
                  <li key={feature} className="flex items-center gap-2">
                    <CheckCircleIcon className="size-4 text-green-500" />
                    {feature}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </section>

      {/* UI Section */}
      <section className="py-20">
        <div className="mx-auto grid max-w-4xl gap-8 md:grid-cols-2">
          {uiLibraries.map((library) => (
            <div
              key={library.name}
              className={cn(
                'bg-card rounded-xl border p-8 transition-colors',
                library.hoverColor,
              )}
            >
              <div
                className={cn(
                  'mb-6 flex h-12 w-12 items-center justify-center rounded-lg',
                  library.iconBgColor,
                )}
              >
                <library.icon className={cn('size-6', library.iconColor)} />
              </div>
              <Typography variant="h5" component="h3" className="mb-3">
                {library.name}
              </Typography>
              <Typography className="mb-6">{library.description}</Typography>
              <ul className="text-muted-foreground space-y-2 text-sm">
                {library.features.map((feature) => (
                  <li key={feature} className="flex items-center gap-2">
                    <CheckCircleIcon className="h-4 w-4 text-green-500" />
                    {feature}
                  </li>
                ))}
              </ul>
            </div>
          ))}
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
            {apiOptions.map((api) => (
              <div
                key={api.name}
                className={cn(
                  'bg-card rounded-xl border p-8 transition-colors',
                  api.hoverColor,
                )}
              >
                <div
                  className={cn(
                    'mb-6 flex h-12 w-12 items-center justify-center rounded-lg',
                    api.iconBgColor,
                  )}
                >
                  <api.icon className={cn('h-6 w-6', api.iconColor)} />
                </div>
                <Typography variant="h5" component="h3" className="mb-3">
                  {api.name}
                </Typography>
                <Typography className="mb-6">{api.description}</Typography>
                <ul className="text-muted-foreground space-y-2 text-sm">
                  {api.features.map((feature) => (
                    <li key={feature} className="flex items-center gap-2">
                      <CheckCircleIcon className="h-4 w-4 text-green-500" />
                      {feature}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
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
            {databaseOptions.map((database) => (
              <div
                key={database.name}
                className={cn(
                  'bg-card rounded-xl border p-6 transition-colors',
                  database.hoverColor,
                )}
              >
                <div
                  className={cn(
                    'mb-6 flex h-12 w-12 items-center justify-center rounded-lg',
                    database.iconBgColor,
                  )}
                >
                  <database.icon
                    className={cn('h-6 w-6', database.iconColor)}
                  />
                </div>
                <Typography variant="h5" component="h3" className="mb-3">
                  {database.name}
                </Typography>
                <Typography className="mb-6">{database.description}</Typography>
                <ul className="text-muted-foreground space-y-2 text-sm">
                  {database.features.map((feature) => (
                    <li key={feature} className="flex items-center gap-2">
                      <CheckCircleIcon className="h-4 w-4 text-green-500" />
                      {feature}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
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
                <div>┌ Creating new Yuki project...</div>
                <div>│</div>
                <div>◇ What would you like to name your project?</div>
                <div>│ &nbsp;my-yuki-app</div>
                <div>│</div>
                <div>◇ Which language would you like to use?</div>
                <div>│ &nbsp;TypeScript</div>
                <div>│</div>
                <div>◇ Which frontend framework would you like to use?</div>
                <div>│ &nbsp;Next.js, React Router, TanStack Start</div>
                <div>│</div>
                <div>◇ Which database would you like to use?</div>
                <div>│ &nbsp;Drizzle</div>
                <div>│</div>
                <div>◇ Which database adapter would you like to use?</div>
                <div>│ &nbsp;Neon</div>
                <div>│</div>
                <div>◇ Which backend framework would you like to use?</div>
                <div>│ &nbsp;Elysia</div>
                <div>│</div>
                <div>◇ Which API framework would you like to use?</div>
                <div>│ &nbsp;tRPC</div>
                <div>│</div>
                <div>◇ Which authentication method would you like to use?</div>
                <div>│ &nbsp;Basic Auth</div>
                <div>│</div>
                <div>◇ Which package manager would you like to use?</div>
                <div>│ &nbsp;Bun</div>
                <div>│</div>
                <div>◇ Would you like to install dependencies?</div>
                <div>│ &nbsp;Yes</div>
                <div>│</div>
                <div>◇ Would you like to initialize a Git repository?</div>
                <div>│ &nbsp;Yes</div>
                <div>│</div>
                <div>
                  ◇ Directory &quot;my-yuki-app&quot; already exists and is not
                  empty. Do you want to continue?
                </div>
                <div>│ &nbsp;Yes</div>
                <div>│</div>
                <div>
                  ◇ Directory &quot;/path/to/my-yuki-app&quot; cleaned
                  successfully
                </div>
                <div>│</div>
                <div>
                  ◇ Success! Created my-yuki-app at /path/to/my-yuki-app
                </div>
                <div>│</div>
                <div>└ Next steps:</div>
                <div className="text-green-400">
                  &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;cd my-yuki-app
                </div>
                <div className="text-green-400">
                  &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;cp .env.example .env
                </div>
                <div className="text-green-400">
                  &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;bun run dev
                </div>
              </div>
              <Typography className="text-muted-foreground">
                Customize your monorepo with the technologies that best fit your
                project requirements.
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
              <div className="bg-primary flex size-6 items-center justify-center rounded">
                <Image
                  src="/logo.svg"
                  alt="Yuki Stack Logo"
                  width={12}
                  height={12}
                  className="size-3 object-cover invert dark:invert-0"
                />
              </div>
              <span className="font-bold">Yuki Stack</span>
            </div>
            <div className="flex items-center gap-8 text-gray-600 dark:text-gray-400">
              <a
                href="https://github.com/tiesen243/create-yuki-stack"
                className="hover:text-foreground transition-colors"
                target="_blank"
                rel="noopener noreferrer"
              >
                GitHub
              </a>
              <a
                href="https://twitter.com/tiesen243"
                className="hover:text-foreground transition-colors"
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
