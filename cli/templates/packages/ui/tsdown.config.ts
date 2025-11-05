import { defineConfig } from 'tsdown'

export default defineConfig({
  entry: ['./src/index.ts', './src/components/*.tsx', './src/hooks/*.tsx'],
  external: ['react', 'react/jsx-runtime'],
  dts: true,
  shims: true,
  exports: {
    customExports() {
      return {
        '.': './dist/index.mjs',
        './*': {
          default: './dist/components/*.mjs',
          types: './dist/components/*.d.mts',
        },
        './hooks/*': {
          default: './dist/hooks/*.mjs',
          types: './dist/hooks/*.d.mts',
        },
        './tailwind.css': './src/tailwind.css',
        './package.json': './package.json',
      }
    },
  },
})
