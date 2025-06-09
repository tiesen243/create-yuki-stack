import baseConfig, { restrictEnvAccess } from '@{{ name }}/eslint-config/base'
import reactConfig from '@{{ name }}/eslint-config/react'

/** @type {import('typescript-eslint').Config} */
export default [
  {
    ignores: ['.output/**', '.vinxi/**'],
  },
  ...baseConfig,
  ...reactConfig,
  ...restrictEnvAccess,
]
