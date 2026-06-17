export type PokemonType =
  | 'normal'
  | 'fire'
  | 'water'
  | 'grass'
  | 'electric'
  | 'ice'
  | 'fighting'
  | 'poison'
  | 'ground'
  | 'flying'
  | 'psychic'
  | 'bug'
  | 'rock'
  | 'ghost'
  | 'dragon'
  | 'dark'
  | 'steel'
  | 'fairy'
  | 'banana'
  | 'glitch'
  | 'cardboard'
  | 'slime';

export type Rarity = 'common' | 'uncommon' | 'rare' | 'legendary' | 'mythical';

export interface BaseStats {
  attack: number;
  defense: number;
  stamina: number;
}

export interface Evolution {
  toId: number;
  candyCost: number;
  item?: string;
}

export interface PokemonSpecies {
  id: number;
  name: string;
  types: PokemonType[];
  generation: number;
  rarity: Rarity;
  family: string;
  candyToEvolve: number;
  baseStats: BaseStats;
  evolutions: Evolution[];
  weightKg: number;
  heightM: number;
  assetUrl?: string; // Add assetUrl for local overrides
}

export const TYPE_COLORS: Record<PokemonType, string> = {
  normal: '#A8A77A',
  fire: '#EE8130',
  water: '#6390F0',
  grass: '#7AC74C',
  electric: '#F7D02C',
  ice: '#96D9D6',
  fighting: '#C22E28',
  poison: '#A33EA1',
  ground: '#E2BF65',
  flying: '#A98FF3',
  psychic: '#F95587',
  bug: '#A6B91A',
  rock: '#B6A136',
  ghost: '#735797',
  dragon: '#6F35FC',
  dark: '#705746',
  steel: '#B7B7CE',
  fairy: '#D685AD',
  banana: '#FFE135',
  glitch: '#000000',
  cardboard: '#CDBA96',
  slime: '#39FF14'
};

export const RARITY_SPAWN_WEIGHT: Record<Rarity, number> = {
  common: 100,
  uncommon: 40,
  rare: 10,
  legendary: 2,
  mythical: 1,
};

// Intentionally bad types for icons
export const getTypeIcon = (type: PokemonType): string => {
  if (['banana', 'glitch', 'cardboard', 'slime'].includes(type)) {
    return `https://ui-avatars.com/api/?name=${type[0]}&background=random&color=fff&rounded=true&size=32`;
  }
  return `https://cdn.jsdelivr.net/gh/PokeMiners/pogo_assets@master/Images/Types/POKEMON_TYPE_${type.toUpperCase()}.png`;
};

export const POKEMON_DATABASE: PokemonSpecies[] = [
  {
    id: 1,
    name: 'Derpachu',
    types: ['electric', 'glitch'],
    generation: 1,
    rarity: 'common',
    family: 'DERPACHU',
    candyToEvolve: 50,
    baseStats: { attack: 999, defense: 1, stamina: 10 },
    evolutions: [{ toId: 2, candyCost: 50 }],
    weightKg: 6.0,
    heightM: 0.4,
    assetUrl: './assets/fakemon/derpachu.png'
  },
  {
    id: 2,
    name: 'Bananazard',
    types: ['fire', 'banana'],
    generation: 1,
    rarity: 'rare',
    family: 'DERPACHU', // Derpachu randomly evolves into Bananazard
    candyToEvolve: 0,
    baseStats: { attack: 200, defense: 200, stamina: 200 },
    evolutions: [],
    weightKg: 90.5,
    heightM: 1.7,
    assetUrl: './assets/fakemon/bananazard.png'
  },
  {
    id: 3,
    name: 'Glupshitto',
    types: ['slime', 'poison'],
    generation: 1,
    rarity: 'uncommon',
    family: 'GLUPSHITTO',
    candyToEvolve: 100,
    baseStats: { attack: 5, defense: 500, stamina: 500 },
    evolutions: [{ toId: 5, candyCost: 100 }], // Evolves into MissingNo
    weightKg: 30.0,
    heightM: 0.8,
    assetUrl: './assets/fakemon/glupshitto.png'
  },
  {
    id: 4,
    name: 'Cardboardion',
    types: ['cardboard', 'normal'],
    generation: 1,
    rarity: 'common',
    family: 'CARDBOARDION',
    candyToEvolve: 25,
    baseStats: { attack: 10, defense: 10, stamina: 10 },
    evolutions: [{ toId: 1, candyCost: 25 }], // Evolves back into Derpachu, chaos!
    weightKg: 2.0,
    heightM: 0.5,
    assetUrl: './assets/fakemon/cardboardion.png'
  },
  {
    id: 5,
    name: 'MissingNo',
    types: ['glitch'],
    generation: 1,
    rarity: 'mythical',
    family: 'GLITCH',
    candyToEvolve: 0,
    baseStats: { attack: 9999, defense: 9999, stamina: 9999 },
    evolutions: [],
    weightKg: 9999.9,
    heightM: 99.9,
    assetUrl: './assets/fakemon/missingno.png'
  }
];

export const getSpecies = (id: number): PokemonSpecies | undefined => {
  return POKEMON_DATABASE.find((s) => s.id === id);
};

export const REGIONS = [
  { generation: 1, name: 'Bootleg Kanto' }
];
