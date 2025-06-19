export async function getPackageVersion(
  dep: string,
  tag: 'latest' | 'beta' = 'latest',
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
      const [pkg, tag = 'latest'] = dep.split('@') as [
        string,
        'latest' | 'beta',
      ]
      return (versions[dep] = await getPackageVersion(pkg, tag))
    }),
  )
  return versions
}
