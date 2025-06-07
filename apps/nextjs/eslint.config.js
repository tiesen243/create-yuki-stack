import baseConfig, { restrictEnvAccess } from '@yuki/eslint-config/base'
import nextjsConfig from '@yuki/eslint-config/nextjs'
import reactConfig from '@yuki/eslint-config/react'

/** @type {import('typescript-eslint').Config} */
export default [
  {
    ignores: ['.next/**'],
  },
  ...baseConfig,
  ...reactConfig,
  ...nextjsConfig,
  ...restrictEnvAccess,
]
