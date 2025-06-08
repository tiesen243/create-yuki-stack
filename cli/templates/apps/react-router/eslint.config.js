import baseConfig, { restrictEnvAccess } from '@{{ name }}/eslint-config/base'
import reactConfig from '@{{ name }}/eslint-config/react'

/** @type {import('typescript-eslint').Config} */
export default [
  {
    ignores: ['.react-router/**', 'build/**'],
  },
  ...baseConfig,
  ...reactConfig,
  ...restrictEnvAccess,
]
