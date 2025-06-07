import '@yuki/env'

import type { NextConfig } from 'next'

const nextConfig = {
  reactStrictMode: true,

  /** Enables hot reloading for local packages without a build step */
  transpilePackages: [
    '@yuki/api',
    '@yuki/auth',
    '@yuki/db',
    '@yuki/env',
    '@yuki/ui',
    '@yuki/validators',
  ],

  /** We already do linting and typechecking as separate tasks in CI */
  eslint: { ignoreDuringBuilds: true },
  typescript: { ignoreBuildErrors: true },
} satisfies NextConfig

export default nextConfig
