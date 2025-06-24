import baseConfig from '../tools/eslint/base.js'
import reactConfig from '../tools/eslint/react.js'

/** @type {import('typescript-eslint').Config} */
export default [
  {
    ignores: ['dist/**', 'templates/**'],
  },
  ...baseConfig,
  ...reactConfig,
]
