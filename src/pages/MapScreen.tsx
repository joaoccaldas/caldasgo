import { useState, useRef, useEffect } from 'react';
import Map, { Marker } from 'react-map-gl/maplibre';
import type { MapRef } from 'react-map-gl/maplibre';
import 'maplibre-gl/dist/maplibre-gl.css';

import HUD from '../components/HUD';
import BottomNav from '../components/BottomNav';
import EncounterScreen from '../components/EncounterScreen';
import PokedexScreen from '../components/PokedexScreen';
import PokemonStorageScreen from '../components/PokemonStorageScreen';
import InventoryScreen from '../components/InventoryScreen';
import PokestopScreen from '../components/PokestopScreen';
import { useGeolocation } from '../hooks/useGeolocation';
import { useSpawning } from '../hooks/useSpawning';
import { usePokestops } from '../hooks/usePokestops';
import { useTrainer } from '../hooks/useTrainer';
import { useCollection } from '../hooks/useCollection';
import { getPogoSprite } from '../data/pokemonDatabase';
import type { Pokestop, SpawnedPokemon } from '../types/index';

// Custom MapLibre style using Carto Voyager (clean, no labels, game-like)
const MAP_STYLE = {
  version: 8 as const,
  sources: {
    'raster-tiles': {
      type: 'raster' as const,
      tiles: ['https://basemaps.cartocdn.com/rastertiles/voyager_nolabels/{z}/{x}/{y}{r}.png'],
      tileSize: 256,
      attribution: '© OpenStreetMap, © CARTO'
    }
  },
  layers: [
    {
      id: 'simple-tiles',
      type: 'raster' as const,
      source: 'raster-tiles',
      minzoom: 0,
      maxzoom: 22
    }
  ]
};

