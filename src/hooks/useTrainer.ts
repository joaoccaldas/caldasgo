import { useState, useEffect, useCallback } from 'react';
import { getTrainerXp, addTrainerXp } from '../services/storage';
import { xpProgress } from '../data/cpTable';

export const useTrainer = () => {
  const [xp, setXp] = useState(0);

  useEffect(() => {
    getTrainerXp().then(setXp);
  }, []);

  const gainXp = useCallback(async (amount: number) => {
    const next = await addTrainerXp(amount);
    setXp(next);
    return next;
  }, []);

  const { level, current, next, progress } = xpProgress(xp);

  return { xp, level, xpForCurrentLevel: current, xpForNextLevel: next, progress, gainXp };
};
