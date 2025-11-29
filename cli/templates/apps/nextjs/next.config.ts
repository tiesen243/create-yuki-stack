import '@{{ name }}/validators/env'

import type { NextConfig } from 'next'

const nextConfig = {
  typedRoutes: true,
  reactStrictMode: true,
  typescript: { ignoreBuildErrors: true },

  transpilePackages: [
    '@{{ name }}/api',
    '@{{ name }}/auth',
    '@{{ name }}/db',
    '@{{ name }}/lib',
    '@{{ name }}/ui',
    '@{{ name }}/validators',
  ],
} satisfies NextConfig

export default nextConfig
