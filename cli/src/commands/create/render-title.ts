import gradient from 'gradient-string'

import { APP_TITLE } from '@/utils/constants'
import { getPackageManager } from '@/utils/get-package-manager'

const poimandresTheme = {
  blue: '#54aaff',
  cyan: '#89ddff',
  green: '#17a34a',
  magenta: '#d166ff',
  red: '#ff5c9e',
  yellow: '#f5d982',
}

export const renderTitle = () => {
  const gay = gradient(Object.values(poimandresTheme))

  const pkgManager = getPackageManager()
  if (pkgManager === 'yarn' || pkgManager === 'pnpm') console.log('')

  console.log(gay.multiline(APP_TITLE))
}
