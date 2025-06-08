export function getPackageManager() {
  const ua = process.env.npm_config_user_agent ?? 'npm'

  if (ua.startsWith('yarn')) return 'yarn'
  else if (ua.startsWith('pnpm')) return 'pnpm'
  else if (ua.startsWith('bun')) return 'bun'
  else return 'npm'
}

export function getPackageManagerExcecuter(pkm: string) {
  if (pkm === 'npm') return 'npx'
  else if (pkm === 'yarn') return 'yarn dlx'
  else if (pkm === 'pnpm') return 'pnpm dlx'
  else return 'bunx --bun'
}
