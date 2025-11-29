import * as z from 'zod/mini'

export function createEnv<
  TServer extends Record<string, z.ZodMiniType>,
  TClient extends Record<string, z.ZodMiniType>,
  TResult extends {
    [TKey in keyof (TServer & TClient)]: z.infer<(TServer & TClient)[TKey]>
  },
  TPrefix extends string = 'PUBLIC_',
  TDeriveEnv extends Record<string, unknown> = Record<string, unknown>,
>(
  opts: {
    server: {
      [TKey in keyof TServer]: TKey extends `${TPrefix}${string}`
        ? `${TKey} should not prefix with ${TPrefix}`
        : TServer[TKey]
    }
    clientPrefix?: TPrefix
    client: {
      [TKey in keyof TClient]: TKey extends `${TPrefix}${string}`
        ? TClient[TKey]
        : `${TKey extends string ? TKey : never} should prefix with ${TPrefix}`
    }
    runtimeEnv:
      | { [TKey in keyof TResult]: string | undefined }
      | Record<string, unknown>
    skipValidation?: boolean
  },
  deriveEnv: (env: TResult) => TDeriveEnv = () => ({}) as TDeriveEnv,
): TResult & TDeriveEnv {
  for (const [key, value] of Object.entries(opts.runtimeEnv)) {
    // eslint-disable-next-line @typescript-eslint/no-dynamic-delete
    if (value === '') delete opts.runtimeEnv[key]
  }

  const globalThisForWindow = globalThis as unknown as {
    window: Record<string, unknown> | undefined
  }
  const isServer = typeof globalThisForWindow.window === 'undefined'

  const _server = typeof opts.server === 'object' ? opts.server : {}
  const _client = typeof opts.client === 'object' ? opts.client : {}
  const envs = isServer ? { ..._server, ..._client } : { ..._client }

  const parsedEnvs = z.object(envs).safeParse(opts.runtimeEnv)
  if (!opts.skipValidation && !parsedEnvs.success)
    throw new Error(
      `❌ Environment variables validation failed:\n${parsedEnvs.error.message}`,
    )

  const envData = parsedEnvs.success ? parsedEnvs.data : {}
  Object.assign(envData, deriveEnv(envData as TResult))

  return new Proxy(envData as TResult & TDeriveEnv, {
    get(target, prop) {
      if (!isServer && prop in opts.server)
        throw new Error(
          `❌ Attempted to access a server-side environment variable on the client`,
        )
      return target[prop as keyof typeof target]
    },
  })
}
