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

const ITEM_SPRITE_BASE = 'https://cdn.jsdelivr.net/gh/PokeAPI/sprites@master/sprites/items/';

const PokestopScreen: React.FC<PokestopScreenProps> = ({ pokestop, isSpinable, onClose, onSpin }) => {
  const [spinning, setSpinning] = useState(false);
  const [rewards, setRewards] = useState<{ pokeballs: number; razzBerries: number; xp: number } | null>(null);
  const { addItems } = useInventory();

  const handleSpin = async () => {
    if (!isSpinable || spinning || rewards) return;
    setSpinning(true);

    // Give random rewards
    const newPokeballs = Math.floor(Math.random() * 4) + 1; // 1 to 4
    const newBerries = Math.floor(Math.random() * 2); // 0 or 1
    const xp = 50;

    // Simulate spin time
    await new Promise(r => setTimeout(r, 1200));

    setSpinning(false);
    setRewards({ pokeballs: newPokeballs, razzBerries: newBerries, xp });

    // Add to inventory
    await addItems({ pokeballs: newPokeballs, razzBerries: newBerries });
    onSpin(pokestop.id);

    // Close after a delay
    setTimeout(() => {
      onClose();
    }, 2500);
  };

  const canSpin = isSpinable && !spinning && !rewards;

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
        <button className="bg-slate-800 p-2 rounded-full text-slate-300 hover:text-white hover:bg-slate-700 transition-colors">
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor"><circle cx="5" cy="12" r="2"/><circle cx="12" cy="12" r="2"/><circle cx="19" cy="12" r="2"/></svg>
        </button>
      </div>

      <div className="flex-1 flex flex-col items-center justify-center w-full relative gap-5">
        {/* Photo Disc */}
        <motion.div
          drag={canSpin ? 'x' : false}
          dragSnapToOrigin
          dragElastic={0.6}
          onDragEnd={(_e, info) => {
            if (Math.abs(info.offset.x) > 60 || Math.abs(info.velocity.x) > 400) handleSpin();
          }}
          animate={spinning ? { rotate: 1080 } : { rotate: 0 }}
          transition={{ duration: 1.2, ease: 'easeOut' }}
          onClick={handleSpin}
          className={`relative w-56 h-56 rounded-full flex items-center justify-center ${canSpin ? 'cursor-grab active:cursor-grabbing' : ''} ${isSpinable ? 'shadow-[0_0_30px_rgba(56,189,248,0.6)]' : 'shadow-[0_0_30px_rgba(168,85,247,0.5)]'}`}
        >
          {/* Outer tick ring */}
          <svg className="absolute inset-0 w-full h-full" viewBox="0 0 200 200">
            <circle cx="100" cy="100" r="98" fill="none" stroke={isSpinable ? '#38bdf8' : '#a855f7'} strokeWidth="3" strokeDasharray="2 10" opacity="0.8" />
          </svg>
          {/* Landmark photo */}
          <div className={`w-44 h-44 rounded-full overflow-hidden border-[8px] ${isSpinable ? 'border-[#e2e8f0] border-b-[#94a3b8]' : 'border-[#e9d5ff] border-b-[#c084fc]'} shadow-[inset_0_4px_10px_rgba(0,0,0,0.5)] bg-slate-700 relative z-10`}>
            <img
              src={`https://picsum.photos/seed/${pokestop.photoSeed}/300/300`}
              alt={pokestop.name}
              className="w-full h-full object-cover"
              draggable={false}
            />
          </div>
          {/* Poké Ball disc badge */}
          <div className={`absolute -bottom-2 w-14 h-14 rounded-full bg-white border-[3px] ${isSpinable ? 'border-sky-300' : 'border-purple-300'} shadow-lg flex items-center justify-center`}>
            <img
              src={`${ITEM_SPRITE_BASE}poke-ball.png`}
              alt=""
              className="w-9 h-9 object-contain"
              draggable={false}
            />
          </div>
        </motion.div>

        {/* Name */}
        <div className="text-center px-6">
          <h2 className="text-white font-black text-xl tracking-wide drop-shadow">{pokestop.name}</h2>
        </div>

        {/* Rewards Popups */}
        <AnimatePresence>
          {rewards && (
            <div className="absolute inset-0 pointer-events-none flex items-center justify-center z-50">
              {rewards.pokeballs > 0 && Array.from({ length: rewards.pokeballs }).map((_, i) => (
                <motion.div
                  key={`pb-${i}`}
                  initial={{ opacity: 0, scale: 0, x: 0, y: 0 }}
                  animate={{ opacity: [0, 1, 1, 0], scale: [0, 1.2, 1, 0.8], x: (Math.random() - 0.5) * 180, y: -120 - Math.random() * 100 }}
                  transition={{ duration: 1.6, delay: i * 0.15, ease: "easeOut" }}
                  className="absolute w-16 h-16 rounded-full bg-pink-400/90 border-2 border-white shadow-xl flex items-center justify-center backdrop-blur-sm"
                >
                  <img src={`${ITEM_SPRITE_BASE}poke-ball.png`} alt="" className="w-12 h-12 object-contain drop-shadow-md" />
                </motion.div>
              ))}
              {rewards.razzBerries > 0 && Array.from({ length: rewards.razzBerries }).map((_, i) => (
                <motion.div
                  key={`rb-${i}`}
                  initial={{ opacity: 0, scale: 0, x: 0, y: 0 }}
                  animate={{ opacity: [0, 1, 1, 0], scale: [0, 1.2, 1, 0.8], x: (Math.random() - 0.5) * 180, y: -120 - Math.random() * 100 }}
                  transition={{ duration: 1.6, delay: (rewards.pokeballs + i) * 0.15, ease: "easeOut" }}
                  className="absolute w-16 h-16 rounded-full bg-yellow-400/90 border-2 border-white shadow-xl flex items-center justify-center backdrop-blur-sm"
                >
                  <img src={`${ITEM_SPRITE_BASE}razz-berry.png`} alt="" className="w-12 h-12 object-contain drop-shadow-md" />
                </motion.div>
              ))}
              <motion.div
                 initial={{ opacity: 0, scale: 0, y: 0 }}
                 animate={{ opacity: [0, 1, 1, 0], scale: [0, 1.2, 1, 0.8], y: -220 }}
                 transition={{ duration: 1.6, delay: (rewards.pokeballs + rewards.razzBerries) * 0.15, ease: "easeOut" }}
                 className="absolute px-5 py-2 rounded-full bg-white border-2 border-sky-400 shadow-xl font-display font-black text-sky-500 text-xl"
              >
                 +{rewards.xp} XP
              </motion.div>
            </div>
          )}
        </AnimatePresence>
      </div>

      <div className="w-full max-w-sm mb-12">
        <div className="bg-slate-800 rounded-2xl p-4 shadow-xl border border-slate-700 mb-6 text-center">
          <p className="text-lg font-medium text-white">
            {isSpinable ? (spinning ? 'Spinning...' : 'Drag to spin!') : 'This PokéStop is out of items. Try again later.'}
          </p>
        </div>
      </div>
    </motion.div>
  );
};

export default PokestopScreen;
