interface PackageJson {
  name: string
  workspaces?: string[] | Record<string, string[]>
  exports: Record<string, unknown>
  scripts: Record<string, string>
  dependencies: Record<string, string>
  devDependencies: Record<string, string>
  peerDependencies: Record<string, string>
  packageManager: string
  engines: Record<string, string>
  [key: string]: unknown
}
