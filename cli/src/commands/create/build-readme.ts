import fs from 'fs/promises'

export async function buildReadme(projectConfig: ProjectConfig) {
  const readme = generateReadmeContent(projectConfig)
  await fs.writeFile('README.md', readme, 'utf-8')
}

function generateReadmeContent(config: ProjectConfig): string {
  const sections = [
    generateHeader(config.name),
    generateDescription(config),
    generateTechStack(config),
    generateQuickStart(config),
    generateProjectStructure(config),
    generateDevelopment(config),
    generateDeployment(),
    generateContributing(),
  ]

  return sections.filter(Boolean).join('\n\n')
}

function generateHeader(name: string): string {
  return `# ${name}

A modern, full-stack TypeScript monorepo template built with the latest technologies.`
}

function generateDescription(config: ProjectConfig): string {
  const features = []

  if (config.api !== 'none') {
    features.push(
      `🔗 End-to-end typesafe APIs with ${config.api.toUpperCase()}`,
    )
  }

  if (config.database !== 'none') {
    features.push(
      `🗄️ Database integration with ${config.database === 'prisma' ? 'Prisma' : 'Drizzle ORM'}`,
    )
  }

  if (config.auth !== 'none') {
    features.push(`🔐 Authentication ready with ${getAuthLabel(config.auth)}`)
  }

  if (config.shadcn) {
    features.push('🎨 Beautiful UI components with shadcn/ui')
  }

  features.push('⚡ Lightning fast development with Turbo')
  features.push('📦 Monorepo structure with shared packages')
  features.push('🔧 Pre-configured tooling (ESLint, Prettier, TypeScript)')

  return `## Features

${features.map((feature) => `- ${feature}`).join('\n')}`
}

function generateTechStack(config: ProjectConfig): string {
  let stack = `## Tech Stack

\`\`\`text
apps`

  const frontendApps = []

  // Frontend apps
  if (config.frontend.includes('nextjs')) {
    frontendApps.push(`nextjs
  |   ├─ Next.js 15
  |   ├─ React 19
  |   ├─ Tailwind CSS${
    config.api !== 'none'
      ? `
  |   └─ E2E Typesafe API Server & Client`
      : ''
  }`)
  }

  if (config.frontend.includes('react-router')) {
    frontendApps.push(`react-router
  |   ├─ React Router 7
  |   ├─ React 19
  |   ├─ Tailwind CSS${
    config.api !== 'none'
      ? `
  |   └─ E2E Typesafe API Server & Client`
      : ''
  }`)
  }

  if (config.frontend.includes('tanstack-start')) {
    frontendApps.push(`tanstack-start
  |   ├─ TanStack Start 1
  |   ├─ React 19
  |   ├─ Tailwind CSS${
    config.api !== 'none'
      ? `
  |   └─ E2E Typesafe API Server & Client`
      : ''
  }`)
  }

  if (config.frontend.includes('expo')) {
    frontendApps.push(`native
  |   ├─ Expo 53
  |   ├─ React Native using React 19${
    config.api !== 'none'
      ? `
  |   └─ Typesafe API calls using ${config.api.toUpperCase()}`
      : ''
  }`)
  }

  // Determine if we need to add backend to apps section
  const hasApiInApps = config.backend !== 'none' && config.api !== 'none'
  const hasBackendOnly = config.backend !== 'none' && config.api === 'none'

  // Add frontend apps with proper tree structure
  frontendApps.forEach((app, index) => {
    const isLast =
      index === frontendApps.length - 1 && !hasApiInApps && !hasBackendOnly
    stack += `
  ${isLast ? '└─' : '├─'} ${app}`
  })

  // Backend/API handling - Case 1: Both backend and API - merge into apps
  if (hasApiInApps) {
    const backendLabel =
      config.backend === 'express'
        ? 'Express'
        : config.backend === 'elysia'
          ? 'Elysia'
          : 'Hono'
    const apiLabel = config.api === 'trpc' ? 'tRPC v11' : 'oRPC'
    stack += `
  └─ api
      ├─ ${backendLabel} server
      ├─ ${apiLabel} router
      └─ TypeScript`
  }

  // Case 2: Only backend - add to apps
  if (hasBackendOnly) {
    const backendLabel =
      config.backend === 'express'
        ? 'Express'
        : config.backend === 'elysia'
          ? 'Elysia'
          : 'Hono'
    stack += `
  └─ api
      ├─ ${backendLabel} server
      └─ TypeScript`
  }

  stack += `
packages`

  const packages = []

  // API package - Case 3: Only API (trpc/orpc) - add to packages
  if (config.backend === 'none' && config.api !== 'none') {
    const apiLabel = config.api === 'trpc' ? 'tRPC v11' : 'oRPC'
    packages.push(`api
  |   └─ ${apiLabel} router definition`)
  }

  // Auth package
  if (config.auth !== 'none') {
    packages.push(`auth
  |   └─ ${getAuthDescription(config.auth)}`)
  }

  // Database package
  if (config.database !== 'none') {
    const dbLabel = config.database === 'prisma' ? 'Prisma ORM' : 'Drizzle ORM'
    packages.push(`db
  |   └─ Typesafe db calls using ${dbLabel}`)
  }

  // Environment package
  packages.push(`env
  |   └─ Typesafe environment variables`)

  // UI package
  packages.push(`ui
  |   └─ ${config.shadcn ? 'Beautiful UI components using shadcn/ui' : 'Basic UI components with Tailwind CSS'}`)

  // Validators package
  if (config.api !== 'none' || config.database !== 'none') {
    packages.push(`validators
  |   └─ Shared input validation schemas using zod`)
  }

  // Add packages with proper tree structure
  packages.forEach((pkg, index) => {
    const isLast = index === packages.length - 1
    stack += `
  ${isLast ? '└─' : '├─'} ${pkg}`
  })

  // Tooling section
  stack += `
tooling
  ├─ eslint
  |   └─ shared, fine-grained, eslint presets
  ├─ prettier
  |   └─ shared prettier configuration
  └─ typescript
      └─ shared tsconfig you can extend from
\`\`\``

  return stack
}

