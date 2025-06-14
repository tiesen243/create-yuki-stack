import fs from 'fs/promises'

export async function addProviderToRoot(
  imp: string,
  provider: string,
  path: string,
) {
  const rootContent = await fs.readFile(path, 'utf-8')
  const isHaveChildren = rootContent.includes('{children}')

  let updatedRootContent = rootContent
  updatedRootContent = `${updatedRootContent}\n${imp}`
  updatedRootContent = updatedRootContent.replace(
    isHaveChildren ? '{children}' : '<Outlet />',
    `<${provider}>
      ${isHaveChildren ? '{children}' : '<Outlet />'}
    </${provider}>`,
  )

  await fs.writeFile(path, updatedRootContent, 'utf-8')
}
