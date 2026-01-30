// App-wide constants

// Colors
export const COLORS = {
  primary: '#22C55E',
  primaryDark: '#16A34A',
  primaryLight: '#ECFDF5',
  secondary: '#F97316',
  secondaryDark: '#EA580C',
  
  background: '#FFFFFF',
  backgroundAlt: '#F4F7FB',
  
  text: '#1F2937',
  textSecondary: '#6B7280',
  textLight: '#9CA3AF',
  
  border: '#E5E7EB',
  borderDark: '#D1D5DB',
  
  success: '#22C55E',
  warning: '#F59E0B',
  error: '#EF4444',
  info: '#3B82F6',
  
  white: '#FFFFFF',
  black: '#000000',
  
  // Map colors
  routeColor: '#3b82f6',
  stationMarker: '#22C55E',
  destinationMarker: 'red',
} as const;

// Spacing
export const SPACING = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
  xxl: 32,
} as const;

// Border Radius
export const RADIUS = {
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  full: 9999,
} as const;

// Font Sizes
export const FONT_SIZES = {
  xs: 10,
  sm: 12,
  md: 14,
  lg: 16,
  xl: 18,
  xxl: 22,
  xxxl: 26,
} as const;

// Font Weights
export const FONT_WEIGHTS = {
  regular: '400',
  medium: '500',
  semibold: '600',
  bold: '700',
} as const;

// Animation Durations (ms)
export const ANIMATION = {
  fast: 200,
  normal: 300,
  slow: 500,
} as const;

// API Configuration
export const API = {
  timeout: 15000,
  retryAttempts: 3,
  retryDelay: 1000,
} as const;

// Map Configuration
export const MAP = {
  defaultZoom: {
    latitudeDelta: 0.0922,
    longitudeDelta: 0.0421,
  },
  routeZoom: {
    latitudeDelta: 0.05,
    longitudeDelta: 0.05,
  },
  edgePadding: {
    top: 100,
    right: 50,
    bottom: 50,
    left: 50,
  },
} as const;

// Storage Keys
export const STORAGE_KEYS = {
  accessToken: 'auth_access_token',
  refreshToken: 'auth_refresh_token',
  userVehicle: 'USER_VEHICLE',
  onboardingComplete: 'onboarding_complete',
} as const;

// App Stages
export const APP_STAGES = {
  splash: 'splash',
  onboarding: 'onboarding',
  authCheck: 'authCheck',
} as const;

// Validation Rules
export const VALIDATION = {
  minPasswordLength: 8,
  minVehicleNumberLength: 6,
  maxVehicleNumberLength: 15,
} as const;

// Default Values
export const DEFAULTS = {
  location: {
    latitude: 28.6139,
    longitude: 77.2090,
    // Delhi coordinates as default
  },
  splashDuration: 3000,
  autoSlideDuration: 2000,
} as const;
