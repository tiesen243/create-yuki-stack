import fs from 'node:fs/promises'

import type { ProjectOptions } from '@/commands/init/types'

export async function generateReadme(opts: ProjectOptions): Promise<void> {
  const content = generateReadmeContent(opts)
  await fs.writeFile('README.md', content, 'utf8')
}

function generateReadmeContent(opts: ProjectOptions): string {
  const sections = [
    `# ${opts.name}`,
    '\nA modern full-stack application built with TypeScript and Turbo.',
    '\n## Tech Stack\n',
    generateTechStack(opts),
    '\n## Getting Started\n',
    generateGettingStarted(opts),
    '\n## Project Structure\n',
    generateProjectStructure(opts),
    generateDatabaseSection(opts),
    generateAuthSection(opts),
    generateExtrasSection(opts),
    '\n## Scripts\n',
    generateScripts(opts),
  ]

  return sections.filter(Boolean).join('\n')
}

function generateTechStack(opts: ProjectOptions): string {
  const stack = []

  // Frontend
  if (opts.frontend.length > 0) {
    stack.push('### Frontend\n')
    opts.frontend.forEach((framework) => {
      switch (framework) {
        case 'nextjs':
          stack.push('- **Next.js** - React framework for production')
          break
        case 'react-router':
          stack.push('- **React Router** - Declarative routing for React')
          break
        case 'tanstack-start':
          stack.push(
            '- **TanStack Start** - Type-safe full-stack React framework',
          )
          break
      }
    })
    stack.push('')
  }

  // Backend
  if (opts.backend !== 'none') {
    stack.push('### Backend\n')
    switch (opts.backend) {
      case 'express':
        stack.push('- **Express** - Fast, unopinionated web framework')
        break
      case 'elysia':
        stack.push('- **Elysia** - Ergonomic framework for humans')
        break
      case 'hono':
        stack.push('- **Hono** - Small, simple, and ultrafast web framework')
        break
    }
    if (opts.api === 'none') stack.push('')
  }

  // API
  if (opts.api !== 'none') {
    switch (opts.api) {
      case 'trpc':
        stack.push('- **tRPC** - End-to-end typesafe APIs')
        break
      case 'orpc':
        stack.push('- **oRPC** - OpenAPI-compliant RPC framework')
        break
      case 'eden':
        stack.push('- **Eden** - End-to-end type safety for Elysia')
        break
      case 'hc':
        stack.push('- **Hono Client** - Type-safe client for Hono')
        break
    }
    stack.push('')
  }

  // Database
  if (opts.database !== 'none') {
    stack.push('### Database\n')
    switch (opts.database) {
      case 'drizzle':
        stack.push('- **Drizzle ORM** - TypeScript ORM with SQL-like syntax')
        break
      case 'prisma':
        stack.push('- **Prisma** - Next-generation Node.js and TypeScript ORM')
        break
      case 'mongoose':
        stack.push('- **Mongoose** - MongoDB object modeling for Node.js')
        break
    }
    if (opts.adapter === 'neon') {
      stack.push('- **Neon** - Serverless PostgreSQL database')
    }
    stack.push('')
  }

  // Auth
  if (opts.auth !== 'none') {
    stack.push('### Authentication\n')
    switch (opts.auth) {
      case 'next-auth':
        stack.push(
          '- **NextAuth.js** - Complete open source authentication solution',
        )
        break
      case 'better-auth':
        stack.push(
          '- **Better Auth** - Framework agnostic authentication library',
        )
        break
      case 'basic-auth':
        stack.push('- **Basic Auth** - Simple authentication implementation')
        break
    }
    stack.push('')
  }

  // Build Tools
  stack.push('### Build Tools\n')
  stack.push(
    '- **Turbo** - High-performance build system for JavaScript and TypeScript',
  )
  stack.push('- **TypeScript** - JavaScript with syntax for types')
  stack.push('- **ESLint** - Linting utility for JavaScript and TypeScript')
  stack.push('- **Prettier** - Opinionated code formatter')
  stack.push(
    `- **${PACKAGE_MANAGER_DISPLAY[opts.packageManager]}** - Package manager`,
  )

  return stack.join('\n')
}

function generateGettingStarted(opts: ProjectOptions): string {
  const steps = [
    '1. Clone the repository',
    '',
    '```bash',
    `git clone git@github.com:your-username/${opts.name}.git`,
    `cd ${opts.name}`,
    '```',
    '',
    '2. Install dependencies:',
    '',
    '```bash',
    `${opts.packageManager} install`,
    '```',
    '',
  ]

  if (opts.database !== 'none') {
    steps.push('3. Set up your environment variables:')
    steps.push('')
    steps.push('```bash')
    steps.push('cp .env.example .env')
    steps.push('```')
    steps.push('')
    steps.push('4. Set up the database:')
    steps.push('')
    steps.push('```bash')
    if (opts.database === 'drizzle') {
      steps.push(`${opts.packageManager} run db:push`)
    } else if (opts.database === 'prisma') {
      steps.push(`${opts.packageManager} run db:push`)
    }
    steps.push('```')
    steps.push('')
    steps.push('5. Start the development server:')
  } else {
    steps.push('3. Start the development server:')
  }

  steps.push('')
  steps.push('```bash')
  steps.push(`${opts.packageManager} run dev`)
  steps.push('```')

  return steps.join('\n')
}

