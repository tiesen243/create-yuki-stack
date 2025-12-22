type Tag = 'latest' | 'beta'

export async function getPackageVersion(
  dep: string,
  tag: Tag = 'latest',
): Promise<string> {
  const version = await fetch(
    `https://registry.npmjs.org/-/package/${dep}/dist-tags`,
  )
    .then((res) => res.json() as Promise<{ latest: string; beta: string }>)
    .then((json) => json[tag])
  return version ? `^${version}` : 'latest'
}

export async function getPackageVersions<T extends string>(
  deps: T[],
): Promise<Record<T, string>> {
  const versions: Record<string, string> = {}
  await Promise.all(
    deps.map(async (dep) => {
      const lastAtIndex = dep.lastIndexOf('@')
      const pkg = lastAtIndex > 0 ? dep.slice(0, lastAtIndex) : dep
      const tag = lastAtIndex > 0 ? dep.slice(lastAtIndex + 1) : 'latest'
      return (versions[dep] = await getPackageVersion(pkg, tag as Tag))
    }),
  )
  return versions
}
