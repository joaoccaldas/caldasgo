import { useState, useEffect } from 'react';

export interface Location {
  lat: number;
  lng: number;
}

const MOCK_LOCATION: Location = { lat: 40.7812, lng: -73.9665 }; // Central Park, NY

export const useGeolocation = () => {
  const [location, setLocation] = useState<Location | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isMock, setIsMock] = useState(false);

  useEffect(() => {
    if (!navigator.geolocation) {
      setError('Geolocation not supported. Using mock location.');
      setLocation(MOCK_LOCATION);
      setIsMock(true);
      return;
    }

    const success = (position: GeolocationPosition) => {
      setLocation({
        lat: position.coords.latitude,
        lng: position.coords.longitude,
      });
      setError(null);
      setIsMock(false);
    };

    const handleError = (error: GeolocationPositionError) => {
      console.warn("GPS Error, falling back to mock:", error.message);
      setError('GPS unavailable. Using mock location.');
      if (!location) {
        setLocation(MOCK_LOCATION);
        setIsMock(true);
      }
    };

    // Try to get initial position
    navigator.geolocation.getCurrentPosition(success, handleError, {
      enableHighAccuracy: true,
      timeout: 10000,
      maximumAge: 0,
    });

    // Watch position
    const watchId = navigator.geolocation.watchPosition(success, handleError, {
      enableHighAccuracy: true,
      timeout: 10000,
      maximumAge: 0,
    });

    // Hard fallback if getCurrentPosition hangs indefinitely
    const timeoutId = setTimeout(() => {
      setLocation(prev => {
        if (!prev) {
          setError('GPS timeout. Using mock location.');
          setIsMock(true);
          return MOCK_LOCATION;
        }
        return prev;
      });
    }, 12000);

    return () => {
      navigator.geolocation.clearWatch(watchId);
      clearTimeout(timeoutId);
    };
  }, []);

  return { location, error, isMock, setLocation }; // Export setLocation so users can mock tap the map
};
