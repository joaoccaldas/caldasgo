import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import type { Pokestop } from '../types';
import { useInventory } from '../hooks/useInventory';

interface PokestopScreenProps {
  pokestop: Pokestop;
  isSpinable: boolean;
  onClose: () => void;
  onSpin: (id: string) => void;
}

const PokestopScreen: React.FC<PokestopScreenProps> = ({ pokestop, isSpinable, onClose, onSpin }) => {
  const [spinning, setSpinning] = useState(false);
  const [rewards, setRewards] = useState<{ pokeballs: number; razzBerries: number } | null>(null);
  const { addItems } = useInventory();

  const handleSpin = async () => {
    if (!isSpinable || spinning || rewards) return;
    setSpinning(true);

    // Give random rewards
    const newPokeballs = Math.floor(Math.random() * 4) + 1; // 1 to 4
    const newBerries = Math.floor(Math.random() * 2); // 0 or 1
    
    // Simulate spin time
    await new Promise(r => setTimeout(r, 1000));
    
    setSpinning(false);
    setRewards({ pokeballs: newPokeballs, razzBerries: newBerries });
    
    // Add to inventory
    await addItems({ pokeballs: newPokeballs, razzBerries: newBerries });
    onSpin(pokestop.id);
    
    // Close after a delay
    setTimeout(() => {
      onClose();
    }, 2500);
  };

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="absolute inset-0 z-[500] bg-slate-900/90 flex flex-col items-center justify-between p-6 backdrop-blur-md"
    >
      <div className="w-full flex justify-between items-start mt-8">
        <button 
          onClick={onClose}
          className="bg-slate-800 p-2 rounded-full text-slate-300 hover:text-white hover:bg-slate-700 transition-colors"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
        </button>
        <div className="bg-slate-800/80 px-4 py-1 rounded-full border border-slate-600 shadow-md">
          <span className="text-blue-400 font-bold uppercase tracking-wider text-sm">
            PokéStop
          </span>
        </div>
      </div>

      <div className="flex-1 flex flex-col items-center justify-center w-full relative">
        <motion.div
          animate={spinning ? { rotate: 1080 } : {}}
          transition={{ duration: 1, ease: "easeOut" }}
          onClick={handleSpin}
          className={`w-48 h-48 rounded-full border-8 shadow-[0_0_30px_rgba(59,130,246,0.5)] flex items-center justify-center cursor-pointer transition-colors ${isSpinable ? 'border-blue-400 bg-blue-500' : 'border-purple-400 bg-purple-500'}`}
        >
          <div className={`w-32 h-32 rounded-full border-4 ${isSpinable ? 'border-blue-300' : 'border-purple-300'} flex items-center justify-center`}>
            <div className={`w-16 h-16 rounded-full ${isSpinable ? 'bg-blue-300' : 'bg-purple-300'}`}></div>
          </div>
        </motion.div>

        {/* Rewards Popups */}
        <AnimatePresence>
          {rewards && (
            <motion.div
              initial={{ y: 50, opacity: 0, scale: 0 }}
              animate={{ y: -50, opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              className="absolute top-1/4 flex gap-4"
            >
              {rewards.pokeballs > 0 && (
                <div className="bg-slate-800 border-2 border-red-500 rounded-full px-4 py-2 font-bold text-white shadow-xl flex items-center gap-2">
                  <div className="w-4 h-4 bg-red-500 rounded-full" /> +{rewards.pokeballs}
                </div>
              )}
              {rewards.razzBerries > 0 && (
                <div className="bg-slate-800 border-2 border-pink-500 rounded-full px-4 py-2 font-bold text-white shadow-xl flex items-center gap-2">
                   <div className="w-4 h-4 bg-pink-500 rounded-full" /> +{rewards.razzBerries}
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <div className="w-full max-w-sm mb-12">
        <div className="bg-slate-800 rounded-2xl p-4 shadow-xl border border-slate-700 mb-6 text-center">
          <p className="text-lg font-medium text-white">
            {isSpinable ? (spinning ? 'Spinning...' : 'Tap to spin!') : 'This PokéStop is out of items. Try again later.'}
          </p>
        </div>
      </div>
    </motion.div>
  );
};

export default PokestopScreen;
