import baseConfig from '../tools/eslint/base.js'
import reactConfig from '../tools/eslint/react.js'

export default [
  {
    ignores: ['dist/**', 'templates/**'],
  },
  ...baseConfig,
  ...reactConfig,
]
