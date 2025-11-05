import { defineConfig } from 'tsdown'

export default defineConfig({
  entry: ['./src/index.ts', './src/*.ts'],
  dts: true,
  shims: true,
  exports: {
    customExports() {
      return {
        '.': './dist/index.mjs',
        './*': {
          default: './dist/*.mjs',
          types: './dist/*.d.mts',
        },
        './package.json': './package.json',
      }
    },
  },
})
