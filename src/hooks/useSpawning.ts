import { useEffect, useRef, useState } from 'react';
import type { Location } from './useGeolocation';
import { POKEMON_DATABASE, RARITY_SPAWN_WEIGHT } from '../data/pokemonDatabase';
import { calculateCP } from '../data/cpTable';
import type { IVs, SpawnedPokemon } from '../types';

const MAX_SPAWNS = 8;
const INITIAL_SPAWNS = 4;
const SPAWN_INTERVAL_MS = 15_000;
const DESPAWN_TIME_MS = 60_000 * 5;

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

const getRandomOffset = (minimumRadius = 0.00016, maximumRadius = 0.00105) => {
  const angle = Math.random() * Math.PI * 2;
  const radius = minimumRadius + Math.sqrt(Math.random()) * (maximumRadius - minimumRadius);
  return {
    dLat: radius * Math.cos(angle),
    dLng: radius * Math.sin(angle),
  };
};

const spawnRandomPokemon = (location: Location): SpawnedPokemon => {
  const species = pickRandomSpecies();
  const level = Math.floor(Math.random() * 30) + 1;
  const ivs = randomIvs();
  const offset = getRandomOffset();

  return {
    id: `${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 9)}`,
    speciesId: species.id,
    species,
    level,
    ivs,
    cp: calculateCP(species.baseStats, level, ivs),
    lat: location.lat + offset.dLat,
    lng: location.lng + offset.dLng,
    spawnTime: Date.now(),
  };
};

export const useSpawning = (playerLocation: Location | null) => {
  const [spawnedPokemon, setSpawnedPokemon] = useState<SpawnedPokemon[]>([]);
  const lastSpawnTime = useRef(0);
  const hasSeededWorld = useRef(false);

  useEffect(() => {
    if (!playerLocation || hasSeededWorld.current) return;

    hasSeededWorld.current = true;
    lastSpawnTime.current = Date.now();
    setSpawnedPokemon(
      Array.from({ length: INITIAL_SPAWNS }, () => spawnRandomPokemon(playerLocation)),
    );
  }, [playerLocation]);

  useEffect(() => {
    if (!playerLocation) return;

    const interval = window.setInterval(() => {
      const now = Date.now();

      setSpawnedPokemon((current) => {
        const active = current.filter((pokemon) => now - pokemon.spawnTime < DESPAWN_TIME_MS);

        if (active.length < MAX_SPAWNS && now - lastSpawnTime.current >= SPAWN_INTERVAL_MS) {
          lastSpawnTime.current = now;
          return [...active, spawnRandomPokemon(playerLocation)];
        }

        return active;
      });
    }, 5_000);

    return () => window.clearInterval(interval);
  }, [playerLocation]);

  const removeSpawn = (spawnId: string) => {
    setSpawnedPokemon((current) => current.filter((pokemon) => pokemon.id !== spawnId));
  };

  return { spawnedPokemon, removeSpawn };
};
