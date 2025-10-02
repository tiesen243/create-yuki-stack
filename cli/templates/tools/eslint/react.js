import reactPlugin from '@eslint-react/eslint-plugin'
// @ts-ignore
import a11yPlugin from 'eslint-plugin-jsx-a11y'
import hooksPlugin from 'eslint-plugin-react-hooks'

/** @type {Awaited<import('typescript-eslint').Config>} */
export default [
  {
    files: ['**/*.ts', '**/*.tsx'],
    plugins: {
      ...reactPlugin.configs['recommended-typescript'].plugins,
      'react-hooks': hooksPlugin,
      'jsx-a11y': a11yPlugin,
    },
    rules: {
      ...reactPlugin.configs['recommended-type-checked'].rules,
      ...reactPlugin.configs['recommended-typescript'].rules,
      ...a11yPlugin.flatConfigs.strict.rules,

      '@eslint-react/no-children-prop': 'error',
      '@eslint-react/prefer-destructuring-assignment': 'warn',
      '@eslint-react/prefer-namespace-import': 'warn',

      '@eslint-react/naming-convention/component-name': [
        'warn',
        { rule: 'PascalCase', allowAllCaps: true },
      ],
    },
    settings: reactPlugin.configs['recommended-typescript'].settings,
  },
]

