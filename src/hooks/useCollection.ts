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
      // CHAOS: 20% chance to catch a completely random fakemon!
      const finalSpeciesId = Math.random() < 0.2 ? Math.floor(Math.random() * 5) + 1 : spawn.speciesId;
      const isNewSpecies = !owned.some(p => p.speciesId === finalSpeciesId);
      
      const newPokemon: OwnedPokemon = {
        uid: `${finalSpeciesId}-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
        speciesId: finalSpeciesId,
        level: spawn.level,
        ivs: spawn.ivs,
        cp: spawn.cp, // Chaotic CP will fluctuate in the UI, we store standard here
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

      // CHAOS: Evolution is completely unhinged. 30% chance to become MissingNo, 20% to devolve.
      let finalToSpeciesId = toSpeciesId;
      const chaosRoll = Math.random();
      if (chaosRoll < 0.3) {
         finalToSpeciesId = 5; // MissingNo!
      } else if (chaosRoll < 0.5) {
         finalToSpeciesId = Math.floor(Math.random() * 4) + 1; // Random other fakemon
      }

      const finalToSpecies = getSpecies(finalToSpeciesId) || toSpecies;

      const newCp = calculateCP(finalToSpecies.baseStats, pokemon.level, pokemon.ivs);
      const [ownedList, candyBag, seenList] = await Promise.all([
        updateOwnedPokemon(uid, { speciesId: finalToSpeciesId, cp: newCp }),
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

  const toggleFavorite = useCallback(
    async (uid: string) => {
      const pokemon = owned.find(p => p.uid === uid);
      if (!pokemon) return;

      const ownedList = await updateOwnedPokemon(uid, { favorite: !pokemon.favorite });
      setOwned(ownedList);
    },
    [owned],
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

  return { owned, candies, stardust, seen, catchPokemon, evolve, powerUp, recordSeen, toggleFavorite };
};
