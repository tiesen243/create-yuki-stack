import { defineConfig } from 'tsdown'

export default defineConfig({
  entry: ['./src/index.ts', './src/index.rsc.ts', './src/react.tsx'],
  dts: true,
  shims: true,
  external: ['@tanstack/react-query', 'react', 'react/jsx-runtime'],
  exports: {
    customExports(exports) {
      exports['.'] = {
        'react-server': './dist/index.rsc.mjs',
        default: './dist/index.mjs',
      }
      delete exports['./index.rsc']

      return exports
    },
  },
})
