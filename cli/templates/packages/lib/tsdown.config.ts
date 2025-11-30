import { defineConfig } from 'tsdown'

export default defineConfig({
  entry: ['./src/*.ts'],
  dts: true,
  shims: true,
  exports: true,
})
