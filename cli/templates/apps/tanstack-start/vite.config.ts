import tailwindcss from '@tailwindcss/vite'
import { tanstackStart } from '@tanstack/react-start/plugin/vite'
import { createJiti } from 'jiti'
import { defineConfig, loadEnv } from 'vite'
import tsConfigPaths from 'vite-tsconfig-paths'

const jiti = createJiti(import.meta.url)
await jiti.import('@my-yuki-app/env')

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')
  process.env = { ...process.env, ...env }

  return {
    define: { 'process.env': process.env },
    plugins: [tanstackStart(), tailwindcss(), tsConfigPaths()],
  }
})

