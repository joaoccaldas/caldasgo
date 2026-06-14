import { PokemonData } from '../services/pokeapi';

export interface SpawnedPokemon {
  id: string; // Unique ID for this specific spawn (e.g. uuid)
  pokemonId: number; // The Pokedex ID
  pokemonData: PokemonData;
  lat: number;
  lng: number;
  spawnTime: number; // timestamp
}
