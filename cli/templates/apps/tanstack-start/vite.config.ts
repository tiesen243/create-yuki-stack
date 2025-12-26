import tailwindcss from '@tailwindcss/vite'
import { tanstackStart } from '@tanstack/react-start/plugin/vite'
import react from '@vitejs/plugin-react-swc'
import { defineConfig } from 'vite'
import tsconfigPaths from 'vite-tsconfig-paths'

export default defineConfig(({ mode }) => ({
  plugins: [tanstackStart(), react(), tailwindcss(), tsconfigPaths()],
  build: {
    rollupOptions: {
      onwarn(warning, warn) {
        if (warning.code === 'SOURCEMAP_ERROR') return
        warn(warning)
      },
    },
  },
  ...(mode === 'production'
    ? { resolve: { alias: { 'react-dom/server': 'react-dom/server.node' } } }
    : {}),
}))
