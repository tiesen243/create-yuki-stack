import type { AuthOptions } from './core'
import { Discord } from './providers/discord'

export const authOptions = {
  session: {
    expiresIn: 60 * 60 * 24 * 30, // 30 days in seconds
    updateInterval: 60 * 60 * 24, // 24 hours in seconds
  },
  providers: {
    discord: new Discord({
      clientId: process.env.AUTH_DISCORD_ID ?? '',
      clientSecret: process.env.AUTH_DISCORD_SECRET ?? '',
    }),
  },
} satisfies AuthOptions

export type Providers = keyof typeof authOptions.providers
