interface PackageJson {
  name: string
  exports?: Record<string, { types: string; default: string }>
  scripts: Record<string, string>
  dependencies?: Record<string, string>
  devDependencies?: Record<string, string>
  packageManager?: string
}
