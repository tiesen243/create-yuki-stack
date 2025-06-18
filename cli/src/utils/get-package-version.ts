export async function getPackageVersion(dep: string): Promise<string> {
  const version = await fetch(
    `https://registry.npmjs.org/-/package/${dep}/dist-tags`,
  )
    .then((res) => res.json() as Promise<{ latest: string }>)
    .then((json) => json.latest)
  return version ? `^${version}` : 'latest'
}

export async function getPackageVersions(
  deps: string[],
): Promise<Record<string, string>> {
  const versions: Record<string, string> = {}
  await Promise.all(
    deps.map(async (dep) => (versions[dep] = await getPackageVersion(dep))),
  )
  return versions
}
