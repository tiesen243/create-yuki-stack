import type { NextConfig } from 'next'

const nextConfig = {
  typedRoutes: true,
  reactStrictMode: true,
  typescript: { ignoreBuildErrors: true },

  transpilePackages: ['@yuki/ui'],
} satisfies NextConfig

export default nextConfig
