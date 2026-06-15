import { useState, useEffect, useRef } from 'react';
import type { Location } from './useGeolocation';
import type { Pokestop } from '../types';

const POKESTOP_COOLDOWN_MS = 5 * 60 * 1000; // 5 minutes

// Generic landmark-style names, similar to the kinds of real-world POIs
// that commonly become PokéStops.
const POKESTOP_NAMES = [
  'Community Garden Mural', 'Old Town Clock Tower', 'Riverside Trail Marker',
  'Heritage Fountain', 'Sunset Park Pavilion', 'Historic Plaza Statue',
  'Neighborhood Library', 'Corner Street Art', 'Memorial Garden Bench',
  'City Hall Plaza', 'Lighthouse Point Marker', 'Central Square Sundial',
];

const generatePokestops = (center: Location, count: number): Pokestop[] => {
  const stops: Pokestop[] = [];
  for (let i = 0; i < count; i++) {
    // Generate within roughly 200 meters
    const radius = 0.002;
    const u = Math.random();
    const v = Math.random();
    const w = radius * Math.sqrt(u);
    const t = 2 * Math.PI * v;
    const x = w * Math.cos(t);
    const y = w * Math.sin(t);

    const id = `pokestop_${i}_${Date.now()}`;
    stops.push({
      id,
      name: POKESTOP_NAMES[Math.floor(Math.random() * POKESTOP_NAMES.length)],
      photoSeed: id,
      lat: center.lat + x,
      lng: center.lng + y,
      lastSpun: null,
    });
  }
  return stops;
};

export const usePokestops = (playerLocation: Location | null) => {
  const [pokestops, setPokestops] = useState<Pokestop[]>([]);
  const hasGenerated = useRef(false);

  useEffect(() => {
    // Only generate once based on initial location for simplicity
    if (playerLocation && !hasGenerated.current) {
      setPokestops(generatePokestops(playerLocation, 4));
      hasGenerated.current = true;
    }
  }, [playerLocation]);

  // Periodic refresh to trigger re-renders when cooldowns expire
  const [, setTick] = useState(0);
  useEffect(() => {
    const interval = setInterval(() => setTick(t => t + 1), 5000);
    return () => clearInterval(interval);
  }, []);

  const spinPokestop = (id: string) => {
    setPokestops(prev => prev.map(stop => {
      if (stop.id === id) {
        return { ...stop, lastSpun: Date.now() };
      }
      return stop;
    }));
  };

  const isSpinable = (stop: Pokestop) => {
    if (!stop.lastSpun) return true;
    return (Date.now() - stop.lastSpun) > POKESTOP_COOLDOWN_MS;
  };

  return { pokestops, spinPokestop, isSpinable };
};
