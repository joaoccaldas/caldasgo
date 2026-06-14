import React, { useState } from 'react';
import HUD from '../components/HUD';
import MainMenu from '../components/MainMenu';
import EncounterScreen from '../components/EncounterScreen';
import PokedexScreen from '../components/PokedexScreen';
import InventoryScreen from '../components/InventoryScreen';
import type { SpawnedPokemon } from '../types/index';

interface MapScreenProps {
  onCaught: () => void;
}

const MapScreen: React.FC<MapScreenProps> = ({ onCaught }) => {
  const [activeOverlay, setActiveOverlay] = useState<'none' | 'menu' | 'pokedex' | 'inventory'>('none');
  const [encounter, setEncounter] = useState<SpawnedPokemon | null>(null);

  // Fake a static spawn for the static map layout
  // We'll place a random Pokemon on the static map image so the user can click it to encounter
  const [mapSpawns] = useState<SpawnedPokemon[]>([
    {
      id: 'static-spawn-1',
      lat: 0,
      lng: 0,
      pokemonId: 25,
      spawnTime: Date.now(),
      pokemonData: {
        id: 25,
        name: 'Pikachu',
        image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/25.png',
        types: ['electric']
      }
    }
  ]);

  return (
    <div className="w-full h-[100dvh] relative overflow-hidden bg-sky-200">
      
      {/* 1:1 Static Video Game Map Background */}
      <div 
        className="absolute inset-0 w-full h-full bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: 'url(/caldasgo/pogo_map_bg.png)' }}
      >
        {/* We place a clickable Pokemon directly on the map image for the demo */}
        {mapSpawns.map(spawn => (
          <div 
            key={spawn.id}
            onClick={() => setEncounter(spawn)}
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-[100px] w-24 h-24 flex items-center justify-center cursor-pointer hover:scale-110 active:scale-90 transition-transform z-10"
          >
            {/* Pulsing ring underneath */}
            <div className="absolute inset-0 rounded-full bg-white/40 animate-ping opacity-70 border-[2px] border-white" />
            <img 
              src={spawn.pokemonData.image} 
              alt={spawn.pokemonData.name} 
              className="w-full h-full object-contain drop-shadow-[0_5px_10px_rgba(0,0,0,0.5)] z-10"
            />
          </div>
        ))}
      </div>

      {/* The Player Avatar in the center of the static map */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-16 h-16 pointer-events-none z-10">
         <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-12 h-4 bg-black/30 rounded-[100%] blur-sm" />
         <div className="w-full h-full bg-red-500 rounded-full border-[3px] border-white shadow-lg overflow-hidden flex items-center justify-center">
            {/* Fake Trainer */}
            <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="white" stroke="white" strokeWidth="1"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
         </div>
      </div>

      {/* Primary HUD Layer */}
      <HUD onOpenMenu={() => setActiveOverlay('menu')} playerLevel={40} />

      {/* Overlays */}
      {activeOverlay === 'menu' && (
        <MainMenu 
          onClose={() => setActiveOverlay('none')} 
          onOpenPokedex={() => setActiveOverlay('pokedex')}
          onOpenInventory={() => setActiveOverlay('inventory')}
        />
      )}

      {activeOverlay === 'pokedex' && (
        <PokedexScreen onClose={() => setActiveOverlay('menu')} />
      )}

      {activeOverlay === 'inventory' && (
        <InventoryScreen onClose={() => setActiveOverlay('menu')} />
      )}

      {/* Encounter Screen */}
      {encounter && (
        <EncounterScreen 
          spawn={encounter} 
          onClose={() => setEncounter(null)} 
          onCaught={() => {
            setEncounter(null);
            onCaught();
          }} 
        />
      )}
    </div>
  );
};

export default MapScreen;
