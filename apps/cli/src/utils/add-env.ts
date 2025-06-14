import fs from 'fs/promises'

export async function addEnv(
  usage: 'server' | 'client',
  key: string,
  value: string,
) {
  const envConfigPath = 'packages/env/src/index.ts'
  const envContent = await fs.readFile(envConfigPath, 'utf-8')

  if (!envContent.includes(`${key}:`)) {
    const section = usage === 'server' ? 'server:' : 'client:'

    const sectionRegex = new RegExp(`(${section}\\s*{[^}]*?)(\\s*})`, 's')
    const match = envContent.match(sectionRegex)

    if (match) {
      const existingContent = match[1] ?? ''
      const closingBrace = match[2]

      const newEnvVar = `${key}: ${value},`
      const updatedSection = `${existingContent}\n    ${newEnvVar}${closingBrace}`
      const updatedContent = envContent.replace(match[0], updatedSection)

      await fs.writeFile(envConfigPath, updatedContent, 'utf-8')
    }
  }

  await fs.appendFile('.env.example', `${key}=\n`)
}
