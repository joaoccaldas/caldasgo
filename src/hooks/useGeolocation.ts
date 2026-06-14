import { useState, useEffect, useRef } from 'react';

export interface Location {
  lat: number;
  lng: number;
}

const MOCK_LOCATION: Location = { lat: 40.7812, lng: -73.9665 }; // Central Park, NY

const GEOLOCATION_SUPPORTED = typeof navigator !== 'undefined' && !!navigator.geolocation;

export const useGeolocation = () => {
  const [location, setLocation] = useState<Location | null>(GEOLOCATION_SUPPORTED ? null : MOCK_LOCATION);
  const [error, setError] = useState<string | null>(
    GEOLOCATION_SUPPORTED ? null : 'Geolocation not supported. Using mock location.',
  );
  const [isMock, setIsMock] = useState(!GEOLOCATION_SUPPORTED);
  const gotLocationRef = useRef(false);

  useEffect(() => {
    if (!GEOLOCATION_SUPPORTED) return;

    const success = (position: GeolocationPosition) => {
      gotLocationRef.current = true;
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
      if (!gotLocationRef.current) {
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
      if (!gotLocationRef.current) {
        setError('GPS timeout. Using mock location.');
        setIsMock(true);
        setLocation(MOCK_LOCATION);
      }
    }, 12000);

    return () => {
      navigator.geolocation.clearWatch(watchId);
      clearTimeout(timeoutId);
    };
  }, []);

  return { location, error, isMock, setLocation }; // Export setLocation so users can mock tap the map
};
