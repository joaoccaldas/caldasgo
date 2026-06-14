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
  { "id": 6, "name": "Charizard", "image": "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/6.png", "types": ["fire", "flying"] },
  { "id": 150, "name": "Mewtwo", "image": "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/150.png", "types": ["psychic"] },
  { "id": 201, "name": "Unown", "image": "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/201.png", "types": ["psychic"] },
  { "id": 352, "name": "Kecleon", "image": "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/352.png", "types": ["normal"] },
  { "id": 479, "name": "Rotom", "image": "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/479.png", "types": ["electric", "ghost"] },
  { "id": 482, "name": "Azelf", "image": "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/482.png", "types": ["psychic"] },
  { "id": 637, "name": "Volcarona", "image": "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/637.png", "types": ["bug", "fire"] },
  { "id": 718, "name": "Zygarde", "image": "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/718.png", "types": ["dragon", "ground"] },
  { "id": 745, "name": "Lycanroc", "image": "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/745.png", "types": ["rock"] },
  { "id": 1000, "name": "Gholdengo", "image": "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/1000.png", "types": ["steel", "ghost"] },
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
    const initialized = await localforage.getItem<boolean>('caldasgo_pokedex_init_v2');
    let data = await localforage.getItem<PokemonData[]>(POKEDEX_KEY) || [];
    
    if (!initialized) {
      // First time loading the app (or v2), seed with rarest 10
      data = [...DEFAULT_POKEDEX];
      await localforage.setItem(POKEDEX_KEY, data);
      await localforage.setItem('caldasgo_pokedex_init_v2', true);
    }
    
    return data;
  } catch (err) {
    console.error('Error reading Pokedex:', err);
    return DEFAULT_POKEDEX;
  }
};
