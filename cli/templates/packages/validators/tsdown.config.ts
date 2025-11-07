import { defineConfig } from 'tsdown'

export default defineConfig({
  entry: ['./src/*.ts'],
  dts: true,
  shims: true,
  exports: {
    customExports() {
      return {
        './*': {
          default: './dist/*.mjs',
          types: './dist/*.d.mts',
        },
        './package.json': './package.json',
      }
    },
  },
})
