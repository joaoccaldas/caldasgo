import { useState, useEffect, useRef } from 'react';
import { Location } from './useGeolocation';
import { RARE_POKEMON_IDS, fetchPokemonData } from '../services/pokeapi';
import { SpawnedPokemon } from '../types';

const MAX_SPAWNS = 5;
const SPAWN_INTERVAL_MS = 15000; // Try to spawn every 15 seconds
const DESPAWN_TIME_MS = 60000 * 5; // Despawn after 5 minutes

// Generate a random offset roughly between 10 to 100 meters away
const getRandomOffset = () => {
  const radius = 0.001; // roughly 111 meters
  const u = Math.random();
  const v = Math.random();
  const w = radius * Math.sqrt(u);
  const t = 2 * Math.PI * v;
  const x = w * Math.cos(t);
  const y = w * Math.sin(t);
  return { dLat: x, dLng: y };
};

export const useSpawning = (playerLocation: Location | null) => {
  const [spawnedPokemon, setSpawnedPokemon] = useState<SpawnedPokemon[]>([]);
  const lastSpawnTime = useRef<number>(0);

  useEffect(() => {
    if (!playerLocation) return;

    const interval = setInterval(async () => {
      const now = Date.now();
      
      // Clean up old spawns
      setSpawnedPokemon(prev => prev.filter(p => now - p.spawnTime < DESPAWN_TIME_MS));

      // Check if we should spawn
      if (now - lastSpawnTime.current > SPAWN_INTERVAL_MS) {
        setSpawnedPokemon(prev => {
          if (prev.length >= MAX_SPAWNS) return prev;
          
          // Trigger spawn asynchronously
          spawnRandomPokemon(playerLocation).then(newSpawn => {
            if (newSpawn) {
              setSpawnedPokemon(current => [...current, newSpawn]);
            }
          });
          
          lastSpawnTime.current = now;
          return prev;
        });
      }
    }, 5000); // Check every 5 seconds

    return () => clearInterval(interval);
  }, [playerLocation]);

  const spawnRandomPokemon = async (loc: Location): Promise<SpawnedPokemon | null> => {
    const randomId = RARE_POKEMON_IDS[Math.floor(Math.random() * RARE_POKEMON_IDS.length)];
    const data = await fetchPokemonData(randomId);
    
    if (!data) return null;

    const offset = getRandomOffset();
    
    return {
      id: Math.random().toString(36).substring(2, 9),
      pokemonId: randomId,
      pokemonData: data,
      lat: loc.lat + offset.dLat,
      lng: loc.lng + offset.dLng,
      spawnTime: Date.now(),
    };
  };

  const removeSpawn = (spawnId: string) => {
    setSpawnedPokemon(prev => prev.filter(p => p.id !== spawnId));
  };

  return { spawnedPokemon, removeSpawn };
};
