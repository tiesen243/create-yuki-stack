import baseConfig, { restrictEnvAccess } from '@{{ name }}/eslint-config/base'
import nextConfig from '@{{ name }}/eslint-config/next'
import reactConfig from '@{{ name }}/eslint-config/react'

/** @type {import('typescript-eslint').Config} */
export default [
  {
    ignores: ['.next/**'],
  },
  ...baseConfig,
  ...reactConfig,
  ...nextConfig,
  ...restrictEnvAccess,
]
