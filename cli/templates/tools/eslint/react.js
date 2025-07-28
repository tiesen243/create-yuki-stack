import reactPlugin from '@eslint-react/eslint-plugin'
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
      ...hooksPlugin.configs['recommended-latest'].rules,
      ...a11yPlugin.flatConfigs.strict.rules,

      '@eslint-react/jsx-no-iife': 'error',
      '@eslint-react/no-children-prop': 'error',
      '@eslint-react/no-class-component': 'error',
      '@eslint-react/no-complex-conditional-rendering': 'error',
      '@eslint-react/no-useless-fragment': 'warn',
      '@eslint-react/prefer-destructuring-assignment': 'warn',
      '@eslint-react/prefer-react-namespace-import': 'warn',
      '@eslint-react/prefer-shorthand-boolean': 'warn',
      '@eslint-react/prefer-shorthand-fragment': 'warn',
      '@eslint-react/dom/no-unknown-property': ['error', { ignore: ['tw'] }],
      '@eslint-react/naming-convention/component-name': [
        'warn',
        { rule: 'PascalCase', allowAllCaps: true },
      ],
      '@eslint-react/naming-convention/use-state': 'error',
    },
    settings: reactPlugin.configs['recommended-typescript'].settings,
  }
]
