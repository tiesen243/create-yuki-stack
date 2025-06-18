import fs from 'fs/promises'

const ENV_PATH = 'packages/validators/src/env.ts'

export async function addEnv(
  usage: 'server' | 'client',
  key: string,
  zodType: string,
): Promise<void> {
  const content = await fs.readFile(ENV_PATH, 'utf8')
  let updatedContent = content

  if (usage === 'server') {
    updatedContent = updatedContent.replace(
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
    updatedContent = updatedContent.replace(
      /(\/\/ Server-side environment variables\n)([\s\S]*?)(\n\s+\/\/ Client-side environment variables)/,
      (match, comment, block: string, after) => {
        const keyLine = `\n    ${key}: process.env.${key},\n`
        if (block.includes(`${key}:`)) return match
        return `${comment}${block}${keyLine}${after}`
      },
    )
  }

  if (usage === 'client') {
    updatedContent = updatedContent.replace(
      /(client:\s*{)([\s\S]*?)}(,?\n\s+runtimeEnv:)/,
      (_, start, body: string, end) => {
        const lines = body
          .split('\n')
          .map((line) => line.trim())
          .filter((line) => line && !line.startsWith('//'))

        const normalized = lines.map((line) => line.replace(/,+$/, ''))
        if (!normalized.some((line) => line.startsWith(`${key}:`)))
          normalized.push(`${key}: ${zodType}`)

        const finalBody = normalized.map((line) => `    ${line},`).join('\n')
        return `${start}\n${finalBody}\n  }${end}`
      },
    )
    updatedContent = updatedContent.replace(
      /(\/\/ Client-side environment variables\n)([\s\S]*?)(\n\s+\/\/ Vercel environment variables)/,
      (match, comment, block: string, after) => {
        const keyLine = `    ${key}: process.env.${key},\n`
        if (block.includes(`${key}:`)) return match
        return `${comment}${block}${keyLine}${after}`
      },
    )
  }

  await fs.writeFile(ENV_PATH, updatedContent, 'utf8')
}
