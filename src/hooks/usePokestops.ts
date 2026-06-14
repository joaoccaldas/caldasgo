import { useState, useEffect, useRef } from 'react';
import type { Location } from './useGeolocation';
import type { Pokestop } from '../types';

const POKESTOP_COOLDOWN_MS = 5 * 60 * 1000; // 5 minutes

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
    
    stops.push({
      id: `pokestop_${i}_${Date.now()}`,
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
