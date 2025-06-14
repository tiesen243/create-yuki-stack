export async function getPackageVersion(
  packageName: string,
  tag: string | number = 'latest',
): Promise<string | null> {
  try {
    const response = await fetch(
      `https://registry.npmjs.org/${packageName}/${tag}`,
    )

    if (!response.ok) return null

    const data = (await response.json()) as { version?: string }
    return data.version ?? null
  } catch {
    return null
  }
}
