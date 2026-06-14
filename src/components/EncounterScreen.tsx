import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import type { SpawnedPokemon } from '../types';
import { saveToPokedex } from '../services/storage';
import { useInventory } from '../hooks/useInventory';

interface EncounterScreenProps {
  spawn: SpawnedPokemon;
  onClose: () => void;
  onCaught: () => void;
}

const EncounterScreen: React.FC<EncounterScreenProps> = ({ spawn, onClose, onCaught }) => {
  const { inventory, consumeItem } = useInventory();
  const [catching, setCatching] = useState(false);
  const [message, setMessage] = useState(`A wild ${spawn.pokemonData.name} appeared!`);
  const [isCaught, setIsCaught] = useState(false);
  const [berryActive, setBerryActive] = useState(false);

  const handleUseBerry = async () => {
    if (berryActive || catching) return;
    const success = await consumeItem('razzBerries', 1);
    if (success) {
      setBerryActive(true);
      setMessage(`You fed a Razz Berry to ${spawn.pokemonData.name}! It's easier to catch!`);
    } else {
      setMessage(`Not enough Razz Berries!`);
    }
  };

  const handleCatch = async () => {
    if (catching || isCaught) return;
    
    const consumed = await consumeItem('pokeballs', 1);
    if (!consumed) {
      setMessage(`You're out of Pokéballs! Spin a PokéStop to get more.`);
      return;
    }

    setCatching(true);
    setMessage('Throwing Pokeball...');

    // Simulate catch mechanic delay
    await new Promise(r => setTimeout(r, 1500));

    // Base rate 50%, with berry 90%
    const catchRate = berryActive ? 0.9 : 0.5;
    const success = Math.random() < catchRate;

    if (success) {
      setMessage(`Gotcha! ${spawn.pokemonData.name} was caught!`);
      setIsCaught(true);
      await saveToPokedex(spawn.pokemonData);
      
      setTimeout(() => {
        onCaught();
      }, 2000);
    } else {
      setMessage(`Oh no! The Pokemon broke free!`);
      setCatching(false);
      setBerryActive(false); // Berry wears off after a throw
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="absolute inset-0 z-[500] bg-slate-900/95 flex flex-col items-center justify-between p-6 backdrop-blur-sm"
    >
      <div className="w-full flex justify-between items-start mt-8">
        <button 
          onClick={onClose}
          className="bg-slate-800 p-2 rounded-full text-slate-300 hover:text-white hover:bg-slate-700 transition-colors"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
        </button>
        <div className="bg-slate-800/80 px-4 py-1 rounded-full border border-slate-600 shadow-md">
          <span className="text-yellow-400 font-bold uppercase tracking-wider text-sm">
            CP {Math.floor(Math.random() * 2000) + 500}
          </span>
        </div>
      </div>

      <div className="flex-1 flex flex-col items-center justify-center w-full relative">
        <AnimatePresence>
          {!isCaught && (
            <motion.div
              key="pokemon"
              initial={{ scale: 0.5, y: 50, opacity: 0 }}
              animate={{ 
                scale: 1, 
                y: 0, 
                opacity: 1,
                // Gentle floating animation
                translateY: [-10, 10]
              }}
              exit={{ scale: 0, opacity: 0 }}
              transition={{ 
                translateY: { repeat: Infinity, duration: 2, repeatType: "mirror", ease: "easeInOut" },
                scale: { duration: 0.5, type: "spring" }
              }}
              className="relative w-64 h-64 flex items-center justify-center"
            >
              {berryActive && (
                <div className="absolute inset-0 rounded-full border-4 border-pink-500 shadow-[0_0_20px_rgba(236,72,153,0.5)] animate-pulse" />
              )}
              <img 
                src={spawn.pokemonData.image} 
                alt={spawn.pokemonData.name}
                className="w-full h-full object-contain drop-shadow-[0_10px_10px_rgba(0,0,0,0.5)]"
              />
            </motion.div>
          )}
        </AnimatePresence>

        {catching && (
          <motion.div 
            initial={{ y: 200, scale: 0 }}
            animate={{ y: isCaught ? 0 : [0, -50, 0], scale: 1, rotate: isCaught ? [0, 10, -10, 0] : 0 }}
            transition={{ duration: 0.5 }}
            className={`w-16 h-16 rounded-full bg-red-500 border-4 border-slate-800 shadow-xl absolute flex items-center justify-center overflow-hidden ${isCaught ? 'bg-red-600' : ''}`}
          >
            <div className="w-full h-1/2 bg-white absolute bottom-0 border-t-4 border-slate-800" />
            <div className="w-6 h-6 bg-white rounded-full absolute border-4 border-slate-800 flex items-center justify-center">
                <div className={`w-2 h-2 rounded-full ${isCaught ? 'bg-red-500 animate-pulse' : 'bg-slate-800'}`} />
            </div>
          </motion.div>
        )}
      </div>

      <div className="w-full max-w-sm mb-12">
        <div className="bg-slate-800 rounded-2xl p-4 shadow-xl border border-slate-700 mb-6 text-center">
          <p className="text-lg font-medium text-white">{message}</p>
        </div>

        {!isCaught && (
          <div className="flex gap-4">
            <button 
              onClick={handleUseBerry}
              disabled={catching || berryActive || inventory.razzBerries === 0}
              className={`flex-1 py-4 rounded-xl font-bold flex flex-col items-center transition-all ${
                catching || berryActive || inventory.razzBerries === 0
                  ? 'bg-slate-800 text-slate-500 border border-slate-700'
                  : 'bg-slate-700 text-pink-400 border border-pink-500/50 hover:bg-slate-600'
              }`}
            >
              <span className="text-xs text-slate-400 mb-1">x{inventory.razzBerries}</span>
              Berry
            </button>
            <button 
              onClick={handleCatch}
              disabled={catching}
              className={`flex-[2] py-4 rounded-xl font-bold text-xl shadow-[0_0_15px_rgba(239,68,68,0.5)] transition-all flex flex-col items-center ${
                catching 
                  ? 'bg-slate-700 text-slate-400 cursor-not-allowed' 
                  : 'bg-gradient-to-r from-red-500 to-red-600 text-white hover:from-red-400 hover:to-red-500 active:scale-95'
              }`}
            >
              <span className="text-xs text-red-200 mb-1 font-normal tracking-wide">x{inventory.pokeballs} Left</span>
              THROW
            </button>
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default EncounterScreen;
