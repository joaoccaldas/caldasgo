import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { SpawnedPokemon } from '../types';
import { saveToPokedex } from '../services/storage';

interface EncounterScreenProps {
  spawn: SpawnedPokemon;
  onClose: () => void;
  onCaught: () => void;
}

const EncounterScreen: React.FC<EncounterScreenProps> = ({ spawn, onClose, onCaught }) => {
  const [catching, setCatching] = useState(false);
  const [message, setMessage] = useState(`A wild ${spawn.pokemonData.name} appeared!`);
  const [isCaught, setIsCaught] = useState(false);

  const handleCatch = async () => {
    if (catching || isCaught) return;
    setCatching(true);
    setMessage('Throwing Pokeball...');

    // Simulate catch mechanic delay
    await new Promise(r => setTimeout(r, 1500));

    // 70% catch rate for fun
    const success = Math.random() < 0.7;

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
          <button 
            onClick={handleCatch}
            disabled={catching}
            className={`w-full py-4 rounded-full font-bold text-xl shadow-[0_0_15px_rgba(239,68,68,0.5)] transition-all ${
              catching 
                ? 'bg-slate-700 text-slate-400 cursor-not-allowed' 
                : 'bg-gradient-to-r from-red-500 to-red-600 text-white hover:from-red-400 hover:to-red-500 active:scale-95'
            }`}
          >
            {catching ? 'Catching...' : 'THROW POKEBALL'}
          </button>
        )}
      </div>
    </motion.div>
  );
};

export default EncounterScreen;
