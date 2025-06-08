export async function getPackageVersion(
  packageName: string,
): Promise<string | null> {
  try {
    const response = await fetch(
      `https://registry.npmjs.org/${packageName}/latest`,
    )

    if (!response.ok) return null

    const data = (await response.json()) as { version?: string }
    return data.version ?? null
  } catch {
    return null
  }
}
