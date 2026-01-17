export function createEnv<
  TPrefix extends string,
  TShared extends Record<string, StandardSchemaV1>,
  TServer extends Record<string, StandardSchemaV1>,
  TClient extends Record<string, StandardSchemaV1>,
  TResult extends {
    [TKey in keyof (TShared & TServer & TClient)]: StandardSchemaV1.InferOutput<
      (TShared & TServer & TClient)[TKey]
    >
  },
  TDeriveEnv extends Record<string, unknown> = Record<string, unknown>,
>(opts: {
  /*
   * Whather the code is running on server or client side
   * @default window === undefined
   */
  isServer?: boolean

  /*
   * Environment variable schemas shared between server and client
   * @example: NODE_ENV, VERCEL_URL, etc.
   */
  shared: TShared

  /*
   * Server-only environment variable schemas
   * @example: DATABASE_URL, SECRET_KEY, etc.
   */
  server: {
    [TKey in keyof TServer]: TKey extends `${TPrefix}${string}`
      ? `${TKey} should not prefix with ${TPrefix}`
      : TServer[TKey]
  }

  /*
   * Client-only environment variable schemas
   * @example: NEXT_PUBLIC_API_URL, etc.
   */
  clientPrefix: TPrefix
  client: {
    [TKey in keyof TClient]: TKey extends `${TPrefix}${string}`
      ? TClient[TKey]
      : `${TKey extends string ? TKey : never} should prefix with ${TPrefix}`
  }

  /*
   * The runtime environment variables to validate, typically process.env.
   *
   * For client-only variables, avoid spreading process.env directly.
   * @see https://github.com/vercel/next.js/discussions/34957
   *
   * @example
   * ```ts
   * // Incorrect: client variable will be undefined
   * const env = createEnv({
   *   ...
   *   client: { PUBLIC_VAR: z.string() },
   *   runtimeEnv: { ...process.env }
   * })
   *
   * env.PUBLIC_VAR // undefined
   *
   * // Correct: client variable is set properly
   * const env = createEnv({
   *   ...
   *   client: { PUBLIC_VAR: z.string() },
   *   runtimeEnv: { PUBLIC_VAR: process.env.PUBLIC_VAR }
   * })
   *
   * env.PUBLIC_VAR // 'some-value'
   * ```
   */
  runtimeEnv:
    | { [TKey in keyof TResult]: string | number | boolean | undefined }
    | Record<string, unknown>

  /*
   * A function to derive additional environment variables based on the validated ones.
   * @param env The validated environment variables.
   * @returns An object containing derived environment variables.
   * @example
   * ```ts
   * const env = createEnv({
   *   ...
   * }, (env) => ({
   *   IS_PRODUCTION: env.NODE_ENV === 'production',
   * }))
   *
   * env.IS_PRODUCTION // true or false
   */
  deriveEnv?: (env: TResult) => TDeriveEnv

  /*
   * Whether to treat empty strings as undefined values.
   * @default false
   */
  emptyStringAsUndefined?: boolean

  /*
   * Whether to skip validation of environment variables.
   * @default false
   */
  skipValidation?: boolean
}): TResult & TDeriveEnv {
  if (opts.emptyStringAsUndefined)
    for (const [key, value] of Object.entries(opts.runtimeEnv))
      if (value === '') delete opts.runtimeEnv[key]

  const isServer = opts.isServer
    ? opts.isServer
    : (globalThis as unknown as { window: unknown }).window === undefined

  const envs = isServer
    ? { ...opts.shared, ...opts.client, ...opts.server }
    : { ...opts.shared, ...opts.client }

  const parsedEnvs = parseEnvs(opts.runtimeEnv, envs as never)
  if (!opts.skipValidation && !parsedEnvs.success)
    throw new Error(
      `❌ Environment variables validation failed:\n${parsedEnvs.issues.map((issue) => `- ${issue.path}: ${issue.message}`).join('\n')}`,
    )

  const envData = parsedEnvs.success ? parsedEnvs.data : {}
  if (opts.deriveEnv) Object.assign(envData, opts.deriveEnv(envData as TResult))

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

function parseEnvs<
  TSchemas extends Record<string, StandardSchemaV1>,
  TData extends {
    [TKey in keyof TSchemas]: StandardSchemaV1.InferOutput<TSchemas[TKey]>
  },
>(
  data: Record<string, unknown>,
  schemas: TSchemas,
):
  | { success: true; data: TData }
  | { success: false; issues: StandardSchemaV1.Issue[] } {
  if (Object.keys(schemas).length === 0)
    return { success: true, data: {} as TData }

  const results: TData = {} as TData
  const issues: StandardSchemaV1.Issue[] = []

  for (const [key, schema] of Object.entries(schemas)) {
    const value = data[key]

    const validated = schema['~standard'].validate(value)
    if (validated instanceof Promise)
      throw new Error('Async schema validation is not supported')

    if ('issues' in validated && validated.issues)
      issues.push({
        path: [key],
        message: validated.issues.map((issue) => issue.message).join(', '),
      })
    else results[key as keyof TData] = validated.value as TData[typeof key]
  }

  if (issues.length > 0) return { success: false, issues }
  return { success: true, data: results }
}

/** The Standard Schema interface. */
interface StandardSchemaV1<Input = unknown, Output = Input> {
  /** The Standard Schema properties. */
  readonly '~standard': StandardSchemaV1.Props<Input, Output>
}

declare namespace StandardSchemaV1 {
  /** The Standard Schema properties interface. */
  export interface Props<Input = unknown, Output = Input> {
    /** The version number of the standard. */
    readonly version: 1
    /** The vendor name of the schema library. */
    readonly vendor: string
    /** Validates unknown input values. */
    readonly validate: (
      value: unknown,
      options?: StandardSchemaV1.Options | undefined,
    ) => Result<Output> | Promise<Result<Output>>
    /** Inferred types associated with the schema. */
    readonly types?: Types<Input, Output> | undefined
  }

  /** The result interface of the validate function. */
  export type Result<Output> = SuccessResult<Output> | FailureResult

  /** The result interface if validation succeeds. */
  export interface SuccessResult<Output> {
    /** The typed output value. */
    readonly value: Output
    /** A falsy value for `issues` indicates success. */
    readonly issues?: undefined
  }

  export interface Options {
    /** Explicit support for additional vendor-specific parameters, if needed. */
    readonly libraryOptions?: Record<string, unknown> | undefined
  }

  /** The result interface if validation fails. */
  export interface FailureResult {
    /** The issues of failed validation. */
    readonly issues: ReadonlyArray<Issue>
  }

  /** The issue interface of the failure output. */
  export interface Issue {
    /** The error message of the issue. */
    readonly message: string
    /** The path of the issue, if any. */
    readonly path?: ReadonlyArray<PropertyKey | PathSegment> | undefined
  }

  /** The path segment interface of the issue. */
  export interface PathSegment {
    /** The key representing a path segment. */
    readonly key: PropertyKey
  }

  /** The Standard Schema types interface. */
  export interface Types<Input = unknown, Output = Input> {
    /** The input type of the schema. */
    readonly input: Input
    /** The output type of the schema. */
    readonly output: Output
  }

  /** Infers the input type of a Standard Schema. */
  export type InferInput<Schema extends StandardSchemaV1> = NonNullable<
    Schema['~standard']['types']
  >['input']

  /** Infers the output type of a Standard Schema. */
  export type InferOutput<Schema extends StandardSchemaV1> = NonNullable<
    Schema['~standard']['types']
  >['output']
}
