import { defineConfig } from '@tanstack/react-start/config'
import react from '@vitejs/plugin-react-swc'
import { createJiti } from 'jiti'
import tsConfigPaths from 'vite-tsconfig-paths'

const jiti = createJiti(import.meta.url)
await jiti.import('@{{ name }}/env')

export default defineConfig({
  tsr: { appDirectory: 'src' },
  vite: { plugins: [react(), tsConfigPaths()] },
}) as unknown

