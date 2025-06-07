import {
  Code2Icon,
  DatabaseIcon,
  GlobeIcon,
  LayersIcon,
  PaletteIcon,
  SmartphoneIcon,
  TerminalIcon,
  ZapIcon,
} from '@{{ name }}/ui/icons'

export default function HomePage() {
  return (
    <main className="py-16">
      <section className="mx-auto max-w-6xl px-4 text-center">
        <div className="mb-6 inline-flex items-center gap-2 rounded-full bg-blue-50 px-3 py-1 text-sm font-medium text-blue-700 dark:bg-blue-900/30 dark:text-blue-300">
          <ZapIcon className="h-3 w-3" />
          Turborepo Ready
        </div>
        <h1 className="mb-4 text-4xl font-bold text-gray-900 md:text-6xl dark:text-white">
          <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            Yuki Stack
          </span>
        </h1>
        <p className="mx-auto mb-6 max-w-2xl text-lg text-gray-600 dark:text-gray-300">
          Full-stack TypeScript monorepo with your choice of frontend, API,
          database, and UI technologies.
        </p>

        <div className="mb-8 inline-flex items-center gap-2 rounded-lg bg-gray-900 px-6 py-3 font-mono text-sm text-white dark:bg-gray-800">
          <TerminalIcon className="h-4 w-4" />
          npx create-yuki-stack@latest
        </div>

        <div className="mb-12 flex flex-col justify-center gap-4 sm:flex-row">
          <a
            href="https://github.com/tiesen243/create-yuki-stack"
            className="inline-flex h-9 items-center justify-center gap-2 rounded-lg border border-gray-300 px-3 text-gray-700 transition-colors hover:bg-gray-50 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-800"
            target="_blank"
            rel="noopener noreferrer"
          >
            <svg
              role="img"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
              className="size-4 fill-current"
            >
              <title>GitHub</title>
              <path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12" />
            </svg>
            GitHub
          </a>
        </div>
      </section>

      {/* Tech Stack Grid */}
      <section className="mx-auto max-w-6xl px-4 pt-16">
        <div className="mb-12 text-center">
          <h2 className="mb-4 text-2xl font-bold text-gray-900 md:text-3xl dark:text-white">
            Choose Your Stack
          </h2>
          <p className="text-gray-600 dark:text-gray-300">
            Mix and match technologies for your perfect setup
          </p>
        </div>

        <div className="space-y-12">
          {/* Frontend */}
          <div>
            <h3 className="mb-6 text-center text-lg font-semibold text-gray-900 dark:text-white">
              Frontend
            </h3>
            <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
              <div className="rounded-lg border border-gray-200 bg-white p-4 text-center transition-colors hover:border-blue-300 dark:border-gray-700 dark:bg-gray-800 dark:hover:border-blue-500">
                <Code2Icon className="mx-auto mb-2 h-8 w-8 text-blue-600 dark:text-blue-400" />
                <h4 className="font-medium text-gray-900 dark:text-white">
                  Next.js
                </h4>
                <p className="text-xs text-gray-600 dark:text-gray-400">
                  Full-stack React
                </p>
              </div>
              <div className="rounded-lg border border-gray-200 bg-white p-4 text-center transition-colors hover:border-red-300 dark:border-gray-700 dark:bg-gray-800 dark:hover:border-red-500">
                <GlobeIcon className="mx-auto mb-2 h-8 w-8 text-red-600 dark:text-red-400" />
                <h4 className="font-medium text-gray-900 dark:text-white">
                  React Router
                </h4>
                <p className="text-xs text-gray-600 dark:text-gray-400">
                  Standard routing
                </p>
              </div>
              <div className="rounded-lg border border-gray-200 bg-white p-4 text-center transition-colors hover:border-purple-300 dark:border-gray-700 dark:bg-gray-800 dark:hover:border-purple-500">
                <LayersIcon className="mx-auto mb-2 h-8 w-8 text-purple-600 dark:text-purple-400" />
                <h4 className="font-medium text-gray-900 dark:text-white">
                  TanStack Router
                </h4>
                <p className="text-xs text-gray-600 dark:text-gray-400">
                  Type-safe routing
                </p>
              </div>
              <div className="rounded-lg border border-gray-200 bg-white p-4 text-center transition-colors hover:border-green-300 dark:border-gray-700 dark:bg-gray-800 dark:hover:border-green-500">
                <SmartphoneIcon className="mx-auto mb-2 h-8 w-8 text-green-600 dark:text-green-400" />
                <h4 className="font-medium text-gray-900 dark:text-white">
                  Expo
                </h4>
                <p className="text-xs text-gray-600 dark:text-gray-400">
                  React Native
                </p>
              </div>
            </div>
          </div>

          {/* UI */}
          <div>
            <h3 className="mb-6 text-center text-lg font-semibold text-gray-900 dark:text-white">
              UI Components
            </h3>
            <div className="mx-auto grid max-w-md grid-cols-2 gap-4">
              <div className="rounded-lg border border-gray-200 bg-white p-4 text-center transition-colors hover:border-blue-300 dark:border-gray-700 dark:bg-gray-800 dark:hover:border-blue-500">
                <PaletteIcon className="mx-auto mb-2 h-8 w-8 text-blue-600 dark:text-blue-400" />
                <h4 className="font-medium text-gray-900 dark:text-white">
                  shadcn/ui
                </h4>
                <p className="text-xs text-gray-600 dark:text-gray-400">
                  Copy & paste components
                </p>
              </div>
              <div className="rounded-lg border border-gray-200 bg-white p-4 text-center transition-colors hover:border-cyan-300 dark:border-gray-700 dark:bg-gray-800 dark:hover:border-cyan-500">
                <Code2Icon className="mx-auto mb-2 h-8 w-8 text-cyan-600 dark:text-cyan-400" />
                <h4 className="font-medium text-gray-900 dark:text-white">
                  Tailwind CSS
                </h4>
                <p className="text-xs text-gray-600 dark:text-gray-400">
                  Utility-first CSS
                </p>
              </div>
            </div>
          </div>

          {/* API */}
          <div>
            <h3 className="mb-6 text-center text-lg font-semibold text-gray-900 dark:text-white">
              API Layer
            </h3>
            <div className="mx-auto grid max-w-md grid-cols-2 gap-4">
              <div className="rounded-lg border border-gray-200 bg-white p-4 text-center transition-colors hover:border-blue-300 dark:border-gray-700 dark:bg-gray-800 dark:hover:border-blue-500">
                <Code2Icon className="mx-auto mb-2 h-8 w-8 text-blue-600 dark:text-blue-400" />
                <h4 className="font-medium text-gray-900 dark:text-white">
                  tRPC
                </h4>
                <p className="text-xs text-gray-600 dark:text-gray-400">
                  End-to-end typesafe
                </p>
              </div>
              <div className="rounded-lg border border-gray-200 bg-white p-4 text-center transition-colors hover:border-purple-300 dark:border-gray-700 dark:bg-gray-800 dark:hover:border-purple-500">
                <LayersIcon className="mx-auto mb-2 h-8 w-8 text-purple-600 dark:text-purple-400" />
                <h4 className="font-medium text-gray-900 dark:text-white">
                  ORPC
                </h4>
                <p className="text-xs text-gray-600 dark:text-gray-400">
                  Optimized RPC
                </p>
              </div>
            </div>
          </div>

          {/* Database */}
          <div>
            <h3 className="mb-6 text-center text-lg font-semibold text-gray-900 dark:text-white">
              Database
            </h3>
            <div className="mx-auto grid max-w-lg grid-cols-3 gap-4">
              <div className="rounded-lg border border-gray-200 bg-white p-4 text-center transition-colors hover:border-green-300 dark:border-gray-700 dark:bg-gray-800 dark:hover:border-green-500">
                <DatabaseIcon className="mx-auto mb-2 h-8 w-8 text-green-600 dark:text-green-400" />
                <h4 className="font-medium text-gray-900 dark:text-white">
                  Drizzle
                </h4>
                <p className="text-xs text-gray-600 dark:text-gray-400">
                  Lightweight ORM
                </p>
              </div>
              <div className="rounded-lg border border-gray-200 bg-white p-4 text-center transition-colors hover:border-blue-300 dark:border-gray-700 dark:bg-gray-800 dark:hover:border-blue-500">
                <LayersIcon className="mx-auto mb-2 h-8 w-8 text-blue-600 dark:text-blue-400" />
                <h4 className="font-medium text-gray-900 dark:text-white">
                  Prisma
                </h4>
                <p className="text-xs text-gray-600 dark:text-gray-400">
                  Modern toolkit
                </p>
              </div>
              <div className="rounded-lg border border-gray-200 bg-white p-4 text-center transition-colors hover:border-purple-300 dark:border-gray-700 dark:bg-gray-800 dark:hover:border-purple-500">
                <DatabaseIcon className="mx-auto mb-2 h-8 w-8 text-purple-600 dark:text-purple-400" />
                <h4 className="font-medium text-gray-900 dark:text-white">
                  Mongoose
                </h4>
                <p className="text-xs text-gray-600 dark:text-gray-400">
                  MongoDB ODM
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  )
}

