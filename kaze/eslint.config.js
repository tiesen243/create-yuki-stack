import baseConfig from '@yuki/eslint-config/base'
import nextjsConfig from '@yuki/eslint-config/next'
import reactConfig from '@yuki/eslint-config/react'

export default [
  {
    ignores: ['.next/**', 'next-env.d.ts'],
  },
  ...baseConfig,
  ...reactConfig,
  ...nextjsConfig,
]
