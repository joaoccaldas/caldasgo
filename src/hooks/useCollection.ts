import { useState, useEffect, useCallback } from 'react';
import {
  getOwnedPokemon,
  addOwnedPokemon,
  updateOwnedPokemon,
  getCandies,
  addCandy,
  spendCandy,
} from '../services/storage';
import { getSpecies } from '../data/pokemonDatabase';
import { calculateCP } from '../data/cpTable';
import type { CandyBag, OwnedPokemon, SpawnedPokemon } from '../types';

// Candy awarded per catch, matching the real game's base catch reward.
const CATCH_CANDY = 3;

export const useCollection = () => {
  const [owned, setOwned] = useState<OwnedPokemon[]>([]);
  const [candies, setCandies] = useState<CandyBag>({});

  const reload = useCallback(async () => {
    const [ownedList, candyBag] = await Promise.all([getOwnedPokemon(), getCandies()]);
    setOwned(ownedList);
    setCandies(candyBag);
  }, []);

  useEffect(() => {
    Promise.all([getOwnedPokemon(), getCandies()]).then(([ownedList, candyBag]) => {
      setOwned(ownedList);
      setCandies(candyBag);
    });
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

      const [ownedList, candyBag] = await Promise.all([
        addOwnedPokemon(newPokemon),
        addCandy(spawn.species.family, CATCH_CANDY),
      ]);
      setOwned(ownedList);
      setCandies(candyBag);

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
      const [ownedList, candyBag] = await Promise.all([
        updateOwnedPokemon(uid, { speciesId: toSpeciesId, cp: newCp }),
        spendCandy(family, candyCost),
      ]);
      setOwned(ownedList);
      setCandies(candyBag);
      return true;
    },
    [owned, candies],
  );

  return { owned, candies, catchPokemon, evolve, reload };
};
