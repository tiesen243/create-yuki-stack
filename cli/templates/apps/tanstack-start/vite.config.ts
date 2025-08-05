import tailwindcss from '@tailwindcss/vite'
import { tanstackStart } from '@tanstack/react-start/plugin/vite'
import react from '@vitejs/plugin-react-swc'
import { defineConfig, loadEnv } from 'vite'
import tsconfigPaths from 'vite-tsconfig-paths'

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')
  process.env = { ...process.env, ...env, PORT: '3002' }

  return {
    server: { port: 3002 },
    define: { 'process.env': JSON.stringify(process.env) },
    plugins: [
      react(),
      tailwindcss(), 
      tanstackStart({ customViteReactPlugin: true }), 
      tsconfigPaths()
    ],
  }
})
