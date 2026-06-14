import React from 'react';
import { motion } from 'framer-motion';
import { Book, Backpack, Settings, X } from 'lucide-react';

interface MainMenuProps {
  onClose: () => void;
  onOpenPokedex: () => void;
  onOpenInventory: () => void;
}

const MainMenu: React.FC<MainMenuProps> = ({ onClose, onOpenPokedex, onOpenInventory }) => {
  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="absolute inset-0 z-[600] bg-white/90 backdrop-blur-md flex flex-col justify-end pb-12"
    >
      <div className="flex-1 flex flex-col items-center justify-center gap-12">
        {/* Top Row: Settings */}
        <motion.button 
          initial={{ y: 50, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.1 }}
          className="flex flex-col items-center gap-2"
        >
          <div className="w-16 h-16 rounded-full bg-slate-800 text-white flex items-center justify-center shadow-[0_0_15px_rgba(0,0,0,0.2)] border-2 border-slate-700">
             <Settings size={32} />
          </div>
          <span className="text-slate-800 font-bold tracking-wide">SETTINGS</span>
        </motion.button>

        {/* Middle Row: Pokedex & Items */}
        <div className="flex w-full justify-around px-8">
          <motion.button 
            initial={{ x: -50, opacity: 0 }} animate={{ x: 0, opacity: 1 }} transition={{ delay: 0.2 }}
            onClick={() => { onClose(); onOpenPokedex(); }}
            className="flex flex-col items-center gap-2"
          >
            <div className="w-20 h-20 rounded-full bg-red-500 text-white flex items-center justify-center shadow-[0_0_20px_rgba(239,68,68,0.5)] border-4 border-red-600">
               <Book size={40} />
            </div>
            <span className="text-slate-800 font-bold tracking-wide">POKÉDEX</span>
          </motion.button>

          <motion.button 
            initial={{ x: 50, opacity: 0 }} animate={{ x: 0, opacity: 1 }} transition={{ delay: 0.2 }}
            onClick={() => { onClose(); onOpenInventory(); }}
            className="flex flex-col items-center gap-2"
          >
            <div className="w-20 h-20 rounded-full bg-blue-500 text-white flex items-center justify-center shadow-[0_0_20px_rgba(59,130,246,0.5)] border-4 border-blue-600">
               <Backpack size={40} />
            </div>
            <span className="text-slate-800 font-bold tracking-wide">ITEMS</span>
          </motion.button>
        </div>
      </div>

      {/* Bottom Close Button */}
      <div className="w-full flex justify-center mt-12 mb-8">
        <motion.button
          whileTap={{ scale: 0.9 }}
          onClick={onClose}
          className="w-16 h-16 rounded-full bg-white border-4 border-emerald-500 shadow-lg flex items-center justify-center text-emerald-500"
        >
          <X size={40} strokeWidth={3} />
        </motion.button>
      </div>
    </motion.div>
  );
};

export default MainMenu;
