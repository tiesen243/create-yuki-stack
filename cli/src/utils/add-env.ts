import fs from 'fs/promises'

const ENV_PATH = 'packages/validators/src/env.ts'
const EXAMPLE_ENV_PATH = '.env.example'

export async function addEnv(key: string, zodType: string): Promise<void> {
  const content = await fs.readFile(ENV_PATH, 'utf8')
  const updatedContent = content.replace(
    /(server:\s*{)([\s\S]*?)(\/\/ Vercel environment variables)/,
    (_, start, body: string, comment) => {
      const lines = body
        .split('\n')
        .map((line) => line.trim())
        .filter((line) => line && !line.startsWith('//'))

      const normalized = lines.map((line) => line.replace(/,+$/, ''))
      if (!normalized.some((line) => line.startsWith(`${key}:`)))
        normalized.push(`${key}: ${zodType}`)

      const finalBody = normalized.map((line) => `    ${line},`).join('\n')
      return `${start}\n${finalBody}\n\n    ${comment}`
    },
  )

  await fs.writeFile(ENV_PATH, updatedContent, 'utf8')
  await fs.appendFile(EXAMPLE_ENV_PATH, `\n${key}=`, 'utf8')
}
