interface PackageJson {
  name: string
  workspaces?:
    | string[]
    | {
        pacakges: string[]
        catalog: Record<string, string>
        catalogs: Record<string, Record<string, string>>
      }
  exports?: Record<string, { types: string; default: string }>
  scripts: Record<string, string>
  dependencies?: Record<string, string>
  devDependencies?: Record<string, string>
  packageManager?: string
}
