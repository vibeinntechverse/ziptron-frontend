// Type definitions for environment variables
declare module '@env' {
  export const EXPO_PUBLIC_API_BASE_URL: string;
  export const EXPO_PUBLIC_GOOGLE_MAPS_API_KEY: string;
}

// Augment ProcessEnv to include our custom environment variables
declare global {
  namespace NodeJS {
    interface ProcessEnv {
      EXPO_PUBLIC_API_BASE_URL: string;
      EXPO_PUBLIC_GOOGLE_MAPS_API_KEY: string;
    }
  }
}

export {};
