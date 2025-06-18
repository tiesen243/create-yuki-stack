import { reactRouter } from '@react-router/dev/vite'
import tailwindcss from '@tailwindcss/vite'
import { defineConfig, loadEnv } from 'vite'
import tsconfigPaths from 'vite-tsconfig-paths'

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')
  process.env = { ...process.env, ...env }

  return {
    server: { port: 3001 },
    define: { 'process.env': JSON.stringify(process.env) },
    plugins: [tailwindcss(), reactRouter(), tsconfigPaths()],
  }
})
