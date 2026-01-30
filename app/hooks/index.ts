// Custom hooks for common app functionality
import { useState, useEffect, useCallback } from 'react';
import * as Location from 'expo-location';
import { LocationData } from '../types';

/**
 * Hook to manage user's current location with permissions
 */
export function useUserLocation() {
  const [location, setLocation] = useState<LocationData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;

    const getLocation = async () => {
      try {
        const { status } = await Location.requestForegroundPermissionsAsync();
        
        if (status !== 'granted') {
          setError('Location permission denied');
          setLoading(false);
          return;
        }

        const loc = await Location.getCurrentPositionAsync({
          accuracy: Location.Accuracy.Balanced,
        });

        if (isMounted) {
          setLocation({
            latitude: loc.coords.latitude,
            longitude: loc.coords.longitude,
            latitudeDelta: 0.05,
            longitudeDelta: 0.05,
          });
          setError(null);
        }
      } catch (err: any) {
        if (isMounted) {
          setError(err.message || 'Failed to get location');
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    getLocation();

    return () => {
      isMounted = false;
    };
  }, []);

  const refresh = useCallback(async () => {
    setLoading(true);
    try {
      const loc = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.Balanced,
      });
      setLocation({
        latitude: loc.coords.latitude,
        longitude: loc.coords.longitude,
        latitudeDelta: 0.05,
        longitudeDelta: 0.05,
      });
      setError(null);
    } catch (err: any) {
      setError(err.message || 'Failed to get location');
    } finally {
      setLoading(false);
    }
  }, []);

  return { location, loading, error, refresh };
}

/**
 * Hook for API calls with loading and error states
 */
export function useApi<T>(
  apiCall: () => Promise<T>,
  immediate = false
) {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(immediate);
  const [error, setError] = useState<string | null>(null);

  const execute = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const result = await apiCall();
      setData(result);
      return result;
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || err.message || 'An error occurred';
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [apiCall]);

  useEffect(() => {
    if (immediate) {
      execute();
    }
  }, [immediate, execute]);

  return { data, loading, error, execute, setData };
}

/**
 * Hook for debounced value
 */
export function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
}

/**
 * Hook for managing async storage with type safety
 */
export function useAsyncStorage<T>(key: string, initialValue: T) {
  const [storedValue, setStoredValue] = useState<T>(initialValue);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Load from storage on mount
    // Implementation depends on your storage solution (AsyncStorage, SecureStore, etc.)
    setLoading(false);
  }, [key]);

  const setValue = useCallback(
    (value: T | ((val: T) => T)) => {
      try {
        const valueToStore = value instanceof Function ? value(storedValue) : value;
        setStoredValue(valueToStore);
        // Save to storage
        // Implementation depends on your storage solution
      } catch (error) {
        console.error(`Error setting ${key}:`, error);
      }
    },
    [key, storedValue]
  );

  return [storedValue, setValue, loading] as const;
}

/**
 * Hook for keyboard visibility
 */
export function useKeyboard() {
  const [isKeyboardVisible, setKeyboardVisible] = useState(false);

  useEffect(() => {
    // Keyboard event listeners implementation
    // This is platform-specific, requires Keyboard API from react-native
    return () => {
      // Cleanup
    };
  }, []);

  return isKeyboardVisible;
}
