import { defineConfig } from 'eslint/config'

import baseConfig, { restrictEnvAccess } from '@{{ name }}/eslint-config/base'
import nextConfig from '@{{ name }}/eslint-config/next'
import reactConfig from '@{{ name }}/eslint-config/react'

export default defineConfig(
  {
    ignores: ['.next/**', 'next-env.d.ts'],
  },
  ...baseConfig,
  ...reactConfig,
  ...nextConfig,
  ...restrictEnvAccess,
)
