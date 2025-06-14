# create-yuki-stack

<div align="center">  
  [![NPM Downloads](https://img.shields.io/npm/dw/create-yuki-stack)](https://www.npmjs.com/package/create-yuki-stack)
  [![GitHub Stars](https://img.shields.io/github/stars/tiesen243/create-yuki-stack)](https://github.com/tiesen243/create-yuki-stack)
  [![License](https://img.shields.io/npm/l/create-yuki-stack)](https://github.com/tiesen243/create-yuki-stack/blob/main/LICENSE)
</div>

A modern CLI tool for scaffolding fully-typed, full-stack TypeScript applications with best practices and customizable technology choices.

## Features

- 🚀 **Multiple Frontend Options**: Next.js, React Router, TanStack Router, or Expo
- 🔄 **API Layer Options**: tRPC or oRPC for end-to-end type safety
- 🗄️ **Database Choices**: Prisma, Drizzle, or Mongoose
- 🔒 **Authentication**: Multiple auth solutions including NextAuth.js and Better Auth
- 🎨 **UI Components**: Optional shadcn/ui integration
- ⚡ **Turborepo**: Optimized monorepo structure for better developer experience
- 📦 **Shared Packages**: Common code in packages for better code reuse
- 🔧 **Pre-configured Tooling**: ESLint, Prettier, TypeScript

## Getting Started

To scaffold a new application using `create-yuki-stack`, run any of the following commands and follow the interactive prompts:

### npm

```bash
npm create yuki-stack
```

### yarn

```bash
yarn create yuki-stack
```

### pnpm

```bash
pnpm create yuki-stack
```

### bun

```bash
bun create yuki-stack
```

## CLI Options

| Option          | Description                               |
| --------------- | ----------------------------------------- |
| `-y, --yes`     | Skip all prompts and use default settings |
| `-h, --help`    | Display help information                  |
| `-V, --version` | Display version number                    |

### Default Options (with `-y` flag)

- **Name**: `my-yuki-app`
- **Frontend**: `Next.js`
- **Shadcn/UI**: `true` (included)
- **Database**: `none`
- **Adapter**: none
- **API**: `none`
- **Backend**: `none`
- **Auth**: none
- **Package Manager**: Auto-detected from environment
- **Install Dependencies**: `true`
- **Initialize Git**: `true`

## Tech Stack Options

<details>
<summary><b>Frontend Frameworks</b></summary>

- **Next.js**: Full-stack React framework with server components
- **React Router**: Standard React routing solution
- **TanStack Router**: Type-safe router with data loading
- **Expo**: React Native for mobile applications

</details>

<details>
<summary><b>Backend Frameworks</b></summary>

- **Express**: Industry standard Node.js web framework
- **Elysia**: High-performance Bun web framework with end-to-end type safety
- **Hono**: Lightweight, ultrafast web framework for the edge

</details>

<details>
<summary><b>API Layers</b></summary>

- **tRPC**: End-to-end typesafe APIs with minimal boilerplate
- **oRPC**: Optimized RPC library for efficient API calls

</details>

<details>
<summary><b>Database Options</b></summary>

- **Prisma**: Modern database toolkit with type safety
- **Drizzle**: Lightweight SQL ORM with type safety
- **Mongoose**: MongoDB ODM for flexible schemas

</details>

<details>
<summary><b>Authentication</b></summary>

- **Basic Auth**: Minimalist authentication implementation
- **Better Auth**: Modern authentication solution
- **Next Auth**: Authentication for Next.js

</details>

## Generated Project Structure

The generated project follows a monorepo structure using Turborepo with:

```
apps/
  ├─ nextjs/      # Next.js application
  ├─ api/         # API server (if selected)
  └─ native/      # Expo app (if selected)
packages/
  ├─ api/         # API definitions
  ├─ auth/        # Authentication utilities
  ├─ db/          # Database client and schema
  ├─ env/         # Environment variable validation
  ├─ ui/          # Shared UI components
  └─ validators/  # Shared validation schemas
```

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
