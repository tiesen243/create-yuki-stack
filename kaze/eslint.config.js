import { defineConfig } from 'eslint/config'

import baseConfig, { restrictEnvAccess } from '@yuki/eslint-config/base'
import nextjsConfig from '@yuki/eslint-config/next'
import reactConfig from '@yuki/eslint-config/react'

export default defineConfig(
  {
    ignores: ['.next/**', 'next-env.d.ts'],
  },
  ...baseConfig,
  ...reactConfig,
  ...nextjsConfig,
  ...restrictEnvAccess,
)
