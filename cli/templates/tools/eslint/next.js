import nextPlugin from '@next/eslint-plugin-next'
import { defineConfig } from 'eslint/config'

export default defineConfig({
  files: ['**/*.ts', '**/*.tsx'],
  // @ts-ignore
  plugins: { '@next/next': nextPlugin },
  // @ts-ignore
  rules: {
    ...nextPlugin.configs.recommended.rules,
    ...nextPlugin.configs['core-web-vitals'].rules,
  },
})
