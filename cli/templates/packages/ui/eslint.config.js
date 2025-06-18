import baseConfig from '@{{ name }}/eslint-config/base'
import reactConfig from '@{{ name }}/eslint-config/react'

/** @type {import('typescript-eslint').Config} */
export default [
  {
    ignores: ['dist/**'],
  },
  ...baseConfig,
  ...reactConfig,
]
