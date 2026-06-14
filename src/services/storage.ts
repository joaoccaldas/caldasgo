import localforage from 'localforage';
import type { PokemonData } from './pokeapi';
import type { Inventory } from '../types';

const POKEDEX_KEY = 'caldasgo_pokedex';
const INVENTORY_KEY = 'caldasgo_inventory';

const DEFAULT_INVENTORY: Inventory = {
  pokeballs: 20,
  razzBerries: 5,
};

export const getInventory = async (): Promise<Inventory> => {
  try {
    const inv = await localforage.getItem<Inventory>(INVENTORY_KEY);
    return inv || DEFAULT_INVENTORY;
  } catch (err) {
    console.error('Error reading inventory:', err);
    return DEFAULT_INVENTORY;
  }
};

export const updateInventory = async (updates: Partial<Inventory>): Promise<Inventory> => {
  try {
    const current = await getInventory();
    const next = { ...current, ...updates };
    await localforage.setItem(INVENTORY_KEY, next);
    return next;
  } catch (err) {
    console.error('Error updating inventory:', err);
    return DEFAULT_INVENTORY;
  }
};

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
