import localforage from 'localforage';
import type { CandyBag, Inventory, IVs, OwnedPokemon } from '../types';
import { getSpecies } from '../data/pokemonDatabase';
import { calculateCP } from '../data/cpTable';

const INVENTORY_KEY = 'caldasgo_inventory';
const OWNED_KEY = 'caldasgo_owned_pokemon';
const CANDY_KEY = 'caldasgo_candies';
const XP_KEY = 'caldasgo_trainer_xp';
const STARDUST_KEY = 'caldasgo_stardust';
const SEEN_KEY = 'caldasgo_seen_species';
const INIT_KEY = 'caldasgo_init_v4';

const DEFAULT_STARDUST = 1000;

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

const makeShinyLegendary = (speciesId: number, level: number): OwnedPokemon => {
  const species = getSpecies(speciesId);
  const ivs = { attack: 15, defense: 15, stamina: 15 };
  return {
    uid: `legendary-${speciesId}`,
    speciesId,
    level,
    ivs,
    cp: species ? calculateCP(species.baseStats, level, ivs) : 10,
    caughtAt: Date.now() - Math.random() * 1000000,
    isShiny: true,
  };
};

// Bulbasaur, Charmander, Squirtle, Pikachu - a small starter collection.
const STARTER_SPECIES_IDS = [1, 4, 7, 25];

// 10 Iconic Shiny Legendaries
const SHINY_LEGENDARY_IDS = [150, 249, 250, 382, 383, 384, 483, 484, 487, 643];

const DEFAULT_OWNED: OwnedPokemon[] = [
  ...STARTER_SPECIES_IDS.map(id => makeStarter(id, 5)),
  ...SHINY_LEGENDARY_IDS.map(id => makeShinyLegendary(id, 40))
];

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
  await localforage.setItem(SEEN_KEY, [...STARTER_SPECIES_IDS, ...SHINY_LEGENDARY_IDS]);
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

export const getStardust = async (): Promise<number> => {
  try {
    const value = await localforage.getItem<number>(STARDUST_KEY);
    return value ?? DEFAULT_STARDUST;
  } catch (err) {
    console.error('Error reading stardust:', err);
    return DEFAULT_STARDUST;
  }
};

export const addStardust = async (amount: number): Promise<number> => {
  try {
    const current = await getStardust();
    const next = Math.max(0, current + amount);
    await localforage.setItem(STARDUST_KEY, next);
    return next;
  } catch (err) {
    console.error('Error updating stardust:', err);
    return getStardust();
  }
};

export const getSeenSpecies = async (): Promise<number[]> => {
  try {
    return (await localforage.getItem<number[]>(SEEN_KEY)) || [];
  } catch (err) {
    console.error('Error reading seen species:', err);
    return [];
  }
};

export const addSeenSpecies = async (speciesId: number): Promise<number[]> => {
  try {
    const current = await getSeenSpecies();
    if (current.includes(speciesId)) return current;
    const next = [...current, speciesId];
    await localforage.setItem(SEEN_KEY, next);
    return next;
  } catch (err) {
    console.error('Error adding seen species:', err);
    return getSeenSpecies();
  }
};
