import '@{{ name }}/validators/env'

import type { NextConfig } from 'next'

const nextConfig = {
  reactStrictMode: true,

  typescript: { ignoreBuildErrors: true },
  eslint: { ignoreDuringBuilds: true },

  transpilePackages: [
    '@{{ name }}/api',
    '@{{ name }}/auth',
    '@{{ name }}/db',
    '@{{ name }}/ui',
    '@{{ name }}/validators',
  ],
} satisfies NextConfig

export default nextConfig
