import type { PokemonSpecies } from '../data/pokemonDatabase';

export interface IVs {
  attack: number;
  defense: number;
  stamina: number;
}

export interface SpawnedPokemon {
  id: string; // Unique ID for this specific spawn
  speciesId: number;
  species: PokemonSpecies;
  level: number;
  ivs: IVs;
  cp: number;
  lat: number;
  lng: number;
  spawnTime: number; // timestamp
}

/** An individual Pokémon a trainer has caught, stored in their collection. */
export interface OwnedPokemon {
  uid: string;
  speciesId: number;
  level: number;
  ivs: IVs;
  cp: number;
  caughtAt: number; // timestamp
}

export interface Inventory {
  pokeballs: number;
  razzBerries: number;
}

/** Candy counts keyed by Pokémon evolution family (e.g. "CHARMANDER"). */
export type CandyBag = Record<string, number>;

export interface Pokestop {
  id: string;
  lat: number;
  lng: number;
  lastSpun: number | null; // timestamp
}
