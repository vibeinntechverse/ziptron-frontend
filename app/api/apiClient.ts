import axios, { 
  AxiosInstance, 
  InternalAxiosRequestConfig, 
  AxiosResponse, 
  AxiosError 
} from 'axios';

// Ensure the environment variable is treated as a string
const BASE_URL: string = process.env.EXPO_PUBLIC_API_BASE_URL || "https://halterlike-arielle-augmented.ngrok-free.dev/api/v1";

const api: AxiosInstance = axios.create({
  baseURL: BASE_URL,
  timeout: 15000,
  withCredentials: true, // Enable cookies for authentication
  headers: {
    'Content-Type': 'application/json',
  },
});

/* ============================
   REQUEST INTERCEPTOR 
   ============================ */
api.interceptors.request.use(
  async (config: InternalAxiosRequestConfig) => {
    // Cookies are automatically sent with withCredentials: true
    // No need to manually add Authorization header
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

    // Check if 401 (unauthorized)
    if (error.response?.status === 401 && originalRequest && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        // Try to refresh tokens via cookie-based endpoint
        await axios.post(
          `${BASE_URL}/auth/refresh-token`,
          {},
          { 
            timeout: 10000,
            withCredentials: true // Cookies will be sent and updated
          }
        );

        // Retry the original request with new cookies
        return api(originalRequest);
      } catch (err) {
        console.error("Session expired or refresh failed:", err);
        // Redirect to login or emit event
        return Promise.reject(err);
      }
    }
    
    // Handle network errors
    if (!error.response) {
      console.error('Network error - no response received:', error.message);
    }
    
    return Promise.reject(error);
  }
);

export default api;