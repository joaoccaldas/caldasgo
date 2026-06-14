import type { PokemonData } from '../services/pokeapi';

export interface SpawnedPokemon {
  id: string; // Unique ID for this specific spawn (e.g. uuid)
  pokemonId: number; // The Pokedex ID
  pokemonData: PokemonData;
  lat: number;
  lng: number;
  spawnTime: number; // timestamp
}

export interface Inventory {
  pokeballs: number;
  razzBerries: number;
}

export interface Pokestop {
  id: string;
  lat: number;
  lng: number;
  lastSpun: number | null; // timestamp
}
