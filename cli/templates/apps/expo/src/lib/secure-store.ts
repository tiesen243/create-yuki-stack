import * as SecureStore from 'expo-secure-store'

const SESSION_TOKEN = 'session_token'

export const getSessionToken = () => SecureStore.getItem(SESSION_TOKEN)
export const setSessionToken = (token: string) =>
  SecureStore.setItemAsync(SESSION_TOKEN, token)
export const deleteSessionToken = () =>
  SecureStore.deleteItemAsync(SESSION_TOKEN)
