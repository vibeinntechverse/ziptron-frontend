// Shared type definitions for the Ziptron app
import { ImageSourcePropType } from 'react-native';

// Vehicle Types
export interface Vehicle {
  id: string | number;
  name: string;
  number: string;
  image: ImageSourcePropType;
}

// Location Types
export interface LocationData {
  latitude: number;
  longitude: number;
  latitudeDelta?: number;
  longitudeDelta?: number;
}

export interface SearchLocation {
  latitude: number;
  longitude: number;
  address?: string;
  name?: string;
}

// Station Types
export interface Station {
  id: string | number;
  name: string;
  address: string;
  lat: number;
  lng: number;
  latitude?: number;
  longitude?: number;
  rating?: number;
  price?: number;
  distance?: number;
  available?: boolean;
}

// API Response Types
export interface ApiResponse<T = any> {
  success: boolean;
  data: T;
  message?: string;
  error?: string;
}

export interface TokenResponse {
  accessToken: string;
  refreshToken: string;
}

// User Types
export interface User {
  id: string;
  email: string;
  firstName?: string;
  lastName?: string;
  phoneNumber?: string;
}

// Auth Types
export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
}

export interface SignInCredentials {
  email: string;
  password: string;
}

export interface SignUpCredentials extends SignInCredentials {
  firstName?: string;
  lastName?: string;
}

// App Navigation Types
export type AppStage = 'splash' | 'onboarding' | 'authCheck';

// Onboarding Types
export interface SlideData {
  id: string;
  title: string;
  desc: string;
  image: ImageSourcePropType;
}
