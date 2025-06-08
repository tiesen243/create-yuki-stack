export function getPackageManager() {
  const ua = process.env.npm_config_user_agent ?? 'npm'

  if (ua.startsWith('yarn')) return 'yarn'
  else if (ua.startsWith('pnpm')) return 'pnpm'
  else if (ua.startsWith('bun')) return 'bun'
  else return 'npm'
}

export function getPackageManagerExcecuter() {
  const pm = getPackageManager()

  if (pm === 'npm') return 'npx'
  else if (pm === 'yarn') return 'npx'
  else if (pm === 'pnpm') return 'pnpm dlx'
  else return 'bunx --bun'
}
