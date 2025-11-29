import { defineConfig } from 'tsdown'

export default defineConfig({
  entry: ['./src/*.ts'],
  dts: true,
  shims: true,
  exports: {
    customExports() {
      return {
        './*': {
          types: './dist/*.d.mts',
          default: './dist/*.mjs',
        },
        './package.json': './package.json',
      }
    },
  },
})
