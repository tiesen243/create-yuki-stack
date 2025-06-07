import { createEnv } from '@t3-oss/env-core'
import { vercel } from '@t3-oss/env-core/presets-zod'
import { z } from 'zod/v4'

export const env = createEnv({
  extends: [vercel()],

  /**
   * Specify your server-side environment variables schema here. This way you can ensure the app
   * isn't built with invalid env vars.
   */
  server: {
    NODE_ENV: z
      .enum(['development', 'production', 'test'])
      .default('development'),
  },

  /**
   * Specify your client-side environment variables schema here. This way you can ensure the app
   * isn't built with invalid env vars. To expose them to the client, prefix them with
   * `NEXT_PUBLIC_`.
   */
  clientPrefix: 'NEXT_PUBLIC_',
  client: {},

  /**
   * Specify which actual environment variables to use at runtime.
   * This maps the schema to the environment.
   */
  runtimeEnv: process.env,

  /**
   * Run `build` or `dev` with `SKIP_ENV_VALIDATION` to skip env validation. This is especially
   * useful for Docker builds.
   */
  skipValidation:
    !!process.env.SKIP_ENV_VALIDATION ||
    !!process.env.CI ||
    process.env.npm_lifecycle_event === 'lint',
})
