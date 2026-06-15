import type { PokemonType } from './pokemonDatabase';

export interface Move {
  name: string;
  type: PokemonType;
}

// A representative Fast + Charged move per type, mirroring real Pokémon GO movesets.
const FAST_MOVE: Record<PokemonType, string> = {
  normal: 'Tackle', fire: 'Ember', water: 'Water Gun', electric: 'Thunder Shock',
  grass: 'Vine Whip', ice: 'Frost Breath', fighting: 'Counter', poison: 'Poison Jab',
  ground: 'Mud Shot', flying: 'Wing Attack', psychic: 'Confusion', bug: 'Bug Bite',
  rock: 'Rock Throw', ghost: 'Shadow Claw', dragon: 'Dragon Breath', dark: 'Snarl',
  steel: 'Metal Claw', fairy: 'Charm',
};

const CHARGED_MOVE: Record<PokemonType, string> = {
  normal: 'Body Slam', fire: 'Flamethrower', water: 'Hydro Pump', electric: 'Thunderbolt',
  grass: 'Solar Beam', ice: 'Ice Beam', fighting: 'Dynamic Punch', poison: 'Sludge Bomb',
  ground: 'Earthquake', flying: 'Aerial Ace', psychic: 'Psychic', bug: 'X-Scissor',
  rock: 'Rock Slide', ghost: 'Shadow Ball', dragon: 'Dragon Claw', dark: 'Crunch',
  steel: 'Flash Cannon', fairy: 'Dazzling Gleam',
};

/**
 * Derives a plausible Fast + Charged move pair from a Pokémon's typing:
 * the Fast move comes from its primary type and the Charged move from its
 * secondary type (or primary, if it has only one type).
 */
export function getMoveset(types: PokemonType[]): { fast: Move; charged: Move } {
  const primary = types[0];
  const secondary = types[1] ?? types[0];
  return {
    fast: { name: FAST_MOVE[primary], type: primary },
    charged: { name: CHARGED_MOVE[secondary], type: secondary },
  };
}

export interface Appraisal {
  stars: number; // 0–3 filled stars, matching the real game's appraisal tiers
  label: string;
}

/** Maps an IV percentage to Pokémon GO's appraisal star tiers. */
export function getAppraisal(ivPercent: number): Appraisal {
  if (ivPercent === 100) return { stars: 3, label: 'Perfect!' };
  if (ivPercent >= 80) return { stars: 3, label: 'Wonder' };
  if (ivPercent >= 67) return { stars: 2, label: 'Strong' };
  if (ivPercent >= 51) return { stars: 1, label: 'Decent' };
  return { stars: 0, label: 'Average' };
}
