import { useState, useMemo, useEffect } from 'react';
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
  const [message, setMessage] = useState('');
  const [isCaught, setIsCaught] = useState(false);
  const [berryActive, setBerryActive] = useState(false);
  const cp = useMemo(() => Math.floor(Math.random() * 2000) + 500, []);
  
  // Catch Ring State
  const [ringScale, setRingScale] = useState(1);
  useEffect(() => {
    if (catching || isCaught) return;
    const interval = setInterval(() => {
      setRingScale(prev => (prev <= 0.3 ? 1 : prev - 0.05));
    }, 100);
    return () => clearInterval(interval);
  }, [catching, isCaught]);

  const handleUseBerry = async () => {
    if (berryActive || catching) return;
    const success = await consumeItem('razzBerries', 1);
    if (success) {
      setBerryActive(true);
      setMessage(`Razz Berry fed!`);
      setTimeout(() => setMessage(''), 2000);
    }
  };

  const handleCatch = async () => {
    if (catching || isCaught) return;
    
    const consumed = await consumeItem('pokeballs', 1);
    if (!consumed) {
      setMessage(`Out of Pokéballs!`);
      setTimeout(() => setMessage(''), 2000);
      return;
    }

    setCatching(true);
    setMessage('');

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
      setMessage(`Oh no! The Pokémon broke free!`);
      setTimeout(() => setMessage(''), 2000);
      setCatching(false);
      setBerryActive(false); 
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="absolute inset-0 z-[800] overflow-hidden bg-sky-100 flex flex-col"
    >
      {/* 1:1 Authentic Encounter Background Image */}
      <div 
        className="absolute inset-0 w-full h-full bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: 'url(/caldasgo/pogo_encounter_bg.png)' }}
      />

      {/* Top HUD: Exact Placement */}
      <div className="relative w-full flex justify-between items-start p-5 pt-12 z-10 pointer-events-auto">
        {/* Run Button (Top Left) */}
        <button 
          onClick={onClose}
          className="w-10 h-10 bg-slate-800/50 backdrop-blur rounded-full flex items-center justify-center text-white border border-white/30 shadow-sm"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M13 14h-3"/><path d="M13 10h-3"/><path d="M10 14v4"/><path d="M10 10V6"/><path d="M14 6h3a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2h-3"/><path d="M6 10h2"/><path d="M6 14h2"/></svg>
        </button>

        {/* AR Toggle (Top Right) */}
        <div className="flex gap-2">
           <div className="h-8 px-3 bg-slate-800/50 backdrop-blur rounded-full flex items-center text-white text-xs font-bold border border-white/30 shadow-sm">
             AR
           </div>
        </div>
      </div>

      {/* Center Action */}
      <div className="flex-1 flex flex-col items-center justify-center w-full relative z-10 -mt-10">
        
        {/* CP Arch */}
        {!isCaught && (
          <div className="absolute top-0 flex flex-col items-center">
            <svg width="240" height="120" viewBox="0 0 240 120" className="absolute top-0 opacity-60">
               <path d="M 20 120 A 100 100 0 0 1 220 120" fill="none" stroke="white" strokeWidth="3" />
               {/* Center Dot */}
               <circle cx="120" cy="20" r="4" fill="white" />
            </svg>
            <div className="bg-slate-800/60 backdrop-blur px-5 py-1 rounded-full border border-slate-500/50 shadow-md mt-6">
              <span className="text-white font-black tracking-wider text-xl drop-shadow-md">
                CP {cp}
              </span>
            </div>
          </div>
        )}

        <AnimatePresence>
          {!isCaught && (
            <motion.div
              key="pokemon"
              initial={{ scale: 0.5, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0, opacity: 0 }}
              className="relative w-64 h-64 flex items-center justify-center mt-12"
            >
              {/* Fake Ground Shadow */}
              <div className="absolute bottom-2 w-40 h-10 bg-black/30 rounded-[100%] blur-md"></div>
              
              <motion.img 
                animate={{ translateY: [-10, 10] }}
                transition={{ repeat: Infinity, duration: 2, repeatType: "mirror", ease: "easeInOut" }}
                src={spawn.pokemonData.image} 
                alt={spawn.pokemonData.name}
                className="w-[120%] h-[120%] object-contain drop-shadow-2xl z-10"
              />

              {/* The Catch Ring! */}
              {!catching && (
                 <div className="absolute w-[80%] h-[80%] flex items-center justify-center z-20 pointer-events-none">
                    {/* Outer White Ring */}
                    <div className="absolute w-full h-full rounded-full border-4 border-white/60" />
                    {/* Inner Colored Shrinking Ring */}
                    <div 
                      className="absolute rounded-full border-4 border-green-500/80" 
                      style={{ 
                        width: `${ringScale * 100}%`, 
                        height: `${ringScale * 100}%`,
                        borderColor: ringScale < 0.5 ? '#ef4444' : ringScale < 0.8 ? '#eab308' : '#22c55e'
                      }} 
                    />
                 </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>

        {catching && (
          <motion.div 
            initial={{ y: 200, scale: 0 }}
            animate={{ y: isCaught ? 0 : [0, -50, 0], scale: 1, rotate: isCaught ? [0, 10, -10, 0] : 0 }}
            transition={{ duration: 0.5 }}
            className={`w-20 h-20 rounded-full bg-[#ef4444] border-[4px] border-slate-800 shadow-[0_10px_30px_rgba(0,0,0,0.8)] absolute flex items-center justify-center overflow-hidden ${isCaught ? 'bg-red-600' : ''}`}
          >
            <div className="w-full h-1/2 bg-white absolute bottom-0 border-t-[4px] border-slate-800" />
            <div className="w-7 h-7 bg-white rounded-full absolute border-[4px] border-slate-800 flex items-center justify-center">
                <div className={`w-3 h-3 rounded-full ${isCaught ? 'bg-red-500 animate-pulse' : 'bg-white border border-slate-300 shadow-inner'}`} />
            </div>
            <div className="absolute top-1 right-2 w-4 h-2 bg-white/30 rounded-full rotate-45" />
          </motion.div>
        )}
      </div>

      {/* Message Box */}
      {message && (
        <div className="absolute bottom-[140px] w-full px-12 z-20 pointer-events-none">
          <div className="bg-[#1e293b]/90 rounded-full py-2 px-4 shadow-xl border border-slate-600/50 text-center">
            <p className="text-sm font-bold text-white tracking-wide">{message}</p>
          </div>
        </div>
      )}

      {/* Bottom Controls: Exact Placement */}
      <div className="absolute bottom-0 w-full h-[140px] z-10 pointer-events-none">
        {!isCaught && (
          <>
            {/* Berry Button (Bottom Left) */}
            <div className="absolute left-6 bottom-8 pointer-events-auto flex flex-col items-center">
              <button 
                onClick={handleUseBerry}
                disabled={catching || berryActive || inventory.razzBerries === 0}
                className={`w-14 h-14 rounded-full flex flex-col items-center justify-center transition-all ${
                  catching || berryActive || inventory.razzBerries === 0
                    ? 'bg-slate-600/50 grayscale opacity-50'
                    : 'bg-white/90 shadow-[0_4px_15px_rgba(0,0,0,0.3)] border-2 border-slate-200 hover:scale-105 active:scale-95 backdrop-blur'
                }`}
              >
                <div className="relative">
                   <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="#ec4899" stroke="#be185d" strokeWidth="1" className="w-8 h-8"><path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>
                   <div className="absolute -top-1 -right-2 bg-slate-800 text-white text-[10px] font-bold px-1.5 rounded-full border border-slate-500">{inventory.razzBerries}</div>
                </div>
              </button>
            </div>

            {/* Throw Pokeball (Bottom Center) */}
            <div className="absolute left-1/2 -translate-x-1/2 bottom-8 pointer-events-auto flex flex-col items-center">
              <motion.button 
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleCatch}
                disabled={catching}
                className={`w-24 h-24 rounded-full shadow-[0_10px_30px_rgba(0,0,0,0.5)] relative overflow-hidden flex items-center justify-center ${catching ? 'opacity-50 cursor-not-allowed' : 'bg-[#ef4444] border-[4px] border-slate-800'}`}
              >
                {!catching && (
                  <>
                    <div className="w-full h-1/2 bg-white absolute bottom-0 border-t-[4px] border-slate-800" />
                    <div className="w-9 h-9 bg-white rounded-full absolute border-[4px] border-slate-800 flex items-center justify-center shadow-inner">
                       <div className="w-4 h-4 bg-white rounded-full border-2 border-slate-300 shadow-inner" />
                    </div>
                    <div className="absolute top-1 right-2 w-5 h-2.5 bg-white/30 rounded-full rotate-45" />
                  </>
                )}
              </motion.button>
              <div className="mt-1 bg-slate-800/80 px-3 py-0.5 rounded-full text-white text-[10px] font-bold tracking-widest border border-slate-600">
                {inventory.pokeballs}
              </div>
            </div>

            {/* Camera Button (Bottom Right) */}
            <div className="absolute right-6 bottom-8 pointer-events-auto">
              <div className="w-14 h-14 rounded-full bg-white/90 backdrop-blur shadow-[0_4px_15px_rgba(0,0,0,0.3)] border-2 border-slate-200 flex items-center justify-center text-slate-700 opacity-90 cursor-pointer hover:bg-white">
                 <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M14.5 4h-5L7 7H4a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2h-3l-2.5-3z"/><circle cx="12" cy="13" r="3"/></svg>
              </div>
            </div>
          </>
        )}
      </div>
    </motion.div>
  );
};

export default EncounterScreen;
