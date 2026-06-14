import localforage from 'localforage';
import type { PokemonData } from './pokeapi';
import type { Inventory } from '../types';

const POKEDEX_KEY = 'caldasgo_pokedex';
const INVENTORY_KEY = 'caldasgo_inventory';

const DEFAULT_INVENTORY: Inventory = {
  pokeballs: 20,
  razzBerries: 5,
};

const DEFAULT_POKEDEX: PokemonData[] = [
  {
    id: 150,
    name: "Mewtwo",
    image: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/150.png",
    types: ["psychic"]
  },
  {
    id: 249,
    name: "Lugia",
    image: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/249.png",
    types: ["psychic", "flying"]
  },
  {
    id: 384,
    name: "Rayquaza",
    image: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/384.png",
    types: ["dragon", "flying"]
  },
  {
    id: 493,
    name: "Arceus",
    image: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/493.png",
    types: ["normal"]
  }
];

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
    const initialized = await localforage.getItem<boolean>('caldasgo_pokedex_init');
    let data = await localforage.getItem<PokemonData[]>(POKEDEX_KEY) || [];
    
    if (!initialized) {
      // First time loading the app, seed with legendaries
      data = [...DEFAULT_POKEDEX];
      await localforage.setItem(POKEDEX_KEY, data);
      await localforage.setItem('caldasgo_pokedex_init', true);
    }
    
    return data;
  } catch (err) {
    console.error('Error reading Pokedex:', err);
    return DEFAULT_POKEDEX;
  }
};
