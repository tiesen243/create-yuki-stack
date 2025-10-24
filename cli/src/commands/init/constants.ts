import type { ProjectOptions } from '@/commands/init/types'
import { getPackageManager } from '@/utils/get-package-manager'

export const DEFAULT_PROJECT_NAME = 'my-yuki-app'
export const DEFAULT_PROJECT_OPTIONS = {
  name: DEFAULT_PROJECT_NAME,

  frontend: ['nextjs'],

  database: 'none',
  adapter: 'none',

  backend: 'none',
  api: 'none',

  auth: 'none',

  extras: [],

  packageManager: getPackageManager(),
  javaBuildTool: 'gradle',

  install: true,
  git: true,
} satisfies ProjectOptions

export const APP_TITLE = `
 ██╗   ██╗ ██╗   ██╗ ██╗  ██╗ ██╗
 ╚██╗ ██╔╝ ██║   ██║ ██║ ██╔╝ ██║
  ╚████╔╝  ██║   ██║ █████╔╝  ██║
   ╚██╔╝   ██║   ██║ ██╔═██╗  ██║
    ██║    ╚██████╔╝ ██║  ██╗ ██║
    ╚═╝     ╚═════╝  ╚═╝  ╚═╝ ╚═╝

 ███████╗ ████████╗  █████╗   ██████╗ ██╗  ██╗
 ██╔════╝ ╚══██╔══╝ ██╔══██╗ ██╔════╝ ██║ ██╔╝
 ███████╗    ██║    ███████║ ██║      █████╔╝ 
 ╚════██║    ██║    ██╔══██║ ██║      ██╔═██╗ 
 ███████║    ██║    ██║  ██║ ╚██████╗ ██║  ██╗
 ╚══════╝    ╚═╝    ╚═╝  ╚═╝  ╚═════╝ ╚═╝  ╚═╝`
export const APP_COLORS = ['#c3c0ff', '#c7c4dd', '#eab9d2']
