import baseConfig from '../tooling/eslint/base.js'
import reactConfig from '../tooling/eslint/react.js'

/** @type {import('typescript-eslint').Config} */
export default [
  {
    ignores: ['dist/**', 'templates/**'],
  },
  ...baseConfig,
  ...reactConfig,
]
