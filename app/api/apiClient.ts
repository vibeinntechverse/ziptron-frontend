import axios, { 
  AxiosInstance, 
  InternalAxiosRequestConfig, 
  AxiosResponse, 
  AxiosError 
} from 'axios';
import { tokenStorage } from '../auth/tokenStorage';

// Define the shape of your Token Response for safety
interface TokenResponse {
  accessToken: string;
  refreshToken: string;
}

// Ensure the environment variable is treated as a string
const BASE_URL: string = process.env.EXPO_PUBLIC_API_BASE_URL || "https://halterlike-arielle-augmented.ngrok-free.dev/api/v1";

const api: AxiosInstance = axios.create({
  baseURL: BASE_URL,
  timeout: 15000,
  headers: {
    'Content-Type': 'application/json',
  },
});

/* ============================
   REQUEST INTERCEPTOR 
   ============================ */
api.interceptors.request.use(
  async (config: InternalAxiosRequestConfig) => {
    const token = await tokenStorage.getAccessToken();
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error: AxiosError) => Promise.reject(error)
);

/* ============================
   RESPONSE INTERCEPTOR 
   ============================ */
// Extend the config type to include the _retry flag
interface CustomAxiosRequestConfig extends InternalAxiosRequestConfig {
  _retry?: boolean;
}

api.interceptors.response.use(
  (res: AxiosResponse) => res,
  async (error: AxiosError) => {
    const originalRequest = error.config as CustomAxiosRequestConfig;

    // Check if 401 and if we haven't retried yet
    if (error.response?.status === 401 && originalRequest && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const refreshToken = await tokenStorage.getRefreshToken();
        if (!refreshToken) throw new Error('No refresh token available');

        // Call refresh endpoint
        const res = await axios.post<TokenResponse>(
          `${BASE_URL}/auth/refresh-token`,
          { refreshToken }
        );

        const { accessToken, refreshToken: newRefresh } = res.data;

        await tokenStorage.setTokens({
          accessToken,
          refreshToken: newRefresh,
        });

        // Update authorization header with new token
        if (originalRequest.headers) {
          originalRequest.headers.Authorization = `Bearer ${accessToken}`;
        }
        
        // Ensure the retry uses the correct baseURL
        originalRequest.baseURL = BASE_URL;

        // Retry the original request
        return api(originalRequest);
      } catch (err) {
        console.error("Session expired, clearing tokens.");
        await tokenStorage.clear();
        return Promise.reject(err);
      }
    }
    return Promise.reject(error);
  }
);

export default api;