import React, { useEffect, useState } from 'react';
import { getPokedex } from '../services/storage';
import { PokemonData } from '../services/pokeapi';

const PokedexScreen = () => {
  const [caughtPokemon, setCaughtPokemon] = useState<PokemonData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadPokedex = async () => {
      const data = await getPokedex();
      setCaughtPokemon(data);
      setLoading(false);
    };
    loadPokedex();
  }, []);

  return (
    <div className="h-full flex flex-col bg-slate-900 text-white overflow-y-auto no-scrollbar pb-20">
      <div className="sticky top-0 bg-slate-900/90 backdrop-blur-md p-4 z-10 border-b border-slate-800">
        <h1 className="text-3xl font-black text-center text-yellow-400 drop-shadow-[0_2px_2px_rgba(0,0,0,0.8)] tracking-wider" style={{ WebkitTextStroke: '1px #3b82f6' }}>
          Pokédex
        </h1>
        <p className="text-center text-slate-400 mt-1 text-sm font-medium">Caught: {caughtPokemon.length}</p>
      </div>

      <div className="p-4 flex-1">
        {loading ? (
          <div className="flex justify-center items-center h-full">
            <div className="w-10 h-10 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" />
          </div>
        ) : caughtPokemon.length === 0 ? (
          <div className="flex flex-col justify-center items-center h-full text-slate-500 space-y-4 mt-20">
            <svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" className="opacity-50"><circle cx="12" cy="12" r="10"/><path d="M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20"/><path d="M2 12h20"/></svg>
            <p className="text-lg">Your Pokédex is empty.</p>
            <p className="text-sm">Go explore to catch legendary Pokémon!</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-4">
            {caughtPokemon.map((pokemon) => (
              <div 
                key={pokemon.id}
                className="bg-slate-800 rounded-2xl p-4 border border-slate-700 shadow-lg flex flex-col items-center relative overflow-hidden group"
              >
                <div className="absolute top-2 left-2 text-xs font-bold text-slate-500">
                  #{pokemon.id.toString().padStart(3, '0')}
                </div>
                
                {/* Type Badges (background glow) */}
                <div className="absolute inset-0 opacity-20 bg-gradient-to-br from-blue-500 to-purple-500 rounded-2xl" />

                <img 
                  src={pokemon.image} 
                  alt={pokemon.name}
                  className="w-24 h-24 object-contain drop-shadow-md z-10 group-hover:scale-110 transition-transform"
                />
                <h3 className="font-bold text-lg mt-2 z-10 text-white tracking-wide">{pokemon.name}</h3>
                
                <div className="flex gap-1 mt-2 z-10">
                  {pokemon.types.map(type => (
                    <span key={type} className="text-[10px] uppercase tracking-wider bg-slate-700 px-2 py-1 rounded-full text-slate-300 font-semibold border border-slate-600">
                      {type}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default PokedexScreen;
