import baseConfig from '@{{ name }}/eslint-config/base'

export default [
  {
    ignores: ['dist/**'],
  },
  ...baseConfig,
]