function generateQuickStart(config: ProjectConfig): string {
  const { packageManager } = config

  return `## Quick Start

\`\`\`bash
# Copy environment variables
cp .env.example .env

# Install dependencies
${packageManager} install

# Start development servers
${packageManager} run dev
\`\`\``
}

function generateProjectStructure(config: ProjectConfig): string {
  const appDescriptions = []

  // Frontend apps
  config.frontend.forEach((app) => {
    appDescriptions.push(`- **${app}**: ${getAppDescription(app)}`)
  })

  // Backend/API app
  if (config.backend !== 'none' && config.api !== 'none') {
    appDescriptions.push(
      `- **api**: ${getBackendDescription(config.backend)} with ${config.api.toUpperCase()} router`,
    )
  }

  // Backend only app
  if (config.backend !== 'none' && config.api === 'none') {
    appDescriptions.push(
      `- **${config.backend}**: ${getBackendDescription(config.backend)}`,
    )
  }

  const packageDescriptions = []

  // API package (only if API only, not backend)
  if (config.backend === 'none' && config.api !== 'none') {
    packageDescriptions.push(
      `- **api**: ${config.api.toUpperCase()} API router and type definitions`,
    )
  }

  // Other packages
  if (config.auth !== 'none') {
    packageDescriptions.push(
      `- **auth**: Authentication utilities and configuration`,
    )
  }
  if (config.database !== 'none') {
    packageDescriptions.push(`- **db**: Database schema and utilities`)
  }
  packageDescriptions.push(
    `- **env**: Environment variable validation and type safety`,
  )
  packageDescriptions.push(
    `- **ui**: Shared UI components${config.shadcn ? ' with shadcn/ui' : ''}`,
  )
  if (config.api !== 'none' || config.database !== 'none') {
    packageDescriptions.push(`- **validators**: Shared validation schemas`)
  }

  return `## Project Structure

This monorepo uses [Turbo](https://turbo.build) and contains:

### Apps
${appDescriptions.join('\n')}

### Packages
${packageDescriptions.join('\n')}

### Tooling
- **eslint**: Shared ESLint configuration
- **prettier**: Code formatting configuration  
- **typescript**: Shared TypeScript configuration`
}

function generateDevelopment(config: ProjectConfig): string {
  const { packageManager } = config

  return `## Development

\`\`\`bash
# Install dependencies
${packageManager} install

# Start all development servers
${packageManager} run dev

# Run specific app
${packageManager} run dev --filter=nextjs

# Build all apps and packages
${packageManager} run build

# Run tests
${packageManager} run test

# Lint and format
${packageManager} run lint
${packageManager} run format
\`\`\`

### Available Scripts

- \`dev\`: Start all development servers
- \`build\`: Build all apps and packages
- \`lint\`: Lint all packages
- \`format\`: Format code with prettier
- \`typecheck\`: Run TypeScript type checking
- \`clean\`: Clean all build artifacts`
}

function generateDeployment(): string {
  return `## Deployment

This project is configured for easy deployment on various platforms:

- **Vercel**: Deploy Next.js apps with zero configuration
- **Railway**: Deploy backend services with automatic scaling

See individual app directories for specific deployment instructions.`
}

function generateContributing(): string {
  return `## Contributing

1. Fork the repository
2. Create your feature branch (\`git checkout -b feature/amazing-feature\`)
3. Commit your changes (\`git commit -m 'Add some amazing feature'\`)
4. Push to the branch (\`git push origin feature/amazing-feature\`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.`
}

function getAuthLabel(auth: string): string {
  switch (auth) {
    case 'basic-auth':
      return 'Basic Auth'
    case 'better-auth':
      return 'Better Auth'
    case 'next-auth':
      return 'NextAuth.js'
    default:
      return auth
  }
}

function getAuthDescription(auth: string): string {
  switch (auth) {
    case 'basic-auth':
      return 'Basic authentication built from scratch'
    case 'better-auth':
      return 'Modern authentication with Better Auth'
    case 'next-auth':
      return 'Authentication using NextAuth.js'
    default:
      return 'Authentication configuration'
  }
}

function getAppDescription(app: string): string {
  switch (app) {
    case 'nextjs':
      return 'Next.js 15 application with React 19'
    case 'react-router':
      return 'React Router 7 application'
    case 'tanstack-start':
      return 'TanStack Start application'
    case 'expo':
      return 'Expo React Native application'
    default:
      return `${app} application`
  }
}

function getBackendDescription(backend: string): string {
  switch (backend) {
    case 'express':
      return 'Express.js server'
    case 'elysia':
      return 'Elysia server with Bun runtime'
    case 'hono':
      return 'Hono server framework'
    default:
      return `${backend} server`
  }
}
