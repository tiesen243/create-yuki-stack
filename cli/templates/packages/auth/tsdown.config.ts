import { defineConfig } from 'tsdown'

export default defineConfig({
  entry: ['./src/index.ts', './src/index.rsc.ts', './src/react.tsx'],
  dts: true,
  shims: true,
  external: ['@tanstack/react-query', 'react', 'react/jsx-runtime'],
  exports: {
    customExports(exports) {
      exports['.'] = {
        default: './dist/index.mjs',
        'react-server': './dist/index.rsc.mjs',
      }
      delete exports['./index.rsc']

      exports['./react'] = {
        default: './dist/react.mjs',
        types: './dist/react.d.mts',
      }

      return exports
    },
  },
})
