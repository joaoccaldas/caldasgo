import React from 'react';
import { motion } from 'framer-motion';
import { Book, Backpack, Settings, ShieldAlert, Package, Newspaper, X } from 'lucide-react';

interface MainMenuProps {
  onClose: () => void;
  onOpenPokedex: () => void;
  onOpenInventory: () => void;
}

const MainMenu: React.FC<MainMenuProps> = ({ onClose, onOpenPokedex, onOpenInventory }) => {
  return (
    <motion.div 
      initial={{ opacity: 0, y: '100%' }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: '100%' }}
      transition={{ type: "spring", damping: 25, stiffness: 200 }}
      className="absolute inset-0 z-[600] flex flex-col justify-end"
    >
      {/* Exact Pokemon Go teal gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-teal-600/95 via-teal-500/80 to-white/90 backdrop-blur-md" />

      <div className="relative z-10 flex-1 flex flex-col items-center justify-end pb-32">
        
        {/* Top Row: News & Settings */}
        <div className="absolute top-12 w-full px-6 flex justify-between">
          <motion.button initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: 0.1 }} className="flex flex-col items-center gap-1">
            <div className="w-14 h-14 rounded-full bg-orange-500 text-white flex items-center justify-center shadow-lg border-2 border-orange-400">
               <Newspaper size={24} />
            </div>
            <span className="text-white font-bold text-xs tracking-wide drop-shadow-md">NEWS</span>
          </motion.button>

          <motion.button initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: 0.1 }} className="flex flex-col items-center gap-1">
            <div className="w-14 h-14 rounded-full bg-slate-700 text-white flex items-center justify-center shadow-lg border-2 border-slate-600">
               <Settings size={24} />
            </div>
            <span className="text-white font-bold text-xs tracking-wide drop-shadow-md">SETTINGS</span>
          </motion.button>
        </div>

        {/* Main 5-Button Grid (Exact PoGo Layout) */}
        
        {/* Center: SHOP */}
        <div className="relative w-full h-[250px] flex items-center justify-center">
          
          <motion.button initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: 0.2 }} className="absolute z-20 flex flex-col items-center gap-1 -translate-y-12">
             <div className="w-20 h-20 rounded-full bg-[#38bdf8] text-white flex items-center justify-center shadow-xl border-[3px] border-white">
                <Package size={36} />
             </div>
             <span className="text-white font-bold text-sm tracking-wide drop-shadow-md mt-1">SHOP</span>
          </motion.button>

          {/* Left: POKEDEX */}
          <motion.button 
            initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: 0.25 }} 
            onClick={onOpenPokedex}
            className="absolute left-8 -translate-y-2 flex flex-col items-center gap-1"
          >
             <div className="w-16 h-16 rounded-full bg-[#ef4444] text-white flex items-center justify-center shadow-xl border-2 border-white">
                <Book size={28} />
             </div>
             <span className="text-white font-bold text-xs tracking-wide drop-shadow-md mt-1">POKÉDEX</span>
          </motion.button>

          {/* Right: POKEMON */}
          <motion.button initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: 0.25 }} className="absolute right-8 -translate-y-2 flex flex-col items-center gap-1">
             <div className="w-16 h-16 rounded-full bg-[#ef4444] text-white flex items-center justify-center shadow-xl border-2 border-white relative overflow-hidden">
                <div className="absolute bottom-0 w-full h-1/2 bg-white" />
                <div className="absolute w-4 h-4 bg-white border-[2px] border-slate-800 rounded-full shadow-inner" />
             </div>
             <span className="text-white font-bold text-xs tracking-wide drop-shadow-md mt-1">POKÉMON</span>
          </motion.button>

          {/* Bottom Left: ITEMS */}
          <motion.button 
            initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: 0.3 }} 
            onClick={onOpenInventory}
            className="absolute left-16 translate-y-20 flex flex-col items-center gap-1"
          >
             <div className="w-16 h-16 rounded-full bg-[#3b82f6] text-white flex items-center justify-center shadow-xl border-2 border-white">
                <Backpack size={28} />
             </div>
             <span className="text-white font-bold text-xs tracking-wide drop-shadow-md mt-1">ITEMS</span>
          </motion.button>

          {/* Bottom Right: BATTLE */}
          <motion.button initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: 0.3 }} className="absolute right-16 translate-y-20 flex flex-col items-center gap-1">
             <div className="w-16 h-16 rounded-full bg-[#f97316] text-white flex items-center justify-center shadow-xl border-2 border-white">
                <ShieldAlert size={28} />
             </div>
             <span className="text-white font-bold text-xs tracking-wide drop-shadow-md mt-1">BATTLE</span>
          </motion.button>
        </div>

      </div>

      {/* Bottom Close Button (Replacing the Pokeball) */}
      <div className="absolute bottom-10 left-1/2 -translate-x-1/2 z-20">
        <motion.button
          whileTap={{ scale: 0.9 }}
          onClick={onClose}
          className="w-16 h-16 rounded-full bg-white border-[3px] border-white shadow-[0_4px_15px_rgba(0,0,0,0.3)] flex items-center justify-center text-[#10b981]"
        >
          <X size={44} strokeWidth={3} />
        </motion.button>
      </div>
    </motion.div>
  );
};

export default MainMenu;
