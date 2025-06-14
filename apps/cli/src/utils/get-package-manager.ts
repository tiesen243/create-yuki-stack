export function getPackageManager(): ProjectConfig['packageManager'] {
  const ua = process.env.npm_config_user_agent ?? 'npm'

  if (ua.startsWith('yarn')) return 'yarn'
  if (ua.startsWith('pnpm')) return 'pnpm'
  if (ua.startsWith('bun')) return 'bun'
  return 'npm'
}

export function getExecutor(packageManager: string) {
  if (packageManager === 'npm') return 'npx'
  if (packageManager === 'yarn') return 'npx'
  if (packageManager === 'pnpm') return 'pnpm dlx'
  return 'bunx --bun'
}
