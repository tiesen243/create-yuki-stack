import { tanstackStart } from '@tanstack/react-start/plugin/vite'
import tailwindcss from '@tailwindcss/vite'
import { defineConfig } from 'vite'
import { createJiti } from 'jiti'
import tsConfigPaths from 'vite-tsconfig-paths'

const jiti = createJiti(import.meta.url)
await jiti.import('@{{ name }}/env')

export default defineConfig({
  plugins: [tanstackStart(), tailwindcss(), tsConfigPaths()]
})

