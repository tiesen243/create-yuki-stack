import { defineConfig } from 'tsdown'

export default defineConfig({
  entry: ['src/index.ts'],
  dts: true,
  clean: true,
  shims: true,
  exports: true,
  outputOptions: {
    banner: '#!/usr/bin/env node\n',
  },
})
