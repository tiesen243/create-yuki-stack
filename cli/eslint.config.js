import baseConfig from '@yuki/eslint-config/base'
import reactConfig from '@yuki/eslint-config/react'

export default [
  {
    ignores: ['dist/**', 'templates/**'],
  },
  ...baseConfig,
  ...reactConfig,
]
