import { defineConfig } from 'eslint/config'

import baseConfig, { restrictEnvAccess } from '@{{ name }}/eslint-config/base'
import reactConfig from '@{{ name }}/eslint-config/react'

export default defineConfig(
  {
    ignores: ['.react-router/**', 'build/**'],
  },
  ...baseConfig,
  ...reactConfig,
  ...restrictEnvAccess,
)
