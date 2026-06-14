import React from 'react';
import { motion } from 'framer-motion';

interface HUDProps {
  onOpenMenu: () => void;
  playerLevel: number;
}

const HUD: React.FC<HUDProps> = ({ onOpenMenu, playerLevel }) => {
  return (
    <>
      {/* Top Right HUD: Compass & Weather */}
      <div className="absolute top-12 right-4 z-[400] flex flex-col gap-4 pointer-events-auto">
        <div className="w-12 h-12 bg-white/90 rounded-full shadow-lg flex items-center justify-center border-2 border-slate-200">
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#ef4444" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ transform: 'rotate(45deg)' }}><path d="m16.24 7.76-1.804 5.411a2 2 0 0 1-1.265 1.265L7.76 16.24l1.804-5.411a2 2 0 0 1 1.265-1.265z"/><circle cx="12" cy="12" r="10"/></svg>
        </div>
        <div className="w-12 h-12 bg-white/90 rounded-full shadow-lg flex items-center justify-center border-2 border-slate-200">
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#eab308" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="4"/><path d="M12 2v2"/><path d="M12 20v2"/><path d="m4.93 4.93 1.41 1.41"/><path d="m17.66 17.66 1.41 1.41"/><path d="M2 12h2"/><path d="M20 12h2"/><path d="m6.34 17.66-1.41 1.41"/><path d="m19.07 4.93-1.41 1.41"/></svg>
        </div>
      </div>

      {/* Bottom HUD Elements */}
      <div className="absolute bottom-6 left-0 w-full px-4 flex justify-between items-end z-[400] pointer-events-auto">
        
        {/* Player Avatar */}
        <div className="flex flex-col items-center">
          <div className="w-16 h-16 rounded-full bg-slate-800 border-4 border-white shadow-xl overflow-hidden relative">
            <img src="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/25.png" alt="Avatar Buddy" className="w-full h-full object-contain absolute bottom-[-10px] right-[-10px] opacity-80" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
          </div>
          <div className="bg-white px-3 py-0.5 rounded-full text-xs font-black shadow-md mt-[-10px] z-10 border border-slate-200 text-slate-800">
            {playerLevel}
          </div>
        </div>

        {/* Center Pokeball Button */}
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={onOpenMenu}
          className="w-20 h-20 bg-red-500 rounded-full border-4 border-slate-800 shadow-[0_0_20px_rgba(0,0,0,0.5)] relative overflow-hidden flex items-center justify-center mb-2"
        >
          <div className="w-full h-1/2 bg-white absolute bottom-0 border-t-4 border-slate-800" />
          <div className="w-8 h-8 bg-white rounded-full absolute border-4 border-slate-800 flex items-center justify-center shadow-inner">
             <div className="w-4 h-4 bg-white rounded-full border border-slate-300 shadow-inner" />
          </div>
        </motion.button>

        {/* Nearby Radar */}
        <div className="bg-white/90 rounded-lg shadow-lg border border-slate-200 px-3 py-2 flex items-center gap-2 mb-2 cursor-pointer hover:bg-white transition-colors">
           <div className="w-6 h-6 opacity-50 grayscale"><img src="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/1.png" alt="nearby" /></div>
           <div className="w-6 h-6 opacity-50 grayscale"><img src="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/4.png" alt="nearby" /></div>
           <div className="w-6 h-6 opacity-50 grayscale"><img src="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/7.png" alt="nearby" /></div>
        </div>
      </div>
    </>
  );
};

export default HUD;
