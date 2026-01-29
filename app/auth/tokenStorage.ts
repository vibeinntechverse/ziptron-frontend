import * as SecureStore from 'expo-secure-store'

const ACCESS_TOKEN_KEY = 'auth_access_token'
const REFRESH_TOKEN_KEY = 'auth_refresh_token'

// Define the shape of the token object
interface TokenData {
  accessToken: string;
  refreshToken: string;
}

export const tokenStorage = {
  async setTokens({ accessToken, refreshToken }: TokenData): Promise<void> {
    await SecureStore.setItemAsync(ACCESS_TOKEN_KEY, accessToken)
    await SecureStore.setItemAsync(REFRESH_TOKEN_KEY, refreshToken)
  },

  async getAccessToken(): Promise<string | null> {
    return await SecureStore.getItemAsync(ACCESS_TOKEN_KEY)
  },

  async getRefreshToken(): Promise<string | null> {
    return await SecureStore.getItemAsync(REFRESH_TOKEN_KEY)
  },

  async clear(): Promise<void> {
    await SecureStore.deleteItemAsync(ACCESS_TOKEN_KEY)
    await SecureStore.deleteItemAsync(REFRESH_TOKEN_KEY)
  }
}