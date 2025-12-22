import { defineConfig } from 'tsdown'

export default defineConfig({
  entry: ['./src/index.ts', './src/components/*.tsx', './src/hooks/*.tsx'],
  dts: true,
  shims: true,
  exports: {
    customExports() {
      return {
        '.': './dist/index.mjs',
        './*': {
          types: './dist/components/*.d.mts',
          default: './dist/components/*.mjs',
        },
        './hooks/*': {
          types: './dist/hooks/*.d.mts',
          default: './dist/hooks/*.mjs',
        },
        './tailwind.css': './src/tailwind.css',
        './package.json': './package.json',
      }
    },
  },
})
