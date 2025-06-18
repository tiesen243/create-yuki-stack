import '@acme/validators/env'

import type { NextConfig } from 'next'

const nextConfig = {
  reactStrictMode: true,

  typescript: { ignoreBuildErrors: true },
  eslint: { ignoreDuringBuilds: true },

  transpilePackages: [
    '@acme/api',
    '@acme/auth',
    '@acme/db',
    '@acme/ui',
    '@acme/validators',
  ],
} satisfies NextConfig

export default nextConfig
