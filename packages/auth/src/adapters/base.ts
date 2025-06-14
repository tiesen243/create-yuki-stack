import type {
  CredentialsOptions,
  ProviderUserData,
  Session,
  SessionResult,
} from '@/types'

/**
 * Abstract base class for authentication adapters.
 * Provides a common interface for session management and user authentication.
 */
export default abstract class BaseAdapter {
  /**
   *
   */
  constructor(
    protected opts: {
      expiresIn: number
      expireThreshold: number
    } = {
      expiresIn: 1000 * 60 * 60 * 24 * 30, // 30 days after creation
      expireThreshold: 1000 * 60 * 60 * 24 * 15, // 15 days before expiration
    },
  ) {}

  /**
   * Creates a new session for the specified user.
   * @param userId - The unique identifier of the user
   * @returns Promise resolving to session result with token and expiration
   */
  abstract createSession(
    userId: string,
    expiresIn: number,
  ): Promise<SessionResult>

  /**
   * Validates a session token and returns the associated session.
   * @param token - The session token to validate
   * @returns Promise resolving to the session data
   */
  abstract validateSessionToken(token: string): Promise<Session>

  /**
   * Invalidates a specific session token.
   * @param token - The session token to invalidate
   * @returns Promise that resolves when the token is invalidated
   */
  abstract invalidateSessionToken(token: string): Promise<void>

  /**
   * Invalidates all session tokens for a specific user.
   * @param userId - The unique identifier of the user
   * @returns Promise that resolves when all tokens are invalidated
   */
  abstract invalidateSessionTokens(userId: string): Promise<void>

  /**
   * Authenticates user credentials and creates a session.
   * @param opts - The credentials to authenticate
   * @returns Promise resolving to session result with token and expiration
   */
  abstract authenticateCredentials(
    opts: CredentialsOptions,
  ): Promise<SessionResult>

  /**
   * Gets an existing user or creates a new one from provider data.
   * @param opts - The provider user data
   * @returns Promise resolving to session result with token and expiration
   */
  abstract getOrCreateUser(opts: ProviderUserData): Promise<SessionResult>
}
