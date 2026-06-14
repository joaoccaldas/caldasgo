import React from 'react';
import { motion } from 'framer-motion';
import { Settings, Newspaper } from 'lucide-react';

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
      <div 
        className="absolute inset-0 backdrop-blur-sm" 
        style={{ background: 'linear-gradient(to top, rgba(1, 41, 57, 0.95) 0%, rgba(1, 41, 57, 0.85) 50%, rgba(255, 255, 255, 0.5) 100%)' }}
      />

      <div className="relative z-10 flex-1 flex flex-col items-center justify-end pb-32">
        
        {/* Top Row: News & Settings */}
        <div className="absolute top-12 w-full px-6 flex justify-between">
          <motion.button initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: 0.1 }} className="flex flex-col items-center gap-1">
            <div className="w-14 h-14 rounded-full bg-[#f97316] text-white flex items-center justify-center shadow-lg border-[3px] border-white">
               <Newspaper size={24} />
            </div>
            <span className="text-white font-bold text-xs tracking-wide drop-shadow-md">NEWS</span>
          </motion.button>

          <motion.button initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: 0.1 }} className="flex flex-col items-center gap-1">
            <div className="w-14 h-14 rounded-full bg-[#475569] text-white flex items-center justify-center shadow-lg border-[3px] border-white">
               <Settings size={24} />
            </div>
            <span className="text-white font-bold text-xs tracking-wide drop-shadow-md">SETTINGS</span>
          </motion.button>
        </div>

        {/* Main 5-Button Grid (Exact PoGo Layout) */}
        
        {/* Center: SHOP */}
        <div className="relative w-full h-[250px] flex items-center justify-center">
          
          <motion.button initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: 0.2 }} className="absolute z-20 flex flex-col items-center gap-1 -translate-y-12">
             <div className="w-20 h-20 rounded-full flex items-center justify-center shadow-[0_10px_25px_rgba(0,0,0,0.5)] border-[4px] border-white overflow-hidden bg-white">
                <img src="https://raw.githubusercontent.com/PokeMiners/pogo_assets/master/Images/Item/Bag_Upgrades_1.png" alt="Shop" className="w-[80%] h-[80%] object-contain" />
             </div>
             <span className="text-white font-black text-sm tracking-wide drop-shadow-md mt-1 font-sans">SHOP</span>
          </motion.button>

          {/* Left: POKEDEX */}
          <motion.button 
            initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: 0.25 }} 
            onClick={onOpenPokedex}
            className="absolute left-8 -translate-y-2 flex flex-col items-center gap-1"
          >
             <div className="w-16 h-16 rounded-full flex items-center justify-center shadow-[0_8px_20px_rgba(0,0,0,0.4)] border-[3px] border-white overflow-hidden bg-white">
                <img src="https://raw.githubusercontent.com/PokeMiners/pogo_assets/master/Images/Pokedex/pokedex_icon.png" alt="Pokedex" className="w-[70%] h-[70%] object-contain" onError={(e) => { e.currentTarget.src = "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/poke-radar.png" }} />
             </div>
             <span className="text-white font-black text-xs tracking-wide drop-shadow-md mt-1 font-sans">POKÉDEX</span>
          </motion.button>

          {/* Right: POKEMON */}
          <motion.button initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: 0.25 }} className="absolute right-8 -translate-y-2 flex flex-col items-center gap-1">
             <div className="w-16 h-16 rounded-full bg-white flex items-center justify-center shadow-[0_8px_20px_rgba(0,0,0,0.4)] border-[3px] border-white relative overflow-hidden">
                <img src="https://raw.githubusercontent.com/PokeMiners/pogo_assets/master/Images/Items/Item_0001.png" alt="Pokemon" className="w-[80%] h-[80%] object-contain drop-shadow-md" onError={(e) => { e.currentTarget.src = "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/poke-ball.png" }} />
             </div>
             <span className="text-white font-black text-xs tracking-wide drop-shadow-md mt-1 font-sans">POKÉMON</span>
          </motion.button>

          {/* Bottom Left: ITEMS */}
          <motion.button 
            initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: 0.3 }} 
            onClick={onOpenInventory}
            className="absolute left-16 translate-y-20 flex flex-col items-center gap-1"
          >
             <div className="w-16 h-16 rounded-full flex items-center justify-center shadow-[0_8px_20px_rgba(0,0,0,0.4)] border-[3px] border-white overflow-hidden bg-white">
                <img src="https://raw.githubusercontent.com/PokeMiners/pogo_assets/master/Images/Item/Bag_01.png" alt="Items" className="w-[75%] h-[75%] object-contain" onError={(e) => { e.currentTarget.src = "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/potion.png" }} />
             </div>
             <span className="text-white font-black text-xs tracking-wide drop-shadow-md mt-1 font-sans">ITEMS</span>
          </motion.button>

          {/* Bottom Right: BATTLE */}
          <motion.button initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: 0.3 }} className="absolute right-16 translate-y-20 flex flex-col items-center gap-1">
             <div className="w-16 h-16 rounded-full flex items-center justify-center shadow-[0_8px_20px_rgba(0,0,0,0.4)] border-[3px] border-white bg-white">
                <img src="https://raw.githubusercontent.com/PokeMiners/pogo_assets/master/Images/Combat/pvp_icon.png" alt="Battle" className="w-[80%] h-[80%] object-contain" onError={(e) => { e.currentTarget.src = "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/vs-seeker.png" }} />
             </div>
             <span className="text-white font-black text-xs tracking-wide drop-shadow-md mt-1 font-sans">BATTLE</span>
          </motion.button>
        </div>

      </div>

      {/* Bottom Close Button (Replacing the Pokeball) */}
      <div className="absolute bottom-10 left-1/2 -translate-x-1/2 z-20">
        <motion.button
          whileTap={{ scale: 0.9 }}
          onClick={onClose}
          className="w-[72px] h-[72px] flex items-center justify-center bg-transparent border-none"
        >
           <img 
             src="https://raw.githubusercontent.com/PokeMiners/pogo_assets/master/Images/Menu%20Icons/btn_close_normal.png" 
             alt="Close Menu" 
             className="w-full h-full object-contain drop-shadow-lg"
           />
        </motion.button>
      </div>
    </motion.div>
  );
};

export default MainMenu;
