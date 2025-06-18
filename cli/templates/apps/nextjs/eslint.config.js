import baseConfig, { restrictEnvAccess } from '@acme/eslint-config/base'
import nextConfig from '@acme/eslint-config/next'
import reactConfig from '@acme/eslint-config/react'

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