function generateProjectStructure(opts: ProjectOptions): string {
  const structure = [
    '```text',
    `${opts.name}/`,
    '├── apps/                    # Applications',
  ]

  // build apps section
  const apps: string[] = opts.frontend
  if (opts.backend !== 'none') apps.push('api')
  apps.sort().forEach((app, index) => {
    const isLast = index === apps.length - 1
    const symbol = isLast ? '└──' : '├──'
    if (app === 'api')
      structure.push(
        `│   ${symbol} ${app}/${' '.repeat(20 - app.length)}# ${opts.backend.charAt(0).toUpperCase() + opts.backend.slice(1)} app`,
      )
    else
      structure.push(
        `│   ${symbol} ${app}/${' '.repeat(20 - app.length)}# ${app.charAt(0).toUpperCase() + app.slice(1)} app`,
      )
  })

  // build packages section
  structure.push('├── packages/                # Shared packages')
  const packages = ['ui', 'validators']
  if (opts.api !== 'none' && opts.backend === 'none') packages.push('api')
  if (opts.database !== 'none') packages.push('db')
  if (opts.extras.includes('email')) packages.push('email')
  packages.sort().forEach((pkg, index) => {
    const isLast = index === packages.length - 1
    const symbol = isLast ? '└──' : '├──'
    const description = DESCRIPTIONS[pkg as keyof typeof DESCRIPTIONS]
    structure.push(
      `│   ${symbol} ${pkg}/${' '.repeat(20 - pkg.length)}# ${description}`,
    )
  })

  // build tools section
  structure.push(
    '├── tools/                   # Build tools and configurations',
  )
  const tools = ['eslint', 'prettier', 'typescript']
  if (opts.extras.includes('gh-actions')) tools.push('github')
  tools.sort().forEach((tool, index) => {
    const isLast = index === tools.length - 1
    const symbol = isLast ? '└──' : '├──'
    const description = DESCRIPTIONS[tool as keyof typeof DESCRIPTIONS]
    structure.push(
      `│   ${symbol} ${tool}/${' '.repeat(20 - tool.length)}# ${description}`,
    )
  })

  structure.push('├── turbo.json               # Turbo configuration')
  structure.push('└── package.json             # Root package.json')
  structure.push('```')

  return structure.join('\n')
}

function generateDatabaseSection(opts: ProjectOptions): string {
  if (opts.database === 'none') return ''

  const sections = ['\n## Database\n']

  switch (opts.database) {
    case 'drizzle':
      sections.push('This project uses Drizzle ORM for database operations.')
      sections.push('')
      sections.push('### Database Commands')
      sections.push('')
      sections.push('```bash')
      sections.push('# Push schema changes to database')
      sections.push(`cd packages/db`)
      sections.push(`${opts.packageManager} run db:push`)
      sections.push('')
      sections.push('# Open Drizzle Studio')
      sections.push(`cd packages/db`)
      sections.push(`${opts.packageManager} run db:studio`)
      sections.push('```')
      break
    case 'prisma':
      sections.push('This project uses Prisma as the database ORM.')
      sections.push('')
      sections.push('### Database Commands')
      sections.push('')
      sections.push('```bash')
      sections.push('# Push schema changes to database')
      sections.push(`cd packages/db`)
      sections.push(`${opts.packageManager} run db:push`)
      sections.push('')
      sections.push('# Open Prisma Studio')
      sections.push(`cd packages/db`)
      sections.push(`${opts.packageManager} run db:studio`)
      sections.push('```')
      break
    case 'mongoose':
      sections.push('This project uses Mongoose for MongoDB operations.')
      break
  }

  sections.push('')
  return sections.join('\n')
}

function generateAuthSection(opts: ProjectOptions): string {
  if (opts.auth === 'none') return ''

  const sections = ['## Authentication', '']

  switch (opts.auth) {
    case 'next-auth':
      sections.push(
        'Authentication is handled by NextAuth.js with support for multiple providers.',
      )
      break
    case 'better-auth':
      sections.push(
        'Authentication is implemented using Better Auth for framework-agnostic support.',
      )
      break
    case 'basic-auth':
      sections.push('Basic authentication implementation for simple use cases.')
      break
  }

  sections.push('')
  return sections.join('\n')
}

function generateExtrasSection(opts: ProjectOptions): string {
  if (opts.extras.length === 0) return ''

  const sections = ['## Additional Features', '']

  if (opts.extras.includes('gh-actions')) {
    sections.push(
      '- **GitHub Actions** - CI/CD pipeline with type checking, linting, and formatting',
    )
  }
  if (opts.extras.includes('email')) {
    sections.push(
      '- **Email** - Email service with Resend provider and React Email templates',
    )
  }

  return sections.join('\n')
}

function generateScripts(opts: ProjectOptions): string {
  const scripts = [
    '```bash',
    '# Development',
    `${opts.packageManager} run dev          # Start development server`,
    `${opts.packageManager} run build        # Build for production`,
    '',
    '# Code Quality',
    `${opts.packageManager} run lint         # Run ESLint`,
    `${opts.packageManager} run typecheck    # Run TypeScript checks`,
  ]

  if (opts.database !== 'none') {
    scripts.push('')
    scripts.push('# Database')
    scripts.push(
      `${opts.packageManager} run db:push       # Push schema changes`,
    )
    scripts.push(
      `${opts.packageManager} run db:studio     # Open database studio`,
    )
  }

  scripts.push('```\n')
  return scripts.join('\n')
}

const PACKAGE_MANAGER_DISPLAY = {
  npm: 'NPM',
  yarn: 'Yarn',
  pnpm: 'PNPM',
  bun: 'Bun',
} as const

const DESCRIPTIONS = {
  ui: 'Shared shadcn/ui components',
  validators: 'Shared validation schemas',
  api: 'tRPC API package',
  db: 'Database package',
  email: 'Email service with Resend',
  eslint: 'ESLint configuration',
  prettier: 'Prettier configuration',
  typescript: 'TypeScript configuration',
  github: 'GitHub Actions workflows for CI/CD',
} as const
