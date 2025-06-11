import { reactRouter } from '@react-router/dev/vite'
import tailwindcss from '@tailwindcss/vite'
import { defineConfig, loadEnv } from 'vite'
import tsconfigPaths from 'vite-tsconfig-paths'

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')
  process.env = { ...process.env, ...env, PATH: undefined }

  return {
    define: { 'process.env': process.env },
    plugins: [tailwindcss(), reactRouter(), tsconfigPaths()],
  }
})

