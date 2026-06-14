import localforage from 'localforage';
import { PokemonData } from './pokeapi';

const POKEDEX_KEY = 'caldasgo_pokedex';

export const saveToPokedex = async (pokemon: PokemonData) => {
  try {
    const currentDex: PokemonData[] = await localforage.getItem(POKEDEX_KEY) || [];
    // Avoid duplicates
    if (!currentDex.find(p => p.id === pokemon.id)) {
      currentDex.push(pokemon);
      // Sort by ID
      currentDex.sort((a, b) => a.id - b.id);
      await localforage.setItem(POKEDEX_KEY, currentDex);
    }
  } catch (err) {
    console.error('Error saving to Pokedex:', err);
  }
};

export const getPokedex = async (): Promise<PokemonData[]> => {
  try {
    return await localforage.getItem(POKEDEX_KEY) || [];
  } catch (err) {
    console.error('Error reading Pokedex:', err);
    return [];
  }
};
