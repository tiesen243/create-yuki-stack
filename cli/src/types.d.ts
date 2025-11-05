interface PackageJson {
  name: string
  workspaces?: string[]
  exports?: Record<string, { types: string; default: string } | string>
  main?: string
  module?: string
  types?: string
  scripts: Record<string, string>
  dependencies?: Record<string, string>
  devDependencies?: Record<string, string>
  peerDependencies?: Record<string, string>
  packageManager?: string
  catalog: Record<string, Record<string, string>>
  catalogs: Record<string, Record<string, string>>
}
