import axios from 'axios'

// 1. Define the shape of the expected response from your backend
interface BackendTokenResponse {
  success: boolean;
  message: string;
  user: {
    id: string;
    email: string;
    phone: string | null;
    role: string;
    walletBalance: string;
  };
}

// 2. Define URL with explicit string type
const BASE_URL: string = process.env.EXPO_PUBLIC_API_BASE_URL || "https://halterlike-arielle-augmented.ngrok-free.dev/api/v1"

// 3. Generate backend tokens (stored in HTTP-only cookies)
export const generateBackendTokens = async (clerkUserId: string): Promise<boolean> => {
  try {
    // Validate input
    if (!clerkUserId || typeof clerkUserId !== 'string') {
      throw new Error('Invalid user ID provided')
    }

    // Make request - tokens will be set in HTTP-only cookies by the backend
    const response = await axios.post<BackendTokenResponse>(
      `${BASE_URL}/auth/generate-token`,
      { clerkUserId },
      { 
        timeout: 10000,
        withCredentials: true // Important: Enable cookies
      }
    )

    // Check if the request was successful
    if (!response.data.success) {
      throw new Error(response.data.message || 'Token generation failed')
    }

    console.log('✅ Backend tokens generated successfully for user:', response.data.user.email)
    return true
  } catch (error: any) {
    console.error('❌ Backend Token Generation Failed:', {
      message: error.message,
      response: error.response?.data,
      status: error.response?.status
    })
    throw new Error(error.response?.data?.message || 'Failed to generate authentication tokens')
  }
}