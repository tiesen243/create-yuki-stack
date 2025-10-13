import baseConfig from '@{{ name }}/eslint-config/base'
import reactConfig from '@{{ name }}/eslint-config/react'

export default [
  {
    ignores: ['dist/**'],
  },
  ...baseConfig,
  ...reactConfig,
]
