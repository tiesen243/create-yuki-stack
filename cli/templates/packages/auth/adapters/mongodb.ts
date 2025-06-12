'use server'

export interface ValidSession {
  user: {
    id: string
    email: string
    name: string
    image: string
  }
  expires: Date
}
export interface InvalidSession {
  user: null
  expires: Date
}
export type Session = ValidSession | InvalidSession

interface SessionResult {
  token: string
  expires: Date
}

async function createSession(_userId: string): Promise<SessionResult> {
  await new Promise((resolve) => setTimeout(resolve, 100))
  throw new Error('Not implemented')
}

async function validateSessionToken(_token: string): Promise<Session> {
  await new Promise((resolve) => setTimeout(resolve, 100))
  throw new Error('Not implemented')
}

async function authenticateCredentials(_opts: {
  email: string
  password: string
}): Promise<SessionResult> {
  await new Promise((resolve) => setTimeout(resolve, 100))
  throw new Error('Not implemented')
}

async function getOrCreateUser(_opts: {
  provider: string
  accountId: string
  email: string
  name: string
  image: string
}): Promise<SessionResult> {
  await new Promise((resolve) => setTimeout(resolve, 100))
  throw new Error('Not implemented')
}

async function invalidateSessionToken(_token: string) {
  await new Promise((resolve) => setTimeout(resolve, 100))
  throw new Error('Not implemented')
}

async function invalidateSessionTokens(_userId: string) {
  await new Promise((resolve) => setTimeout(resolve, 100))
  throw new Error('Not implemented')
}

export {
  authenticateCredentials,
  createSession,
  getOrCreateUser,
  validateSessionToken,
  invalidateSessionToken,
  invalidateSessionTokens,
}
