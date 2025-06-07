# create-yuki-turbo

## Installation

> [!NOTE]
>
> Make sure to follow the system requirements specified in [`package.json#engines`](./package.json#L63) before proceeding.

There are two ways of initializing an app using the `create-yuki-turbo` starter. You can either use this repository as a template:

Click the "Use this template" button on the top right of the repository,

or use Turbo's CLI to init your project (use Bun as package manager):

```bash
bun create turbo@latest --example https://github.com/tiesen243/create-yuki-turbo
```

## About

This template is based on [create-t3-turbo](https://github.com/t3-oss/create-t3-turbo) by @t3-oss with some modifications to fit my personal preferences.

It uses [Turborepo](https://turborepo.org) and contains:

```text
.github
  └─ workflows
        └─ CI to check the monorepo: format, lint, and typecheck
apps
  ├─ nextjs
  |   ├─ Next.js 15
  |   ├─ React 19
  |   ├─ Tailwind CSS
  |   └─ E2E Typesafe API Server & Client
  ├─ react-router
  |   ├─ React Router 7
  |   ├─ React 19
  |   ├─ Tailwind CSS
  |   └─ E2E Typesafe API Server & Client
  ├─ tanstack-start (COMING SOON)
  |   ├─ TanStack Start 1
  |   ├─ React 19
  |   ├─ Tailwind CSS
  |   └─ E2E Typesafe API Server & Client
  └─ native
      ├─ Expo 53 (EXPERIMENTAL)
      ├─ React Native using React 19
      └─ Typesafe API calls using tRPC
packages
  ├─ api
  |   └─ tRPC v11 router definition
  ├─ auth
  |   └─ Authentication from scratch using arctic for OAuth.
  ├─ db
  |   └─ Typesafe db calls using Drizzle ORM
  ├─ env
  |   └─ Typesafe environment variables
  ├─ ui
  |   └─ Start of a UI package for the webapp using shadcn-ui
  └─ validators
      └─ Shared input validation schemas using zod
tooling
  ├─ eslint
  |   └─ shared, fine-grained, eslint presets
  ├─ prettier
  |   └─ shared prettier configuration
  └─ typescript
      └─ shared tsconfig you can extend from
```

> In this template, we use `@yuki` as a placeholder for package names. As a user, you might want to replace it with your own organization or project name. You can use find-and-replace to change all the instances of `@yuki` to something like `@my-company` or `@project-name`.

## Quick Start

> **Note**
> The [db](./packages/db) package is preconfigured to use Neon and is **edge-bound**. If you're using something else, make the necessary modifications to the [schema](./packages/db/src/schema) as well as the [client](./packages/db/src/index.ts). If you want to switch to non-edge database driver, remove `export const runtime = "edge";` [from all pages and api routes](https://github.com/t3-oss/create-t3-turbo/issues/634#issuecomment-1730240214).

To get it running, follow the steps below:

### 1. Setup dependencies

```bash
# Install dependencies
bun i

# Configure environment variables
# There is an `.env.example` in the root directory you can use for reference
cp .env.example .env

# Push the Drizzle schema to the database
bun db:push
```

### 2. Configure Expo `dev`-script

#### Use IOS Simulator

1. Make sure you have XCode and XCommand Line Tools installed [as shown on expo docs](https://docs.expo.dev/workflow/ios-simulator).

   > **NOTE:** If you just installed XCode, or if you have updated it, you need to open the simulator manually once. Run `npx expo start` from `apps/native`, and then enter `I` to launch Expo Go. After the manual launch, you can run `bun dev` in the root directory.

   ```diff
   +  "dev": "expo start --ios",
   ```

2. Run `bun dev` at the project root folder.

#### Use Android Emulator

1. Install Android Studio tools [as shown on expo docs](https://docs.expo.dev/workflow/android-studio-emulator).

2. Change the `dev` script at `apps/native/package.json` to open the Android emulator.

   ```diff
   +  "dev": "expo start --android",
   ```

3. Run `bun dev` at the project root folder.

### 3. Configuring Auth to work with Expo

In order to get Auth to work with Expo, you must:

The [packages/auth](./packages/auth/src/core/auth.ts#L105) directory contains an OAuth proxy server. Deploy `nextjs` app and set the `AUTH_PROXY_URL` environment variable to the proxy's URL to enable OAuth for Expo apps in both preview deployments and development environments.

This proxy server approach forwards authentication requests from Next.js apps to handle the OAuth flow, then redirects back to your app. The advantage is maintaining a stable, publicly accessible URL that works regardless of deployment changes or local port assignments (e.g., if your Next.js app runs on port 3001 instead of 3000, authentication still functions without reconfiguring OAuth providers).

### 4a. When it's time to add a new UI component

Run the `ui-add` script to add a new UI component using the interactive `shadcn/ui` CLI:

```bash
bun ui-add
```

When the component(s) has been installed, you should be good to go and start using it in your app.

### 4b. When it's time to add a new package

To add a new package, simply run `bun turbo gen init` in the monorepo root. This will prompt you for a package name as well as if you want to install any dependencies to the new package (of course you can also do this yourself later).

The generator sets up the `package.json`, `tsconfig.json` and a `index.ts`, as well as configures all the necessary configurations for tooling around your package such as formatting, linting and typechecking. When the package is created, you're ready to go build out the package.

### 4c. When it's time to update the dependencies

To update the dependencies, run the following command:

```bash
bun bump-deps
```

This will update all the dependencies in the monorepos to the latest version.

## Deployment

### Web

Let's deploy the Next.js application to [Vercel](https://vercel.com). If you've never deployed a Turborepo app there, don't worry, the steps are quite straightforward. You can also read the [official Turborepo guide](https://vercel.com/docs/concepts/monorepos/turborepo) on deploying to Vercel.

1. Create a new project on Vercel, select the `apps/nextjs` or `apps/react-router` or `apps/tanstack-start` folder as the root directory. Vercel's zero-config system should handle all configurations for you.

2. Add your environment variable. See `.env.example` for required variables.

3. Done! Your app should successfully deploy.

### Native

Deploying your Expo application works slightly differently compared to Next.js on the web. Instead of "deploying" your app online, you need to submit production builds of your app to app stores, like [Apple App Store](https://www.apple.com/app-store) and [Google Play](https://play.google.com/store/apps). You can read the full [guide to distributing your app](https://docs.expo.dev/distribution/introduction), including best practices, in the Expo docs.

1. Let's start by setting up [EAS Build](https://docs.expo.dev/build/introduction), which is short for Expo Application Services. The build service helps you create builds of your app, without requiring a full native development setup. The commands below are a summary of [Creating your first build](https://docs.expo.dev/build/setup).

   ```bash
   # Install the EAS CLI
   bun add -g eas-cli

   # Log in with your Expo account
   eas login

   # Configure your Expo app
   cd apps/native
   eas build:configure
   ```

2. After the initial setup, you can create your first build. You can build for Android and iOS platforms and use different [`eas.json` build profiles](https://docs.expo.dev/build-reference/eas-json) to create production builds or development, or test builds. Let's make a production build for iOS.
3. After the initial setup, you can create your first build. You can build for Android and iOS platforms and use different [`eas.json` build profiles](https://docs.expo.dev/build-reference/eas-json) to create production builds or development, or test builds. Let's make a production build for iOS.

   ```bash
   eas build --platform ios --profile production
   ```

   > If you don't specify the `--profile` flag, EAS uses the `production` profile by default.

4. Now that you have your first production build, you can submit this to the stores. [EAS Submit](https://docs.expo.dev/submit/introduction) can help you send the build to the stores.

   ```bash
   eas submit --platform ios --latest
   ```

   > You can also combine build and submit in a single command, using `eas build ... --auto-submit`.

5. Before you can get your app in the hands of your users, you'll have to provide additional information to the app stores. This includes screenshots, app information, privacy policies, etc. _While still in preview_, [EAS Metadata](https://docs.expo.dev/eas/metadata) can help you with most of this information.

6. Once everything is approved, your users can finally enjoy your app. Let's say you spotted a small typo; you'll have to create a new build, submit it to the stores, and wait for approval before you can resolve this issue. In these cases, you can use EAS Update to quickly send a small bugfix to your users without going through this long process. Let's start by setting up EAS Update.

   The steps below summarize the [Getting started with EAS Update](https://docs.expo.dev/eas-update/getting-started/#configure-your-project) guide.

   ```bash
   # Add the `expo-updates` library to your Expo app
   cd apps/native
   bun expo install expo-updates

   # Configure EAS Update
   eas update:configure
   ```

7. Before we can send out updates to your app, you have to create a new build and submit it to the app stores. For every change that includes native APIs, you have to rebuild the app and submit the update to the app stores. See steps 2 and 3.

8. Now that everything is ready for updates, let's create a new update for `production` builds. With the `--auto` flag, EAS Update uses your current git branch name and commit message for this update. See [How EAS Update works](https://docs.expo.dev/eas-update/how-eas-update-works/#publishing-an-update) for more information.

   ```bash
   cd apps/native
   eas update --auto
   ```

   > Your OTA (Over The Air) updates must always follow the app store's rules. You can't change your app's primary functionality without getting app store approval. But this is a fast way to update your app for minor changes and bug fixes.

9. Done! Now that you have created your production build, submitted it to the stores, and installed EAS Update, you are ready for anything!

## References

The stack originates from [create-t3-turbo](https://github.com/t3-oss/create-t3-turbo)

## License

This project is licensed under the MIT License - see the [LICENSE](./LICENSE) file for details.
