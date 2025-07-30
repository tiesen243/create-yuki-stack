# create-yuki-stack

<div align="center">

[![NPM Downloads](https://img.shields.io/npm/dw/create-yuki-stack)](https://www.npmjs.com/package/create-yuki-stack)
[![GitHub Stars](https://img.shields.io/github/stars/tiesen243/create-yuki-stack)](https://github.com/tiesen243/create-yuki-stack)
[![License](https://img.shields.io/npm/l/create-yuki-stack)](https://github.com/tiesen243/create-yuki-stack/blob/main/LICENSE)
[![Ask DeepWiki](https://deepwiki.com/badge.svg)](https://deepwiki.com/tiesen243/create-yuki-stack)

</div>

A modern CLI tool for scaffolding fully-typed, full-stack TypeScript applications with best practices and customizable technology choices.

## Features

- 🚀 **Multiple Frontend Options**: Next.js, React Router or TanStack Start
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

| Option                       | Description                                                                |
| ---------------------------- | -------------------------------------------------------------------------- |
| `-y, --yes`                  | Skip all prompts and use [default settings](#default-options-with--y-flag) |
| `--no-yes`                   | Negate `--yes` option                                                      |
| `--frontend [values...]`     | Frontend frameworks (choices: nextjs, react-router, tanstack-start)        |
| `--database [string]`        | Database option (choices: none, drizzle, prisma, mongoose)                 |
| `--adapter [string]`         | Database adapter (choices: none, neon)                                     |
| `--backend [string]`         | Backend framework (choices: none, express, elysia, hono)                   |
| `--api [string]`             | API type (choices: none, eden, trpc, orpc)                                 |
| `--auth [string]`            | Authentication (choices: none, basic-auth, better-auth, next-auth)         |
| `--extras [values...]`       | Add extra packages and tooling (choices: gh-actions, email)                |
| `--package-manager [string]` | Package manager (choices: npm, yarn, pnpm, bun)                            |
| `--install`                  | Install dependencies after setup                                           |
| `--no-install`               | Negate `--install` option                                                  |
| `--git`                      | Initialize git repository                                                  |
| `--no-git`                   | Negate `--git` option                                                      |
| `-h, --help`                 | Display help information                                                   |
| `-V, --version`              | Display version number                                                     |

### Default Options (with `-y` flag)

- **Name**: `my-yuki-app`
- **Frontend**: [`Next.js`]
- **Database**: `none`
- **Adapter**: none
- **Backend**: `none`
- **API**: `none`
- **Auth**: none
- **Extras**: []
- **Package Manager**: Auto-detected from environment
- **Install Dependencies**: `true`
- **Initialize Git**: `true`

## Tech Stack Options

<details>
<summary><b>Frontend Frameworks</b></summary>

- **Next.js**: The React Framework for the Web
- **React Router**: A user‑obsessed, standards‑focused, multi‑strategy router you can deploy anywhere
- **TanStack Start**: Full-stack React and Solid framework powered by TanStack Router

</details>

<details>
<summary><b>Backend Frameworks</b></summary>

- **Elysia**: Ergonomic Framework for Humans & Fox Girls
- **Express**: Fast, unopinionated, minimalist web framework for Node.js
- **Hono**: Fast, lightweight, built on Web Standards. Support for any JavaScript runtime

</details>

<details>
<summary><b>API Layers</b></summary>

- **eden**: End-to-end type-safe APIs with Elysia
- **tRPC**: Move Fast and Break Nothing. End-to-end typesafe APIs made easy
- **oRPC**: Easy to build APIs that are end-to-end type-safe and adhere to OpenAPI standards

</details>

<details>
<summary><b>Database Options</b></summary>

- **Drizzle**: A lightweight and performant TypeScript ORM with developer experience in mind
- **Prisma**: Ship at lightning speed, and scale to a global audience effortlessly with our next-gen serverless Postgres database
- **Mongoose**: Elegant MongoDB object modeling for Node.js

</details>

<details>
<summary><b>Authentication</b></summary>

- **Basic Auth**: Basic authentication built from scratch based on [Lucia](https://lucia-auth.com)
- **Better Auth**: The most comprehensive authentication framework for TypeScript
- **Next Auth**: Authentication for Next.js applications

</details>

<details>
<summary><b>Extras</b></summary>

- **Github Actions**: Automated CI/CD workflows for: `format`, `lint`, `typecheck` with reusable setup actions supporting multiple package managers (npm, yarn, pnpm, bun)
- **Email**: Send transactional emails using `Resend` API with customizable `React Email` templates

</details>

## Generated Project Structure

The generated project follows a monorepo structure using Turborepo with:

```
apps/
  ├─ api/         # API server
  └─ nextjs/      # Next.js application
packages/
  ├─ auth/        # Authentication utilities
  ├─ db/          # Database client and schema
  ├─ ui/          # Shared UI components
  └─ validators/  # Shared validation schemas
```

## Notes

- If your packages or apps use `env` from `packages/validators`, you need to add `DOM` to your `tsconfig.json` file because the validators package uses browser APIs:

  ```json
  {
    "compilerOptions": {
      "lib": ["DOM", "ES2022"]
    }
  }
  ```

- **Elysia.js Node Adapter Issue (2025-07-31)**: The `@elysiajs/node` adapter is missing the `stop` method which can cause graceful shutdown issues. To fix this, add a custom `stop` method to your adapter configuration:
  ```typescript
  new Elysia({
    aot: true,
    prefix: '/api',
    adapter: {
      ...node(),
      async stop(app) {
        await app.stop(true)
      },
    },
  })
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
