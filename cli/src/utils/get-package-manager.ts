type PackageManager = 'npm' | 'yarn' | 'pnpm' | 'bun'

export function getPackageManager(): PackageManager {
  const pm = process.env.npm_config_user_agent ?? ''
  if (pm.startsWith('yarn')) return 'yarn'
  if (pm.startsWith('pnpm')) return 'pnpm'
  if (pm.startsWith('bun')) return 'bun'
  return 'npm'
}

export function getExecutor(packageManager: PackageManager): string {
  switch (packageManager) {
    case 'yarn':
      return 'npx'
    case 'pnpm':
      return 'pnpm dlx'
    case 'bun':
      return 'bunx'
    default:
      return 'npx'
  }
}
