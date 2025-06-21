import baseConfig, { restrictEnvAccess } from '@{{ name }}/eslint-config/base'
import reactConfig from '@{{ name }}/eslint-config/react'

/** @type {import('typescript-eslint').Config} */
export default [
  {
    ignores: ['.nitro/**', '.output/**', '.tanstack/**'],
  },
  ...baseConfig,
  ...reactConfig,
  ...restrictEnvAccess,
]
