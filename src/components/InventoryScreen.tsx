import React from 'react';
import { motion } from 'framer-motion';
import { useInventory } from '../hooks/useInventory';
import ScreenHeader from './ScreenHeader';

interface InventoryScreenProps {
  onClose: () => void;
}

const InventoryScreen: React.FC<InventoryScreenProps> = ({ onClose }) => {
  const { inventory } = useInventory();

  // Fake some other items to make the inventory look full and authentic
  const allItems = [
    { id: 1, name: 'Potion', count: 12, image: 'https://cdn.jsdelivr.net/gh/PokeAPI/sprites@master/sprites/items/potion.png', desc: 'A spray-type medicine for treating wounds. It can be used to restore 20 HP to a single Pokémon.' },
    { id: 2, name: 'Super Potion', count: 5, image: 'https://cdn.jsdelivr.net/gh/PokeAPI/sprites@master/sprites/items/super-potion.png', desc: 'A spray-type medicine for treating wounds. It can be used to restore 50 HP to a single Pokémon.' },
    { id: 3, name: 'Revive', count: 3, image: 'https://cdn.jsdelivr.net/gh/PokeAPI/sprites@master/sprites/items/revive.png', desc: 'A medicine that can revive fainted Pokémon. It also restores half of a fainted Pokémon\'s maximum HP.' },
    { id: 4, name: 'Poké Ball', count: inventory.pokeballs, image: 'https://cdn.jsdelivr.net/gh/PokeAPI/sprites@master/sprites/items/poke-ball.png', desc: 'A device for catching wild Pokémon. It\'s thrown like a ball at a Pokémon, comfortably encapsulating its target.' },
    { id: 5, name: 'Great Ball', count: 15, image: 'https://cdn.jsdelivr.net/gh/PokeAPI/sprites@master/sprites/items/great-ball.png', desc: 'A good, high-performance Poké Ball that provides a higher Pokémon catch rate than a standard Poké Ball.' },
    { id: 6, name: 'Ultra Ball', count: 8, image: 'https://cdn.jsdelivr.net/gh/PokeAPI/sprites@master/sprites/items/ultra-ball.png', desc: 'An ultra-high-performance Poké Ball that provides a higher success rate for catching Pokémon than a Great Ball.' },
    { id: 7, name: 'Razz Berry', count: inventory.razzBerries, image: 'https://cdn.jsdelivr.net/gh/PokeAPI/sprites@master/sprites/items/razz-berry.png', desc: 'Feed this to a wild Pokémon to make it easier to catch.' },
    { id: 8, name: 'Golden Razz Berry', count: 2, image: 'https://cdn.jsdelivr.net/gh/PokeAPI/sprites@master/sprites/items/golden-razz-berry.png', desc: 'Feed this to a wild Pokémon to make it much easier to catch.' },
  ];

  return (
    <motion.div 
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 50 }}
      className="absolute inset-0 z-[700] bg-[#f8fafc] flex flex-col font-sans"
    >
      {/* Unified Pokémon GO header */}
      <ScreenHeader title="ITEMS" />

      {/* Bag Capacity Bar */}
      <div className="flex justify-center py-3 bg-white border-b-2 border-slate-200 shadow-sm relative z-10 shrink-0">
        <span className="text-slate-600 font-bold tracking-wide flex items-center gap-2">
           <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M4 10v11a1 1 0 0 0 1 1h14a1 1 0 0 0 1-1V10"/><path d="M10 4V2h4v2"/><path d="M2 10h20"/><path d="M7 10V6a2 2 0 0 1 2-2h6a2 2 0 0 1 2 2v4"/></svg>
           {allItems.reduce((sum, item) => sum + item.count, 0)} / 350
        </span>
      </div>

      {/* Scrolling List */}
      <div className="flex-1 overflow-y-auto pb-24 bg-white">
        <div className="flex flex-col">
          {allItems.map(item => (
            <div key={item.id} className="bg-white border-b-2 border-slate-100 p-3 pl-4 flex items-center gap-4 active:bg-slate-50 transition-colors cursor-pointer relative">
              
              {/* Item Icon */}
              <div className="w-16 h-16 shrink-0 relative flex items-center justify-center">
                <img src={item.image} alt={item.name} className="w-[110%] h-[110%] object-contain drop-shadow-[0_2px_4px_rgba(0,0,0,0.15)] z-10" />
              </div>

              {/* Item Info */}
              <div className="flex-1 min-w-0 pr-2">
                <h3 className="font-bold text-[#1b4353] tracking-wide text-[16px] truncate leading-tight mb-1">{item.name}</h3>
                <p className="text-slate-500 text-[11px] font-medium leading-[1.3] line-clamp-2">
                  {item.desc}
                </p>
              </div>

              {/* Quantity & Trash */}
              <div className="shrink-0 flex flex-col items-center justify-between h-[60px] pl-1 pr-1 border-l border-slate-100">
                <span className="font-display font-black text-slate-700 text-lg leading-none mt-1">x{item.count}</span>
                <button className="w-8 h-8 rounded-full flex items-center justify-center opacity-40 hover:opacity-100 hover:bg-slate-100 active:scale-90 transition-all">
                   <svg viewBox="0 0 24 24" width="18" height="18" stroke="#0b2a3a" strokeWidth="2.5" fill="none" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path></svg>
                </button>
              </div>

            </div>
          ))}
        </div>
      </div>

      {/* Close Button */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-20">
        <motion.button
          whileTap={{ scale: 0.9 }}
          onClick={onClose}
          className="w-[72px] h-[72px] flex items-center justify-center bg-transparent border-none"
        >
           <img 
             src="https://cdn.jsdelivr.net/gh/PokeMiners/pogo_assets@master/Images/Menu%20Icons/btn_close_normal.png" 
             alt="Close" 
             className="w-full h-full object-contain drop-shadow-lg"
           />
        </motion.button>
      </div>
    </motion.div>
  );
};

export default InventoryScreen;
