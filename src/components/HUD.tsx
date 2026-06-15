import React from 'react';
import { motion } from 'framer-motion';
import PokemonSprite from './PokemonSprite';

interface HUDProps {
  onOpenMenu: () => void;
  playerLevel: number;
  xpProgress: number; // 0-1 progress toward next level
}

const HUD: React.FC<HUDProps> = ({ onOpenMenu, playerLevel, xpProgress }) => {
  return (
    <>
      {/* Top Left: Avatar Profile with circular Level Ring (authentic PoGo) */}
      <div className="absolute top-12 left-4 z-[400] flex flex-col items-center pointer-events-auto">
        <div className="relative w-[72px] h-[72px]">
          {/* Circular XP progress ring */}
          <svg className="absolute inset-0 w-full h-full -rotate-90" viewBox="0 0 72 72">
            {/* Track */}
            <circle cx="36" cy="36" r="33" fill="none" stroke="rgba(15,23,42,0.55)" strokeWidth="5" />
            {/* Progress */}
            <circle
              cx="36"
              cy="36"
              r="33"
              fill="none"
              stroke="#fcd34d"
              strokeWidth="5"
              strokeLinecap="round"
              strokeDasharray={2 * Math.PI * 33}
              strokeDashoffset={2 * Math.PI * 33 * (1 - Math.min(1, Math.max(0, xpProgress)))}
              style={{ filter: 'drop-shadow(0 0 3px rgba(252,211,77,0.8))', transition: 'stroke-dashoffset 0.4s ease' }}
            />
          </svg>
          {/* Avatar Image (Pikachu placeholder for trainer face) */}
          <div className="absolute inset-[6px] rounded-full border-2 border-white shadow-[0_2px_10px_rgba(0,0,0,0.5)] overflow-hidden bg-slate-800">
            <img
              src="https://cdn.jsdelivr.net/gh/PokeAPI/sprites@master/sprites/pokemon/other/official-artwork/25.png"
              alt="Avatar"
              className="w-[120%] h-[120%] object-cover -ml-1 -mt-1"
              onError={(e) => { e.currentTarget.src = 'https://cdn.jsdelivr.net/gh/PokeAPI/sprites@master/sprites/pokemon/25.png'; }}
            />
          </div>
          {/* Level Badge */}
          <div className="absolute -bottom-1.5 left-1/2 -translate-x-1/2 bg-[#3b82f6] text-white text-[11px] font-black px-2.5 py-[1px] rounded-full border border-white shadow-md z-10 whitespace-nowrap tracking-wide">
            {playerLevel}
          </div>
        </div>
      </div>

      {/* Top Right: Weather boost badge (authentic PoGo) */}
      <div className="absolute top-12 right-4 z-[400] flex flex-col gap-3 pointer-events-auto items-end">
        {/* Weather */}
        <div className="w-12 h-12 bg-white/30 backdrop-blur rounded-full shadow-[0_2px_8px_rgba(0,0,0,0.4)] flex items-center justify-center border border-white/50 cursor-pointer hover:bg-white/40 transition-colors overflow-hidden">
          <img
            src="https://cdn.jsdelivr.net/gh/PokeMiners/pogo_assets@master/Images/Weather/weatherIcon_large_clearDay.png"
            alt="Clear weather"
            className="w-[85%] h-[85%] object-contain"
          />
        </div>
      </div>

      {/* Bottom HUD: Buddy, Pokeball, Radar */}
      <div className="absolute bottom-8 left-0 w-full px-5 flex justify-between items-end z-[400] pointer-events-none">
        
        {/* Bottom Left: Buddy & Quests */}
        <div className="flex gap-3 pointer-events-auto">
          <div className="relative">
            <div className="w-16 h-16 rounded-full border-2 border-white shadow-[0_4px_12px_rgba(0,0,0,0.4)] bg-[#a3e635] flex items-center justify-center overflow-hidden">
               <PokemonSprite id={1} name="Buddy" className="w-[110%] h-[110%] object-contain" />
            </div>
            {/* Buddy Mood */}
            <div className="absolute -top-1 -right-1 w-6 h-6 bg-white rounded-full flex items-center justify-center shadow border border-slate-200">
               <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="#ef4444" stroke="#ef4444" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>
            </div>
          </div>
          <div className="flex flex-col justify-end gap-2 pb-1">
             <div className="w-12 h-12 rounded-full bg-white/95 backdrop-blur border border-slate-200 shadow-lg flex items-center justify-center text-slate-700 hover:bg-slate-50 cursor-pointer">
                <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M2 12h5"/><path d="M17 12h5"/><path d="M12 2v5"/><path d="M12 17v5"/><rect width="18" height="18" x="3" y="3" rx="2"/><circle cx="12" cy="12" r="3"/></svg>
             </div>
          </div>
        </div>

        {/* Center: The Pokeball Main Menu Button */}
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={onOpenMenu}
          className="w-[84px] h-[84px] relative flex items-center justify-center pointer-events-auto transform translate-y-2"
        >
           <img 
             src="https://cdn.jsdelivr.net/gh/PokeMiners/pogo_assets@master/Images/Menu%20Icons/btn_action_menu.png" 
             alt="Main Menu" 
             className="w-full h-full object-contain drop-shadow-xl"
             onError={(e) => { e.currentTarget.src = "https://cdn.jsdelivr.net/gh/PokeAPI/sprites@master/sprites/items/poke-ball.png" }}
           />
        </motion.button>

        {/* Bottom Right: Nearby Radar */}
        <div className="pointer-events-auto mb-1">
          <div className="bg-white/95 backdrop-blur rounded-lg shadow-lg border border-slate-200 pl-3 pr-2 py-1.5 flex items-center gap-1 cursor-pointer hover:bg-white transition-colors relative overflow-hidden">
             <div className="w-7 h-7 opacity-80"><PokemonSprite id={1} name="nearby" className="w-full h-full object-contain" /></div>
             <div className="w-7 h-7 opacity-80"><PokemonSprite id={4} name="nearby" className="w-full h-full object-contain" /></div>
             <div className="w-7 h-7 opacity-80"><PokemonSprite id={7} name="nearby" className="w-full h-full object-contain" /></div>
             
             {/* Tiny green radar sweep effect overlay */}
             <div className="absolute inset-0 bg-gradient-to-r from-transparent via-[#a3e635]/20 to-transparent w-[200%] animate-[slide_3s_infinite]" />
          </div>
        </div>
        
      </div>
    </>
  );
};

export default HUD;
