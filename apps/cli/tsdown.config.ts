import { defineConfig } from 'tsdown'

export default defineConfig({
  entry: ['src/**/*.ts'],
  shims: true,
  clean: true,
  outputOptions: {
    banner: '#!/usr/bin/env node\n',
  },
})
