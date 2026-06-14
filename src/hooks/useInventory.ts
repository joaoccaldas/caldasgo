import { useState, useEffect, useCallback } from 'react';
import { getInventory, updateInventory } from '../services/storage';
import type { Inventory } from '../types';

export const useInventory = () => {
  const [inventory, setInventory] = useState<Inventory>({ pokeballs: 0, razzBerries: 0 });

  const load = async () => {
    const inv = await getInventory();
    setInventory(inv);
  };

  useEffect(() => {
    load();
  }, []);

  const consumeItem = useCallback(async (item: keyof Inventory, amount: number = 1) => {
    if (inventory[item] < amount) return false;
    
    const newAmount = inventory[item] - amount;
    setInventory(prev => ({ ...prev, [item]: newAmount }));
    await updateInventory({ [item]: newAmount });
    return true;
  }, [inventory]);

  const addItems = useCallback(async (items: Partial<Inventory>) => {
    const newInv = { ...inventory };
    if (items.pokeballs) newInv.pokeballs += items.pokeballs;
    if (items.razzBerries) newInv.razzBerries += items.razzBerries;
    
    setInventory(newInv);
    await updateInventory(newInv);
  }, [inventory]);

  return { inventory, consumeItem, addItems, reloadInventory: load };
};
