import { useState, useEffect, useCallback } from 'react';
import {
  getOwnedPokemon,
  addOwnedPokemon,
  updateOwnedPokemon,
  getCandies,
  addCandy,
  spendCandy,
  getStardust,
  addStardust,
  getSeenSpecies,
  addSeenSpecies,
} from '../services/storage';
import { getSpecies } from '../data/pokemonDatabase';
import { calculateCP, powerUpCost, MAX_LEVEL } from '../data/cpTable';
import type { CandyBag, OwnedPokemon, SpawnedPokemon } from '../types';

// Candy awarded per catch, matching the real game's base catch reward.
const CATCH_CANDY = 3;
// Stardust awarded per catch (the real game gives 100 for a first-evolution catch).
const CATCH_STARDUST = 100;

export const useCollection = () => {
  const [owned, setOwned] = useState<OwnedPokemon[]>([]);
  const [candies, setCandies] = useState<CandyBag>({});
  const [stardust, setStardust] = useState(0);
  const [seen, setSeen] = useState<number[]>([]);

  useEffect(() => {
    Promise.all([getOwnedPokemon(), getCandies(), getStardust(), getSeenSpecies()]).then(
      ([ownedList, candyBag, dust, seenList]) => {
        setOwned(ownedList);
        setCandies(candyBag);
        setStardust(dust);
        setSeen(seenList);
      },
    );
  }, []);

  // Record that a species has been encountered, for the Pokédex "seen" state.
  const recordSeen = useCallback(async (speciesId: number) => {
    const next = await addSeenSpecies(speciesId);
    setSeen(next);
  }, []);

  const catchPokemon = useCallback(
    async (spawn: SpawnedPokemon) => {
      const isNewSpecies = !owned.some(p => p.speciesId === spawn.speciesId);
      const newPokemon: OwnedPokemon = {
        uid: `${spawn.speciesId}-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
        speciesId: spawn.speciesId,
        level: spawn.level,
        ivs: spawn.ivs,
        cp: spawn.cp,
        caughtAt: Date.now(),
      };

      const [ownedList, candyBag, dust, seenList] = await Promise.all([
        addOwnedPokemon(newPokemon),
        addCandy(spawn.species.family, CATCH_CANDY),
        addStardust(CATCH_STARDUST),
        addSeenSpecies(spawn.speciesId),
      ]);
      setOwned(ownedList);
      setCandies(candyBag);
      setStardust(dust);
      setSeen(seenList);

      return { pokemon: newPokemon, isNewSpecies };
    },
    [owned],
  );

  const evolve = useCallback(
    async (uid: string, toSpeciesId: number, candyCost: number) => {
      const pokemon = owned.find(p => p.uid === uid);
      const fromSpecies = pokemon && getSpecies(pokemon.speciesId);
      const toSpecies = getSpecies(toSpeciesId);
      if (!pokemon || !fromSpecies || !toSpecies) return false;

      const family = fromSpecies.family;
      if ((candies[family] || 0) < candyCost) return false;

      const newCp = calculateCP(toSpecies.baseStats, pokemon.level, pokemon.ivs);
      const [ownedList, candyBag, seenList] = await Promise.all([
        updateOwnedPokemon(uid, { speciesId: toSpeciesId, cp: newCp }),
        spendCandy(family, candyCost),
        addSeenSpecies(toSpeciesId),
      ]);
      setOwned(ownedList);
      setCandies(candyBag);
      setSeen(seenList);
      return true;
    },
    [owned, candies],
  );

  const powerUp = useCallback(
    async (uid: string) => {
      const pokemon = owned.find(p => p.uid === uid);
      const species = pokemon && getSpecies(pokemon.speciesId);
      if (!pokemon || !species || pokemon.level >= MAX_LEVEL) return false;

      const cost = powerUpCost(pokemon.level);
      const family = species.family;
      if (stardust < cost.stardust || (candies[family] || 0) < cost.candy) return false;

      const newLevel = pokemon.level + 1;
      const newCp = calculateCP(species.baseStats, newLevel, pokemon.ivs);
      const [ownedList, dust, candyBag] = await Promise.all([
        updateOwnedPokemon(uid, { level: newLevel, cp: newCp }),
        addStardust(-cost.stardust),
        spendCandy(family, cost.candy),
      ]);
      setOwned(ownedList);
      setStardust(dust);
      setCandies(candyBag);
      return true;
    },
    [owned, candies, stardust],
  );

  return { owned, candies, stardust, seen, catchPokemon, evolve, powerUp, recordSeen };
};
