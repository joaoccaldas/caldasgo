import React, { useEffect, useState } from 'react';
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

  useEffect(() => {
    getPokedex().then(data => {
      setCaughtPokemon(data);
      setLoading(false);
    });
  }, []);

  if (loading) return null;

  const maxCaughtId = caughtPokemon.length > 0 ? Math.max(...caughtPokemon.map(p => p.id)) : 100;
  const displayCount = Math.min(TOTAL_POKEMON, Math.max(150, maxCaughtId + 30));

  return (
    <motion.div 
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 50 }}
      className="absolute inset-0 z-[700] bg-white flex flex-col font-sans overflow-hidden"
    >
      {/* Top Header - Authentic Red Banner */}
      <div className="bg-[#e3350d] h-20 flex flex-col justify-end items-center pb-2 relative shadow-md z-10 shrink-0">
         <h1 className="text-white font-black tracking-widest text-xl drop-shadow-md">POKÉDEX</h1>
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
          {Array.from({ length: displayCount }).map((_, index) => {
            const id = index + 1;
            const caught = caughtPokemon.find(p => p.id === id);

            return (
              <div 
                key={id} 
                onClick={() => caught && setSelectedPokemon(caught)}
                className={`aspect-square bg-white border border-slate-200 rounded-lg shadow-sm flex flex-col items-center justify-center relative overflow-hidden ${caught ? 'cursor-pointer active:scale-95 transition-transform' : ''}`}
              >
                <span className="absolute top-1 left-1.5 text-slate-400 font-bold text-[10px]">
                  #{id.toString().padStart(3, '0')}
                </span>
                
                {caught ? (
                  <div className="w-full h-full flex items-center justify-center p-3 mt-2">
                    <img 
                      src={caught.image} 
                      alt={caught.name} 
                      className="w-full h-full object-contain drop-shadow-md"
                    />
                  </div>
                ) : (
                  <span className="text-slate-300 font-black text-2xl mt-2">{id}</span>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Authentic Close Button */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-20">
        <motion.button
          whileTap={{ scale: 0.9 }}
          onClick={onClose}
          className="w-14 h-14 rounded-full bg-white border-[3px] border-[#10b981] shadow-[0_4px_15px_rgba(0,0,0,0.2)] flex items-center justify-center text-[#10b981]"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
        </motion.button>
      </div>

      {/* Detail Card Overlay */}
      <AnimatePresence>
        {selectedPokemon && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="absolute inset-0 bg-white z-50 flex flex-col items-center overflow-y-auto"
          >
             {/* Gradient Background matching Pokemon type */}
             <div 
                className="absolute inset-x-0 top-0 h-[400px] opacity-20"
                style={{ background: `radial-gradient(circle at center, ${typeColors[selectedPokemon.types[0]] || '#ccc'} 0%, transparent 70%)` }}
             />

             {/* Top Nav */}
             <div className="w-full flex justify-between items-center p-4 z-10">
               <button onClick={() => setSelectedPokemon(null)} className="w-10 h-10 flex items-center justify-center text-slate-500">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="m15 18-6-6 6-6"/></svg>
               </button>
               <span className="text-slate-800 font-black text-xl tracking-wider">
                 #{selectedPokemon.id.toString().padStart(3, '0')}
               </span>
               <div className="w-10" />
             </div>

             {/* Rotating Image */}
             <motion.div 
               animate={{ y: [-10, 10] }}
               transition={{ repeat: Infinity, duration: 3, repeatType: "mirror", ease: "easeInOut" }}
               className="w-64 h-64 flex items-center justify-center relative z-10 mt-8"
             >
               {/* 3D Platform Shadow */}
               <div className="absolute bottom-4 w-40 h-8 bg-black/20 rounded-[100%] blur-xl" />
               <img src={selectedPokemon.image} alt={selectedPokemon.name} className="w-[120%] h-[120%] object-contain drop-shadow-2xl" />
             </motion.div>

             {/* Info Section */}
             <div className="w-full px-8 mt-4 flex flex-col items-center z-10">
               <h2 className="text-3xl font-black text-slate-800 tracking-wide uppercase mb-3">
                 {selectedPokemon.name}
               </h2>
               
               {/* Types */}
               <div className="flex gap-2 mb-6">
                 {selectedPokemon.types.map(t => (
                   <div 
                     key={t} 
                     className="px-4 py-1 rounded-full text-white text-xs font-bold uppercase shadow-sm border border-black/10"
                     style={{ backgroundColor: typeColors[t] || '#ccc' }}
                   >
                     {t}
                   </div>
                 ))}
               </div>

               <div className="w-full border-t border-slate-200 my-4" />

               {/* Stats Grid */}
               <div className="w-full grid grid-cols-2 gap-4 text-center">
                 <div className="flex flex-col items-center">
                   <span className="text-lg font-black text-slate-800">1</span>
                   <span className="text-xs font-bold text-slate-400 tracking-wider">CAUGHT</span>
                 </div>
                 <div className="flex flex-col items-center">
                   <span className="text-lg font-black text-slate-800">1</span>
                   <span className="text-xs font-bold text-slate-400 tracking-wider">SEEN</span>
                 </div>
               </div>

               <div className="w-full border-t border-slate-200 my-4" />

               {/* Flavor Text (Hardcoded placeholder for clone effect) */}
               <p className="text-slate-600 text-sm text-center leading-relaxed px-4 italic font-medium">
                 This legendary Pokémon is said to have immense power. Its appearance in the wild is extremely rare and studying it has brought many new discoveries to the world of Pokémon.
               </p>
             </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default PokedexScreen;
