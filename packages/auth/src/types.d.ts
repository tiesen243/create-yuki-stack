/**
 * Represents a user in the system.
 * This interface can be extended using module declaration merging.
 *
 * @example
 * ```typescript
 * declare module 'yuki-auth' {
 *   interface User {
 *     customField: string
 *   }
 * }
 * ```
 */
export interface User {
  /** Unique identifier for the user */
  id: string
  /** User's email address */
  email: string
  /** User's display name */
  name: string
  /** URL to user's profile image */
  image: string
}

/**
 * Represents an external account linked to a user.
 * This interface can be extended using module declaration merging.
 */
export interface Account {
  /** OAuth provider name (e.g., 'google', 'github') */
  provider: string
  /** Account ID from the provider */
  accountId: string
  /** Password hash - only used for credentials provider */
  password?: string
  /** ID of the associated user */
  userId: string
}

/**
 * Represents a user session containing authentication state.
 * This interface can be extended using module declaration merging.
 *
 * @example
 * ```typescript
 * // Extending Session interface
 * declare module 'yuki-auth' {
 *   interface Session {
 *     csrfToken?: string
 *     deviceId?: string
 *   }
 * }
 *
 * // Using session with type guards
 * function handleSession(session: Session) {
 *   if (session.user) {
 *     console.log(`Welcome, ${session.user.name}!`);
 *   } else {
 *     console.log('Please log in');
 *   }
 * }
 * ```
 */
export interface Session {
  /** Authenticated user data, null if session is invalid */
  user: User | null
  /** Session expiration date */
  expires: Date
}

/**
 * OAuth2 access token response from providers.
 * Contains the essential token information returned by OAuth2 providers
 * after successful authentication.
 */
export interface OAuth2Token {
  /** The access token string */
  access_token: string
  /** Token type, usually 'Bearer' */
  token_type: string
  /** Token expiration time in seconds */
  expires_in: number
}

/**
 * User data returned from OAuth providers during authentication.
 * This represents the mapped data from OAuth provider responses to valid database format.
 */
export interface ProviderUserData {
  /** OAuth provider name (e.g., 'google', 'github') */
  provider: string
  /** Account ID from the provider */
  accountId: string
  /** User's email from provider */
  email: string
  /** User's name from provider */
  name: string
  /** User's profile image URL from provider */
  image: string
}

/**
 * Result of session creation operations.
 * Contains the session token and expiration information
 * returned after successful session creation.
 */
export interface SessionResult {
  /** The session token */
  token: string
  /** The expiration date of the session */
  expires: Date
}

/**
 * Options for credential-based authentication.
 * Contains the user credentials required for email/password authentication.
 */
export interface CredentialsOptions {
  /** User's email address */
  email: string
  /** User's password */
  password: string
}
