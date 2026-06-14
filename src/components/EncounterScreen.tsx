import { useState, useMemo } from 'react';
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
  const cp = useMemo(() => Math.floor(Math.random() * 2000) + 500, []);

  const handleUseBerry = async () => {
    if (berryActive || catching) return;
    const success = await consumeItem('razzBerries', 1);
    if (success) {
      setBerryActive(true);
      setMessage(`You fed a Razz Berry!`);
    } else {
      setMessage(`Not enough Razz Berries!`);
    }
  };

  const handleCatch = async () => {
    if (catching || isCaught) return;
    
    const consumed = await consumeItem('pokeballs', 1);
    if (!consumed) {
      setMessage(`Out of Pokéballs!`);
      return;
    }

    setCatching(true);
    setMessage('');

    // Simulate catch mechanic delay
    await new Promise(r => setTimeout(r, 1500));

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
      setMessage(`Oh no! It broke free!`);
      setCatching(false);
      setBerryActive(false); 
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="absolute inset-0 z-[800] overflow-hidden bg-sky-200 flex flex-col"
    >
      {/* Grassy Background */}
      <div className="absolute bottom-0 w-full h-1/2 bg-gradient-to-t from-emerald-600 to-emerald-400" style={{ borderTopLeftRadius: '50% 10%', borderTopRightRadius: '50% 10%' }}></div>
      <div className="absolute bottom-0 w-full h-24 bg-gradient-to-t from-black/50 to-transparent"></div>

      {/* Top HUD */}
      <div className="relative w-full flex justify-between items-start p-6 pt-12 z-10">
        <button 
          onClick={onClose}
          className="w-10 h-10 bg-white/80 rounded-full flex items-center justify-center text-slate-800 shadow-md"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M13 14h-3"/><path d="M13 10h-3"/><path d="M10 14v4"/><path d="M10 10V6"/><path d="M14 6h3a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2h-3"/><path d="M6 10h2"/><path d="M6 14h2"/></svg>
        </button>

        {/* AR Toggle (Visual Only) */}
        <div className="w-16 h-8 bg-white/80 rounded-full flex items-center p-1 shadow-md">
          <div className="w-6 h-6 bg-white rounded-full shadow border border-slate-200 flex items-center justify-center text-[8px] font-bold">AR</div>
        </div>
      </div>

      {/* Center Action */}
      <div className="flex-1 flex flex-col items-center justify-center w-full relative z-10">
        
        {/* CP Arch */}
        {!isCaught && (
          <div className="absolute top-10 flex flex-col items-center">
            <svg width="200" height="100" viewBox="0 0 200 100" className="absolute top-0 opacity-50">
               <path d="M 20 100 A 80 80 0 0 1 180 100" fill="none" stroke="white" strokeWidth="4" />
            </svg>
            <div className="bg-slate-800/80 px-4 py-1 rounded-full border border-slate-600 shadow-md mt-4">
              <span className="text-white font-bold tracking-wider text-lg">
                CP {cp}
              </span>
            </div>
          </div>
        )}

        <AnimatePresence>
          {!isCaught && (
            <motion.div
              key="pokemon"
              initial={{ scale: 0.5, y: 50, opacity: 0 }}
              animate={{ 
                scale: 1, 
                y: 0, 
                opacity: 1,
                translateY: [-10, 10]
              }}
              exit={{ scale: 0, opacity: 0 }}
              transition={{ 
                translateY: { repeat: Infinity, duration: 2, repeatType: "mirror", ease: "easeInOut" },
                scale: { duration: 0.5, type: "spring" }
              }}
              className="relative w-64 h-64 flex items-center justify-center mt-12"
            >
              {berryActive && (
                <div className="absolute inset-0 rounded-full border-4 border-pink-500 shadow-[0_0_20px_rgba(236,72,153,0.5)] animate-pulse" />
              )}
              {/* Fake Ground Shadow */}
              <div className="absolute bottom-4 w-32 h-8 bg-black/20 rounded-[100%] blur-sm"></div>
              <img 
                src={spawn.pokemonData.image} 
                alt={spawn.pokemonData.name}
                className="w-full h-full object-contain drop-shadow-xl z-10"
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

      {/* Message Box */}
      {message && (
        <div className="absolute bottom-32 w-full px-8 z-10">
          <div className="bg-slate-800/90 rounded-full p-3 shadow-xl border border-slate-700 text-center">
            <p className="text-sm font-bold text-white">{message}</p>
          </div>
        </div>
      )}

      {/* Bottom Controls */}
      <div className="w-full h-32 relative z-10 flex items-center justify-between px-8 pb-8">
        {!isCaught && (
          <>
            {/* Berry Button */}
            <button 
              onClick={handleUseBerry}
              disabled={catching || berryActive || inventory.razzBerries === 0}
              className={`w-16 h-16 rounded-full flex flex-col items-center justify-center transition-all ${
                catching || berryActive || inventory.razzBerries === 0
                  ? 'bg-slate-600/50 grayscale'
                  : 'bg-white shadow-lg border-4 border-pink-100 hover:scale-105 active:scale-95'
              }`}
            >
              <div className="relative">
                 <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="#ec4899" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-8 h-8"><path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>
                 <div className="absolute -top-2 -right-4 bg-pink-500 text-white text-[10px] font-bold px-1.5 rounded-full">{inventory.razzBerries}</div>
              </div>
            </button>

            {/* Throw Pokeball */}
            <motion.button 
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={handleCatch}
              disabled={catching}
              className={`w-24 h-24 rounded-full shadow-2xl relative overflow-hidden flex items-center justify-center ${catching ? 'opacity-50 cursor-not-allowed' : 'bg-red-500 border-4 border-slate-800'}`}
            >
              {!catching && (
                <>
                  <div className="w-full h-1/2 bg-white absolute bottom-0 border-t-4 border-slate-800" />
                  <div className="w-8 h-8 bg-white rounded-full absolute border-4 border-slate-800 flex items-center justify-center shadow-inner">
                     <div className="w-4 h-4 bg-white rounded-full border border-slate-300 shadow-inner" />
                  </div>
                  <div className="absolute -top-2 -right-2 bg-slate-800 text-white text-[10px] font-bold px-2 py-1 rounded-full border border-slate-600 z-10">{inventory.pokeballs}</div>
                </>
              )}
            </motion.button>

            {/* Camera Button (Visual) */}
            <div className="w-16 h-16 rounded-full bg-white shadow-lg border-4 border-slate-100 flex items-center justify-center text-slate-600 opacity-80">
               <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14.5 4h-5L7 7H4a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2h-3l-2.5-3z"/><circle cx="12" cy="13" r="3"/></svg>
            </div>
          </>
        )}
      </div>
    </motion.div>
  );
};

export default EncounterScreen;
