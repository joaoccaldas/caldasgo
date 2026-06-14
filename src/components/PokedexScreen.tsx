import React, { useEffect, useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { getPokedex } from '../services/storage';
import type { PokemonData } from '../services/pokeapi';

interface PokedexScreenProps {
  onClose: () => void;
}

const TOTAL_POKEMON = 1025;

const typeColors: Record<string, string> = {
  normal: '#A8A77A', fire: '#EE8130', water: '#6390F0', electric: '#F7D02C',
  grass: '#7AC74C', ice: '#96D9D6', fighting: '#C22E28', poison: '#A33EA1',
  ground: '#E2BF65', flying: '#A98FF3', psychic: '#F95587', bug: '#A6B91A',
  rock: '#B6A136', ghost: '#735797', dragon: '#6F35FC', dark: '#705898',
  steel: '#B7B7CE', fairy: '#D685AD'
};

const PokedexScreen: React.FC<PokedexScreenProps> = ({ onClose }) => {
  const [caughtPokemon, setCaughtPokemon] = useState<PokemonData[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedPokemon, setSelectedPokemon] = useState<PokemonData | null>(null);
  
  // Search state
  const [isSearching, setIsSearching] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    getPokedex().then(data => {
      setCaughtPokemon(data);
      setLoading(false);
    });
  }, []);

  // Filter logic
  const filteredGrid = useMemo(() => {
    const maxCaughtId = caughtPokemon.length > 0 ? Math.max(...caughtPokemon.map(p => p.id)) : 100;
    const displayCount = Math.min(TOTAL_POKEMON, Math.max(150, maxCaughtId + 30));
    
    let baseGrid = Array.from({ length: displayCount }).map((_, index) => {
      const id = index + 1;
      return { id, caught: caughtPokemon.find(p => p.id === id) };
    });

    if (searchQuery.trim() !== '') {
      const query = searchQuery.toLowerCase();
      baseGrid = baseGrid.filter(item => {
        // If searching by number
        if (!isNaN(Number(query))) {
          return item.id.toString().includes(query);
        }
        // If searching by name (only if caught)
        if (item.caught) {
          return item.caught.name.toLowerCase().includes(query);
        }
        return false;
      });
    }

    return baseGrid;
  }, [caughtPokemon, searchQuery]);

  if (loading) return null;

  return (
    <motion.div 
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 50 }}
      className="absolute inset-0 z-[700] bg-white flex flex-col font-sans overflow-hidden"
    >
      {/* Search Bar Overlay */}
      <AnimatePresence>
        {isSearching && (
          <motion.div 
            initial={{ y: -100 }}
            animate={{ y: 0 }}
            exit={{ y: -100 }}
            className="absolute top-0 left-0 right-0 z-30 bg-[#e3350d] p-4 shadow-lg flex items-center gap-2"
          >
            <div className="flex-1 bg-white rounded-full flex items-center px-4 h-10">
               <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#64748b" strokeWidth="2"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>
               <input 
                 autoFocus
                 type="text" 
                 placeholder="Search by name or number..." 
                 value={searchQuery}
                 onChange={(e) => setSearchQuery(e.target.value)}
                 className="flex-1 bg-transparent outline-none ml-2 text-slate-800 placeholder-slate-400 font-medium"
               />
               {searchQuery && (
                 <button onClick={() => setSearchQuery('')} className="text-slate-400 p-1">
                   <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
                 </button>
               )}
            </div>
            <button onClick={() => { setIsSearching(false); setSearchQuery(''); }} className="text-white font-bold ml-2">
              Cancel
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Top Header - Authentic Red Banner */}
      <div 
        className="h-20 flex flex-col justify-end items-center pb-2 relative z-10 shrink-0"
        style={{
          background: 'linear-gradient(to bottom, #E84A36 0%, #D23A26 100%)',
          boxShadow: '0 4px 6px rgba(0,0,0,0.3), inset 0 -2px 5px rgba(0,0,0,0.2)'
        }}
      >
         <h1 className="text-white font-black tracking-[0.15em] text-xl drop-shadow-md font-sans">POKÉDEX</h1>
      </div>

      {/* Stats Bar */}
      <div className="flex justify-center gap-12 py-3 bg-white border-b-2 border-slate-200 shadow-sm relative z-10 shrink-0">
        <div className="flex flex-col items-center">
          <span className="text-slate-500 text-xs font-bold tracking-wider">SEEN</span>
          <span className="text-slate-800 text-2xl font-black">{caughtPokemon.length}</span>
        </div>
        <div className="flex flex-col items-center">
          <span className="text-[#3b82f6] text-xs font-bold tracking-wider">CAUGHT</span>
          <span className="text-slate-800 text-2xl font-black">{caughtPokemon.length}</span>
        </div>
      </div>

      {/* Grid Container */}
      <div className="flex-1 overflow-y-auto px-2 pt-2 pb-24 bg-[#f8fafc]">
        <div className="grid grid-cols-3 gap-2">
          {filteredGrid.map((item) => (
            <div 
              key={item.id} 
              onClick={() => item.caught && setSelectedPokemon(item.caught)}
              className={`aspect-square bg-white border border-slate-200 rounded-lg shadow-sm flex flex-col items-center justify-center relative overflow-hidden ${item.caught ? 'cursor-pointer active:scale-95 transition-transform' : ''}`}
            >
              <span className="absolute top-1 left-1.5 text-slate-400 font-bold text-[10px]">
                #{item.id.toString().padStart(3, '0')}
              </span>
              
              {item.caught ? (
                <div className="w-full h-full flex items-center justify-center p-3 mt-2">
                  <img 
                    src={item.caught.image} 
                    alt={item.caught.name} 
                    className="w-full h-full object-contain drop-shadow-md"
                  />
                </div>
              ) : (
                <span className="text-slate-300 font-black text-2xl mt-2">{item.id}</span>
              )}
            </div>
          ))}
          {filteredGrid.length === 0 && (
            <div className="col-span-3 py-10 text-center text-slate-500 font-medium">
              No Pokémon found matching "{searchQuery}"
            </div>
          )}
        </div>
      </div>

      {/* Floating Search Button */}
      <motion.button
        whileTap={{ scale: 0.9 }}
        onClick={() => setIsSearching(true)}
        className="absolute bottom-24 right-6 w-14 h-14 rounded-full bg-gradient-to-b from-[#10b981] to-[#047857] shadow-lg border-[3px] border-white flex items-center justify-center z-20"
      >
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>
      </motion.button>

      {/* Authentic Close Button */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-20">
        <motion.button
          whileTap={{ scale: 0.9 }}
          onClick={onClose}
          className="w-[72px] h-[72px] flex items-center justify-center bg-transparent border-none"
        >
           <img 
             src="https://raw.githubusercontent.com/PokeMiners/pogo_assets/master/Images/Menu%20Icons/btn_close_normal.png" 
             alt="Close" 
             className="w-full h-full object-contain drop-shadow-lg"
           />
        </motion.button>
      </div>

      {/* Authentic Flat Detail View (Replaces 3D Card) */}
      <AnimatePresence>
        {selectedPokemon && (
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'tween', duration: 0.2 }}
            className="absolute inset-0 bg-white z-50 flex flex-col font-sans overflow-hidden"
          >
             {/* Gradient Background matching Pokemon type spanning full screen */}
             <div 
                className="absolute inset-0 opacity-[0.15] z-0"
                style={{ background: `linear-gradient(to bottom, ${typeColors[selectedPokemon.types[0]] || '#ccc'} 0%, white 50%)` }}
             />

             {/* Top Nav */}
             <div className="w-full flex justify-between items-center p-4 z-10 pt-12">
               <button onClick={() => setSelectedPokemon(null)} className="w-10 h-10 flex items-center justify-center text-slate-500 active:bg-slate-100 rounded-full">
                  <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="m15 18-6-6 6-6"/></svg>
               </button>
               <div className="flex gap-2">
                 {/* Star/Favorite Icon placeholder */}
                 <button className="w-10 h-10 flex items-center justify-center text-slate-300">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>
                 </button>
               </div>
             </div>

             {/* CP Arc Placeholder */}
             <div className="w-full flex justify-center mt-2 z-10 relative h-12">
               <div className="w-64 h-32 border-t-4 border-dashed border-slate-300 rounded-t-full absolute -top-8" />
               <div className="bg-white px-4 py-1 rounded-full shadow-sm border border-slate-200 z-10 flex items-baseline gap-1">
                 <span className="text-xs font-bold text-slate-500">CP</span>
                 <span className="text-xl font-black text-slate-800">???</span>
               </div>
             </div>

             {/* 3D Model Render */}
             <motion.div 
               animate={{ y: [-5, 5] }}
               transition={{ repeat: Infinity, duration: 4, repeatType: "mirror", ease: "easeInOut" }}
               className="w-full h-[35vh] flex flex-col items-center justify-center relative z-10"
             >
               <img src={selectedPokemon.image} alt={selectedPokemon.name} className="w-[80%] h-full object-contain drop-shadow-2xl" />
             </motion.div>

             {/* Base Info */}
             <div className="w-full flex flex-col items-center z-10 mt-2 flex-1 bg-white pt-4 shadow-[0_-10px_20px_rgba(0,0,0,0.05)] rounded-t-[2.5rem]">
               <h2 className="text-3xl font-black text-slate-800 tracking-wide uppercase mb-1">
                 {selectedPokemon.name}
               </h2>
               
               {/* HP Bar */}
               <div className="w-48 h-2 bg-green-400 rounded-full mb-4 shadow-inner" />

               {/* Weight / Types / Height */}
               <div className="w-full px-8 flex justify-between items-center mb-6">
                 <div className="flex flex-col items-center flex-1 border-r border-slate-200">
                   <span className="text-lg font-black text-slate-800">??? <span className="text-xs">kg</span></span>
                   <span className="text-[10px] font-bold text-slate-400 tracking-wider">WEIGHT</span>
                 </div>
                 
                 <div className="flex flex-col items-center flex-1 gap-1">
                   <div className="flex gap-1 justify-center flex-wrap">
                     {selectedPokemon.types.map(t => (
                       <div 
                         key={t} 
                         className="px-2 py-0.5 rounded-full text-white text-[10px] font-bold uppercase shadow-sm"
                         style={{ backgroundColor: typeColors[t] || '#ccc' }}
                       >
                         {t}
                       </div>
                     ))}
                   </div>
                   <span className="text-[10px] font-bold text-slate-400 tracking-wider mt-1">TYPE</span>
                 </div>

                 <div className="flex flex-col items-center flex-1 border-l border-slate-200">
                   <span className="text-lg font-black text-slate-800">??? <span className="text-xs">m</span></span>
                   <span className="text-[10px] font-bold text-slate-400 tracking-wider">HEIGHT</span>
                 </div>
               </div>

               {/* Stardust / Candy (Placeholders) */}
               <div className="w-full px-8 flex justify-center gap-12 mb-6">
                 <div className="flex items-center gap-2">
                   <div className="w-6 h-6 rounded-full bg-purple-500 border-2 border-white shadow-sm" />
                   <span className="font-black text-slate-800">2,500</span>
                 </div>
                 <div className="flex items-center gap-2">
                   <div className="w-6 h-6 rounded-full bg-orange-400 border-2 border-white shadow-sm" />
                   <span className="font-black text-slate-800">3</span>
                 </div>
               </div>

               {/* Power Up Button */}
               <div 
                 className="w-[85%] rounded-full py-3 flex justify-between items-center px-6 active:scale-95 transition-transform mb-4"
                 style={{
                   background: 'linear-gradient(to bottom, #26C281 0%, #1DA66C 100%)',
                   boxShadow: '0 4px 10px rgba(38,194,129,0.4), inset 0 2px 4px rgba(255,255,255,0.3)',
                   border: '2px solid #148A58'
                 }}
               >
                 <span className="text-white font-black tracking-widest text-lg drop-shadow-[0_1px_2px_rgba(0,0,0,0.5)] font-sans">POWER UP</span>
                 <div className="flex items-center gap-4 text-white font-black drop-shadow-[0_1px_2px_rgba(0,0,0,0.5)] font-condensed">
                   <span>2,500</span>
                   <span>2</span>
                 </div>
               </div>
             </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default PokedexScreen;
