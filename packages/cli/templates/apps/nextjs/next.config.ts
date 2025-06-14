import '@{{ name }}/env'

import type { NextConfig } from 'next'

const nextConfig = {
  reactStrictMode: true,

  /** Enables hot reloading for local packages without a build step */
  transpilePackages: [
    '@{{ name }}/api',
    '@{{ name }}/db',
    '@{{ name }}/env', 
    '@{{ name }}/ui',
    '@{{ name }}/validators',
  ],

  /** We already do linting and typechecking as separate tasks in CI */
  eslint: { ignoreDuringBuilds: true },
  typescript: { ignoreBuildErrors: true },
} satisfies NextConfig

export default nextConfig
