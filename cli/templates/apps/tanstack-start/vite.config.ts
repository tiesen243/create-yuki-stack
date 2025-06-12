import tailwindcss from '@tailwindcss/vite'
import { tanstackStart } from '@tanstack/react-start/plugin/vite'
import { defineConfig, loadEnv } from 'vite'
import tsConfigPaths from 'vite-tsconfig-paths'

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')
  process.env = { ...process.env, ...env, PATH: undefined, PORT: '3002' }

  return {
    define: { 'process.env': process.env },
    plugins: [tanstackStart(), tailwindcss(), tsConfigPaths()],
  }
})

