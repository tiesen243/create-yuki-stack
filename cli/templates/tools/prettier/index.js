import { fileURLToPath } from 'node:url'

/** @typedef {import("prettier").Config} PrettierConfig */
/** @typedef {import("prettier-plugin-tailwindcss").PluginOptions} TailwindConfig */
/** @typedef {import("@ianvs/prettier-plugin-sort-imports").PluginConfig} SortImportsConfig */

/** @type { PrettierConfig | SortImportsConfig | TailwindConfig } */
const config = {
  /* General Prettier Config */
  semi: false,
  tabWidth: 2,
  printWidth: 80,
  singleQuote: true,
  trailingComma: 'all',
  jsxSingleQuote: true,

  plugins: [
    '@ianvs/prettier-plugin-sort-imports',
    'prettier-plugin-tailwindcss',
  ],

  tailwindFunctions: ['cn', 'cva'],
  tailwindAttributes: ['className', 'tw'],
  tailwindStylesheet: fileURLToPath(
    new URL('../../packages/ui/src/tailwind.css', import.meta.url),
  ),

  importOrder: [
    '<TYPES>',
    '^(react/(.*)$)|^(react$)|^(react-native(.*)$)',
    '^(next/(.*)$)|^(next$)',
    '^(expo(.*)$)|^(expo$)',
    '^(vue(.*)$)|^(vue$)',
    '<THIRD_PARTY_MODULES>',
    '',
    '<TYPES>^@{{ name }}',
    '^@{{ name }}/(.*)$',
    '',
    '<TYPES>^(@/(.*)$)',
    '<TYPES>^[.|..]',
    '^@/',
    '^[../]',
    '^[./]',
  ],
  importOrderParserPlugins: ['typescript', 'jsx', 'decorators-legacy'],
  importOrderTypeScriptVersion: '4.4.0',
}

export default config