const MapScreen: React.FC = () => {
  const { location, isMock, setLocation } = useGeolocation();
  const { spawnedPokemon, removeSpawn } = useSpawning(location);
  const { pokestops, spinPokestop, isSpinable } = usePokestops(location);
  const trainer = useTrainer();
  const collection = useCollection();
  const [activeOverlay, setActiveOverlay] = useState<'none' | 'pokedex' | 'storage' | 'inventory'>('none');
  const [encounter, setEncounter] = useState<SpawnedPokemon | null>(null);
  const [activeStop, setActiveStop] = useState<Pokestop | null>(null);

  const mapRef = useRef<MapRef>(null);

  // Record an encounter as "seen" the moment the player taps a wild Pokémon.
  const openEncounter = (spawn: SpawnedPokemon) => {
    collection.recordSeen(spawn.speciesId);
    setEncounter(spawn);
  };

  // Keep camera locked on player unless they drag.
  useEffect(() => {
    if (location && mapRef.current) {
      mapRef.current.flyTo({ center: [location.lng, location.lat], duration: 800, essential: true });
    }
  }, [location]);

  // If GPS is completely blocked and hook hasn't yielded yet
  if (!location) {
    return (
      <div className="w-full h-screen bg-[#10b981] flex flex-col items-center justify-center">
        <div className="w-16 h-16 border-4 border-white border-t-transparent rounded-full animate-spin"></div>
        <p className="text-white font-bold mt-4 tracking-widest uppercase">Acquiring GPS Signal...</p>
      </div>
    );
  }

  // To simulate walking if mock is true
  const handleMapClick = (e: maplibregl.MapMouseEvent) => {
    if (isMock) {
      setLocation({ lat: e.lngLat.lat, lng: e.lngLat.lng });
    }
  };

  return (
    <div className="w-full h-[100dvh] relative overflow-hidden bg-gradient-to-b from-sky-300 via-sky-100 to-white">
      {/* Skybox horizon line to hide the map edge */}
      <div className="absolute top-0 left-0 w-full h-[35vh] bg-gradient-to-b from-sky-400/80 to-transparent z-[1] pointer-events-none" />
      
      {/* The 100% Authentic PoGo Map Wrapper */}
      <div className="absolute inset-0 z-0 pogo-map-filter bg-[#aee2ff]">
        <Map
          ref={mapRef}
          initialViewState={{
            longitude: location.lng,
            latitude: location.lat,
            zoom: 17.5,
            pitch: 60,
            bearing: 0
          }}
          mapStyle={MAP_STYLE}
          style={{ width: '100%', height: '100%' }}
          interactive={true}
          onClick={handleMapClick}
          dragRotate={true}
          pitchWithRotate={true}
          maxPitch={85}
          attributionControl={false}
        >
          {/* Render PokéStops using the real Pokémon GO map-pin artwork */}
          {pokestops.map((stop: Pokestop) => {
            const spinnable = isSpinable(stop);
            return (
              <Marker
                key={stop.id}
                longitude={stop.lng}
                latitude={stop.lat}
                anchor="bottom"
                pitchAlignment="viewport"
                rotationAlignment="viewport"
                onClick={(e) => {
                  e.originalEvent.stopPropagation();
                  setActiveStop(stop);
                }}
                style={{ cursor: 'pointer', zIndex: 10 }}
              >
                <div className="relative flex flex-col items-center hover:scale-105 transition-transform origin-bottom drop-shadow-[0_4px_6px_rgba(0,0,0,0.35)]">
                  <img
                    src="https://cdn.jsdelivr.net/gh/PokeMiners/pogo_assets@master/Images/Pokestops%20and%20Gyms/pokestop_near.png"
                    alt="PokéStop"
                    className={`w-12 h-[60px] object-contain ${spinnable ? '' : 'grayscale opacity-60'}`}
                  />
                </div>
              </Marker>
            );
          })}

          {/* Render Spawns */}
          {spawnedPokemon.map((spawn: SpawnedPokemon) => {
            const pogo = getPogoSprite(spawn.speciesId);
            const basic = `https://cdn.jsdelivr.net/gh/PokeAPI/sprites@master/sprites/pokemon/${spawn.speciesId}.png`;

            return (
              <Marker
                key={spawn.id}
                longitude={spawn.lng}
                latitude={spawn.lat}
                anchor="bottom"
                pitchAlignment="viewport"
                rotationAlignment="viewport"
                onClick={(e) => {
                  e.originalEvent.stopPropagation();
                  openEncounter(spawn);
                }}
                style={{ cursor: 'pointer', zIndex: 20 }}
              >
                <div className="relative w-16 h-16 flex items-center justify-center hover:scale-110 transition-transform origin-bottom">
                  <div className="pulse-ring pointer-events-none"></div>
                  <div className="absolute bottom-1 left-1/2 -translate-x-1/2 w-8 h-2.5 bg-black/30 rounded-[100%] blur-[1px] z-0 pointer-events-none"></div>
                  <img 
                    src={pogo} 
                    alt={spawn.species.name} 
                    className="relative w-[120%] h-[120%] object-contain drop-shadow-[0_5px_10px_rgba(0,0,0,0.5)] z-10" 
                    onError={(e) => { e.currentTarget.onerror = null; e.currentTarget.src = basic; }}
                  />
                </div>
              </Marker>
            );
          })}

          {/* Trainer Avatar Standee on the map */}
          <Marker
            longitude={location.lng}
            latitude={location.lat}
            anchor="bottom"
            pitchAlignment="viewport"
            rotationAlignment="viewport"
            style={{ zIndex: 30, pointerEvents: 'none' }}
          >
            <div className="relative flex flex-col items-center origin-bottom drop-shadow-[0_5px_8px_rgba(0,0,0,0.4)]">
              <div className="absolute bottom-1 w-12 h-4 bg-black/30 rounded-[100%] blur-[2px] z-0"></div>
              <img
                src="https://cdn.jsdelivr.net/gh/PokeAPI/sprites@master/sprites/pokemon/other/official-artwork/25.png"
                alt="You"
                className="relative w-16 h-16 object-contain z-10"
              />
              {/* Authentic radar pulse under trainer */}
              <div className="absolute top-1/2 left-1/2 w-[120px] h-[120px] -ml-[60px] -mt-[60px] rounded-full border-[3px] border-white/40 shadow-[0_0_15px_rgba(255,255,255,0.5)] animate-[pulse-ring_3s_infinite_cubic-bezier(0.215,0.61,0.355,1)] pointer-events-none z-0"></div>
            </div>
          </Marker>
        </Map>

      </div>

      <style>{`
        @keyframes pulse-ring {
          0% { transform: scale(0.33); opacity: 1; }
          80%, 100% { transform: scale(1); opacity: 0; }
        }
      `}</style>

      {/* Fake GPS Mock Indicator */}
      {isMock && (
        <div className="absolute top-20 left-1/2 -translate-x-1/2 z-50 bg-slate-800/80 text-white text-[10px] px-2 py-0.5 rounded-full whitespace-nowrap border border-white/20 shadow-md">
          Mock GPS
        </div>
      )}

      {/* Primary HUD Layer */}
      <HUD playerLevel={trainer.level} xpProgress={trainer.progress} stardust={collection.stardust} />

      {/* Persistent bottom navigation */}
      <BottomNav
        onOpenPokedex={() => setActiveOverlay('pokedex')}
        onOpenStorage={() => setActiveOverlay('storage')}
        onOpenInventory={() => setActiveOverlay('inventory')}
        spawnedPokemon={spawnedPokemon}
        seen={collection.seen}
      />

      {/* Overlays */}
      {activeOverlay === 'pokedex' && (
        <PokedexScreen
          onClose={() => setActiveOverlay('none')}
          owned={collection.owned}
          seen={collection.seen}
        />
      )}

      {activeOverlay === 'storage' && (
        <PokemonStorageScreen
          onClose={() => setActiveOverlay('none')}
          owned={collection.owned}
          candies={collection.candies}
          stardust={collection.stardust}
          onEvolve={collection.evolve}
          onPowerUp={collection.powerUp}
          onToggleFavorite={collection.toggleFavorite}
        />
      )}

      {activeOverlay === 'inventory' && (
        <InventoryScreen onClose={() => setActiveOverlay('none')} />
      )}

      {/* Encounter Screen */}
      {encounter && (
        <EncounterScreen
          spawn={encounter}
          onClose={() => setEncounter(null)}
          catchPokemon={collection.catchPokemon}
          gainXp={trainer.gainXp}
          onCaught={() => {
            removeSpawn(encounter.id);
            setEncounter(null);
          }}
        />
      )}

      {/* PokéStop Screen */}
      {activeStop && (
        <PokestopScreen
          pokestop={activeStop}
          isSpinable={isSpinable(activeStop)}
          onClose={() => setActiveStop(null)}
          onSpin={(id) => spinPokestop(id)}
        />
      )}
    </div>
  );
};

export default MapScreen;
