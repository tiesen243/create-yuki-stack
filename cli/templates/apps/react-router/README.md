# React Router App

A modern React application built with React Router v7, featuring file-based routing and server-side rendering capabilities.

## Features

- ⚡ **React Router v7** - Latest version with enhanced SSR support
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
   {{ pkm }} run dev -F @{{ name }}/react-router...
   ```

3. Open [http://localhost:3001](http://localhost:3001) in your browser

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

1. Install Vercel preset

```bash
{{ pkm }} install @vercel/react-router
```

2. Update your `react-router.config.ts`

```ts
import type { Config } from '@react-router/dev/config'
import { vercelPreset } from '@vercel/react-router/vite'

export default {
  ...other options
  presets: [vercelPreset()],
} satisfies Config
```

3. Update start script in `package.json`

```json
{
  "scripts": {
    ...other scripts
    "start": "PORT=3001 bun run with-env react-router-serve ./build/server/nodejs_*/index.js",
  },
}
```

4. Connect your repository to Vercel
5. Set the root directory to this application folder
6. Deploy

### Other Platforms

1. Build the application:

   ```bash
   {{ pkm }} run build
   ```

2. Start the production server:

   ```bash
   {{ pkm }} run start
   ```
