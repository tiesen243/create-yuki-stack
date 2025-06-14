import tailwindcss from '@tailwindcss/vite'
import { tanstackStart } from '@tanstack/react-start/plugin/vite'
import { createJiti } from 'jiti'
import { defineConfig, loadEnv } from 'vite'
import tsConfigPaths from 'vite-tsconfig-paths'

const jiti = createJiti(import.meta.url)
await jiti.import('@{{ name }}/env')

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')
  process.env = { ...process.env, ...env, PATH: undefined, PORT: '3002' }

  return {
    server: { port: 3002 },
    define: { 'process.env': process.env },
    plugins: [tanstackStart(), tailwindcss(), tsConfigPaths()],
  }
})

