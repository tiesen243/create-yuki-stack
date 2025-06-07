import type { AuthOptions } from './types'
import { DiscordProvider } from './providers/discord'
import { GoogleProvider } from './providers/google'

/**
 * Authentication configuration
 *
 * @remarks
 * Each provider requires CLIENT_ID and CLIENT_SECRET environment variables
 * (e.g., DISCORD_CLIENT_ID, DISCORD_CLIENT_SECRET)
 *
 * Callback URL should be set to: {{ BASE_URL }}/api/auth/{{ provider }}/callback
 * (e.g., https://yourdomain.com/api/auth/discord/callback)
 */
export const authOptions = {
  cookieKey: 'auth_token',
  cookieOptions: {
    path: '/',
    httpOnly: true,
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
  },
  session: {
    expires: 1000 * 60 * 60 * 24 * 30, // 30 days in milliseconds
    expiresThreshold: 1000 * 60 * 60 * 24 * 15, // 15 days in milliseconds
  },
  providers: {
    discord: new DiscordProvider(),
    google: new GoogleProvider(),
  },
} satisfies AuthOptions
