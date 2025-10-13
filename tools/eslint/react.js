import reactPlugin from '@eslint-react/eslint-plugin'
// @ts-ignore
import a11yPlugin from 'eslint-plugin-jsx-a11y'
import hooksPlugin from 'eslint-plugin-react-hooks'
import { defineConfig } from 'eslint/config'

export default defineConfig({
  files: ['**/*.ts', '**/*.tsx'],
  plugins: {
    ...reactPlugin.configs.all.plugins,
    'react-hooks': hooksPlugin,
    'jsx-a11y': a11yPlugin,
  },
  rules: {
    ...reactPlugin.configs['recommended-type-checked'].rules,
    // @ts-ignore
    ...hooksPlugin.configs.recommended.rules,
    ...a11yPlugin.flatConfigs.strict.rules,

    '@eslint-react/jsx-shorthand-boolean': 'warn',
    '@eslint-react/jsx-shorthand-fragment': 'warn',
    '@eslint-react/no-children-prop': 'error',
    '@eslint-react/no-unnecessary-key': 'warn',
    '@eslint-react/no-useless-fragment': 'warn',
    '@eslint-react/prefer-destructuring-assignment': 'warn',
    '@eslint-react/prefer-namespace-import': 'warn',
    '@eslint-react/naming-convention/component-name': [
      'warn',
      { rule: 'PascalCase', allowAllCaps: true },
    ],
  },
  settings: reactPlugin.configs['recommended-typescript'].settings,
})
