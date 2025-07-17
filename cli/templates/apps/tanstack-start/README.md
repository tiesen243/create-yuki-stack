# Tanstack Start App

A modern React application built with TanStack Router, featuring type-safe routing and server-side rendering capabilities.

## Features

- ⚡ **TanStack Router** - Type-safe routing with automatic route generation
- ⚡ **TanStack Start** - Server-side rendering capabilities
- 🎨 **Tailwind CSS v4** - Modern utility-first CSS framework
- 📱 **Responsive Design** - Mobile-first approach
- 🔧 **TypeScript** - Full type safety
- 🎯 **ESLint & Prettier** - Code quality and formatting
- 📦 **Workspace Integration** - Shared UI components and validators

## Getting Started

### Prerequisites

Make sure you have the following installed:

- Node.js (LTS version recommended)
- Your preferred package manager (npm, yarn, pnpm, or bun)

### Development

1. Install dependencies from the root of the monorepo:

   ```bash
   {{ pkm }} install
   ```

2. Start the development server:

   ```bash
   {{ pkm }} run dev
   # or
   {{ pkm }} run dev -F @{{ name }}/tanstack-start...  
   ```

3. Open [http://localhost:3002](http://localhost:3002) in your browser

The application will hot-reload as you make changes to the code.

## Available Scripts

- `dev` - Start development server
- `build` - Build for production
- `start` - Start production server
- `typecheck` - Run TypeScript type checking
- `lint` - Run ESLint with type generation
- `format` - Check code formatting with Prettier
- `clean` - Clean build artifacts and dependencies

## Deployment

### Vercel

1. Update your `vite.config.ts`

```ts
tanstackStart({ target: 'vercel' }),
```

2. Connect your repository to Vercel
3. Set the root directory to this application folder
4. Deploy

### Other Platforms

1. Build the application:

   ```bash
   {{ pkm }} run build
   ```

2. Start the production server:

   ```bash
   {{ pkm }} run start
   ```
