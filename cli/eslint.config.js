import { defineConfig } from 'eslint/config'

import baseConfig from '@yuki/eslint-config/base'
import reactConfig from '@yuki/eslint-config/react'

export default defineConfig(
  {
    ignores: ['dist/**', 'templates/**'],
  },
  ...baseConfig,
  ...reactConfig,
)
