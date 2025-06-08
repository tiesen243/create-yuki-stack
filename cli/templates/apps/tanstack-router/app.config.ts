import { defineConfig } from '@tanstack/react-start/config'
import react from '@vitejs/plugin-react-swc'
import tsConfigPaths from 'vite-tsconfig-paths'

export default defineConfig({
  tsr: { appDirectory: 'src' },
  vite: { plugins: [react(), tsConfigPaths()] },
}) as unknown
