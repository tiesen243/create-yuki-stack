# Next.js Application

A modern Next.js application built with TypeScript, Tailwind CSS, and integrated into the Yuki stack monorepo.

## Features

- ⚡ **Next.js 15** - Latest version with App Router
- 🎨 **Tailwind CSS v4** - Modern utility-first CSS framework
- 📱 **Responsive Design** - Mobile-first approach
- 🔧 **TypeScript** - Full type safety
- 🎯 **ESLint & Prettier** - Code quality and formatting
- 🚀 **Turbopack** - Fast development builds
- 📦 **Workspace Integration** - Shared UI components and validators
- 🖼️ **Open Graph API** - Dynamic social media previews

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
   {{ pkm }} run dev -F @{{ name }}/nextjs...
   ```

3. Open [http://localhost:3000](http://localhost:3000) in your browser

The application will hot-reload as you make changes to the code.

## Available Scripts

- `dev` - Start development server with Turbopack
- `build` - Build the application for production
- `start` - Start the production server
- `lint` - Run ESLint
- `typecheck` - Run TypeScript type checking
- `format` - Check code formatting with Prettier
- `clean` - Clean build artifacts and dependencies

## Deployment

### Vercel (Recommended)

1. Connect your repository to Vercel
2. Set the root directory to this application folder
3. Deploy

### Other Platforms

1. Build the application:

   ```bash
   {{ pkm }} run build
   ```

2. Start the production server:

   ```bash
   {{ pkm }} run start
   ```
