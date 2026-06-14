import { useState, useEffect, useRef } from 'react';
import type { Location } from './useGeolocation';
import { POKEMON_DATABASE, RARITY_SPAWN_WEIGHT } from '../data/pokemonDatabase';
import { calculateCP } from '../data/cpTable';
import type { IVs, SpawnedPokemon } from '../types';

const MAX_SPAWNS = 6;
const SPAWN_INTERVAL_MS = 15000; // Try to spawn every 15 seconds
const DESPAWN_TIME_MS = 60000 * 5; // Despawn after 5 minutes

const TOTAL_SPAWN_WEIGHT = POKEMON_DATABASE.reduce(
  (sum, species) => sum + RARITY_SPAWN_WEIGHT[species.rarity],
  0,
);

const pickRandomSpecies = () => {
  let roll = Math.random() * TOTAL_SPAWN_WEIGHT;
  for (const species of POKEMON_DATABASE) {
    roll -= RARITY_SPAWN_WEIGHT[species.rarity];
    if (roll <= 0) return species;
  }
  return POKEMON_DATABASE[POKEMON_DATABASE.length - 1];
};

const randomIvs = (): IVs => ({
  attack: Math.floor(Math.random() * 16),
  defense: Math.floor(Math.random() * 16),
  stamina: Math.floor(Math.random() * 16),
});

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

const spawnRandomPokemon = (loc: Location): SpawnedPokemon => {
  const species = pickRandomSpecies();
  const level = Math.floor(Math.random() * 30) + 1;
  const ivs = randomIvs();
  const offset = getRandomOffset();

  return {
    id: Math.random().toString(36).substring(2, 9),
    speciesId: species.id,
    species,
    level,
    ivs,
    cp: calculateCP(species.baseStats, level, ivs),
    lat: loc.lat + offset.dLat,
    lng: loc.lng + offset.dLng,
    spawnTime: Date.now(),
  };
};

export const useSpawning = (playerLocation: Location | null) => {
  const [spawnedPokemon, setSpawnedPokemon] = useState<SpawnedPokemon[]>([]);
  const lastSpawnTime = useRef<number>(0);

  useEffect(() => {
    if (!playerLocation) return;

    const interval = setInterval(() => {
      const now = Date.now();

      setSpawnedPokemon(prev => {
        const alive = prev.filter(p => now - p.spawnTime < DESPAWN_TIME_MS);

        if (alive.length < MAX_SPAWNS && now - lastSpawnTime.current > SPAWN_INTERVAL_MS) {
          lastSpawnTime.current = now;
          return [...alive, spawnRandomPokemon(playerLocation)];
        }

        return alive;
      });
    }, 5000); // Check every 5 seconds

    return () => clearInterval(interval);
  }, [playerLocation]);

  const removeSpawn = (spawnId: string) => {
    setSpawnedPokemon(prev => prev.filter(p => p.id !== spawnId));
  };

  return { spawnedPokemon, removeSpawn };
};
