import { defineConfig } from 'tsdown'

export default defineConfig({
  entry: ['src/**/*.ts'],
  dts: true,
  shims: true,
  clean: true,
  outputOptions: {
    banner: '#!/usr/bin/env node\n',
  },
})
