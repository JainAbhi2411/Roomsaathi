import { useState, useEffect, useCallback } from 'react';
import { getUserLocation, isGeolocationAvailable, type Coordinates } from '@/lib/geolocation';

interface UseGeolocationReturn {
  location: Coordinates | null;
  loading: boolean;
  error: string | null;
  isAvailable: boolean;
  requestLocation: () => Promise<void>;
}

/**
 * Hook to manage user's geolocation
 */
export function useGeolocation(): UseGeolocationReturn {
  const [location, setLocation] = useState<Coordinates | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isAvailable] = useState(isGeolocationAvailable());

  const requestLocation = useCallback(async () => {
    if (!isAvailable) {
      setError('Geolocation is not supported by your browser');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const coords = await getUserLocation();
      if (coords) {
        setLocation(coords);
        setError(null);
      } else {
        setError('Unable to get your location. Please check your browser permissions.');
      }
    } catch (err) {
      setError('Failed to get your location');
      console.error('Geolocation error:', err);
    } finally {
      setLoading(false);
    }
  }, [isAvailable]);

  return {
    location,
    loading,
    error,
    isAvailable,
    requestLocation
  };
}
