import baseConfig, { restrictEnvAccess } from '@yuki/eslint-config/base'
import reactConfig from '@yuki/eslint-config/react'

/** @type {import('typescript-eslint').Config} */
export default [
  {
    ignores: ['.react-router/**', 'build/**'],
  },
  ...baseConfig,
  ...reactConfig,
  ...restrictEnvAccess,
]
