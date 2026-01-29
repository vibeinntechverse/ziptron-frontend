import axios from 'axios'
import { tokenStorage } from '../auth/tokenStorage'

// 1. Define the shape of the expected response from your backend
interface BackendTokenResponse {
  accessToken: string;
  refreshToken: string;
}

// 2. Define URL with explicit string type
const BASE_URL: string = process.env.EXPO_PUBLIC_API_BASE_URL || "https://halterlike-arielle-augmented.ngrok-free.dev/api/v1"

// 3. Add types to arguments (clerkUserId: string) and return type (Promise<boolean>)
export const generateBackendTokens = async (clerkUserId: string): Promise<boolean> => {
  try {
    // We use raw axios here to avoid the interceptors defined in apiClient
    // We add <BackendTokenResponse> to tell TS what the response.data looks like
    const response = await axios.post<BackendTokenResponse>(
      `${BASE_URL}/auth/generate-token`,
      { clerkUserId }
    )

    const { accessToken, refreshToken } = response.data

    if (!accessToken || !refreshToken) {
        throw new Error("Tokens not returned from backend")
    }

    await tokenStorage.setTokens({ accessToken, refreshToken })
    return true
  } catch (error) {
    console.error('Backend Token Generation Failed:', error)
    throw error
  }
}