import { defineConfig } from 'eslint/config'

import baseConfig from '@{{ name }}/eslint-config/base'

export default defineConfig(
  {
    ignores: ['dist/**'],
  },
  ...baseConfig,
)
