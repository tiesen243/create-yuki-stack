import fs from 'fs/promises'

const ENV_PATH = 'packages/validators/src/env.ts'
const CLIENT_NEXT_ENV_PATH = 'packages/validators/src/env.next.ts'
const CLIENT_VITE_ENV_PATH = 'packages/validators/src/env.vite.ts'
const EXAMPLE_ENV_PATH = '.env.example'

export async function addEnv(
  usage: 'server' | 'client',
  key: string,
  zodType: string,
): Promise<void> {
  if (usage === 'server') {
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

  if (usage === 'client') {
    for (const clientEnvPath of [CLIENT_NEXT_ENV_PATH, CLIENT_VITE_ENV_PATH]) {
      const isNext = clientEnvPath === CLIENT_NEXT_ENV_PATH
      const prefix = isNext ? 'NEXT_PUBLIC_' : 'VITE_'
      const clientKey = key.startsWith(prefix) ? key : `${prefix}${key}`

      const content = await fs.readFile(clientEnvPath, 'utf8')
      const updatedContent = content.replace(
        /(client:\s*{)([\s\S]*?)}(,?\n\s+runtimeEnv:\s*{)([\s\S]*?)}(,?\n\s+skipValidation:)/,
        (_, start, body: string, via, runtimeEnvBody: string, end) => {
          const lines = body
            .split('\n')
            .map((line) => line.trim())
            .filter((line) => line && !line.startsWith('//'))

          const normalized = lines.map((line) => line.replace(/,+$/, ''))
          if (!normalized.some((line) => line.startsWith(`${clientKey}:`)))
            normalized.push(`${clientKey}: ${zodType}`)
          const finalClientBody = normalized
            .map((line) => `    ${line},`)
            .join('\n')

          const runtimeEnvLines = runtimeEnvBody
            .split('\n')
            .map((line) => line.trim())
            .filter((line) => line && !line.startsWith('//'))
          const normalizedRuntimeEnv = runtimeEnvLines.map((line) =>
            line.replace(/,+$/, ''),
          )
          const envAccess = isNext
            ? `process.env.${clientKey}`
            : `import.meta.env.${clientKey}`
          if (
            !normalizedRuntimeEnv.some((line) =>
              line.startsWith(`${clientKey}:`),
            )
          )
            normalizedRuntimeEnv.push(`${clientKey}: ${envAccess}`)
          const finalRuntimeEnvBody = normalizedRuntimeEnv
            .map((line) => `    ${line},`)
            .join('\n')

          return (
            `${start}\n${finalClientBody}\n  }` +
            `${via}\n${finalRuntimeEnvBody}\n  }` +
            `${end}`
          )
        },
      )

      await fs.writeFile(clientEnvPath, updatedContent, 'utf8')
      await fs.appendFile(EXAMPLE_ENV_PATH, `\n${clientKey}=`, 'utf8')
    }
  }
}
