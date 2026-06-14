import localforage from 'localforage';
import type { CandyBag, Inventory, IVs, OwnedPokemon } from '../types';
import { getSpecies } from '../data/pokemonDatabase';
import { calculateCP } from '../data/cpTable';

const INVENTORY_KEY = 'caldasgo_inventory';
const OWNED_KEY = 'caldasgo_owned_pokemon';
const CANDY_KEY = 'caldasgo_candies';
const XP_KEY = 'caldasgo_trainer_xp';
const INIT_KEY = 'caldasgo_init_v3';

const DEFAULT_INVENTORY: Inventory = {
  pokeballs: 20,
  razzBerries: 5,
};

const randomIvs = (): IVs => ({
  attack: Math.floor(Math.random() * 16),
  defense: Math.floor(Math.random() * 16),
  stamina: Math.floor(Math.random() * 16),
});

const makeStarter = (speciesId: number, level: number): OwnedPokemon => {
  const species = getSpecies(speciesId);
  const ivs = randomIvs();
  return {
    uid: `starter-${speciesId}`,
    speciesId,
    level,
    ivs,
    cp: species ? calculateCP(species.baseStats, level, ivs) : 10,
    caughtAt: Date.now(),
  };
};

// Bulbasaur, Charmander, Squirtle, Pikachu - a small starter collection.
const STARTER_SPECIES_IDS = [1, 4, 7, 25];

const DEFAULT_OWNED: OwnedPokemon[] = STARTER_SPECIES_IDS.map(id => makeStarter(id, 5));

const DEFAULT_CANDIES: CandyBag = {
  BULBASAUR: 10,
  CHARMANDER: 10,
  SQUIRTLE: 10,
  PIKACHU: 10,
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

const ensureSeeded = async () => {
  const initialized = await localforage.getItem<boolean>(INIT_KEY);
  if (initialized) return;

  await localforage.setItem(OWNED_KEY, DEFAULT_OWNED);
  await localforage.setItem(CANDY_KEY, DEFAULT_CANDIES);
  await localforage.setItem(INIT_KEY, true);
};

export const getOwnedPokemon = async (): Promise<OwnedPokemon[]> => {
  try {
    await ensureSeeded();
    return (await localforage.getItem<OwnedPokemon[]>(OWNED_KEY)) || [];
  } catch (err) {
    console.error('Error reading owned Pokémon:', err);
    return [];
  }
};

export const addOwnedPokemon = async (pokemon: OwnedPokemon): Promise<OwnedPokemon[]> => {
  try {
    const current = await getOwnedPokemon();
    const next = [...current, pokemon];
    await localforage.setItem(OWNED_KEY, next);
    return next;
  } catch (err) {
    console.error('Error adding owned Pokémon:', err);
    return getOwnedPokemon();
  }
};

export const updateOwnedPokemon = async (
  uid: string,
  updates: Partial<OwnedPokemon>,
): Promise<OwnedPokemon[]> => {
  try {
    const current = await getOwnedPokemon();
    const next = current.map(p => (p.uid === uid ? { ...p, ...updates } : p));
    await localforage.setItem(OWNED_KEY, next);
    return next;
  } catch (err) {
    console.error('Error updating owned Pokémon:', err);
    return getOwnedPokemon();
  }
};

export const getCandies = async (): Promise<CandyBag> => {
  try {
    await ensureSeeded();
    return (await localforage.getItem<CandyBag>(CANDY_KEY)) || {};
  } catch (err) {
    console.error('Error reading candies:', err);
    return {};
  }
};

export const addCandy = async (family: string, amount: number): Promise<CandyBag> => {
  try {
    const current = await getCandies();
    const next = { ...current, [family]: (current[family] || 0) + amount };
    await localforage.setItem(CANDY_KEY, next);
    return next;
  } catch (err) {
    console.error('Error adding candy:', err);
    return getCandies();
  }
};

export const spendCandy = async (family: string, amount: number): Promise<CandyBag> => {
  try {
    const current = await getCandies();
    const next = { ...current, [family]: Math.max(0, (current[family] || 0) - amount) };
    await localforage.setItem(CANDY_KEY, next);
    return next;
  } catch (err) {
    console.error('Error spending candy:', err);
    return getCandies();
  }
};

export const getTrainerXp = async (): Promise<number> => {
  try {
    return (await localforage.getItem<number>(XP_KEY)) || 0;
  } catch (err) {
    console.error('Error reading trainer XP:', err);
    return 0;
  }
};

export const addTrainerXp = async (amount: number): Promise<number> => {
  try {
    const current = await getTrainerXp();
    const next = current + amount;
    await localforage.setItem(XP_KEY, next);
    return next;
  } catch (err) {
    console.error('Error adding trainer XP:', err);
    return getTrainerXp();
  }
};
