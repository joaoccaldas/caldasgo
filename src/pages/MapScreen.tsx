import { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, useMap, useMapEvents } from 'react-leaflet';
import L, { type LeafletMouseEvent } from 'leaflet';
import 'leaflet/dist/leaflet.css';

import HUD from '../components/HUD';
import MainMenu from '../components/MainMenu';
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
import { getPogoSprite, getPokemonImage } from '../data/pokemonDatabase';
import type { Pokestop, SpawnedPokemon } from '../types/index';

// Leaflet marker fix - the default icon URLs point at bundler-relative assets
// that don't exist, so we delete the private lookup and provide CDN URLs instead.
// @ts-expect-error _getIconUrl is a private Leaflet implementation detail
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
});

const LocationUpdater = ({ center }: { center: [number, number] }) => {
  const map = useMap();
  useEffect(() => {
    map.setView(center, map.getZoom());
  }, [center, map]);
  return null;
};

// Helper component to capture map clicks
const MapClickCapturer = ({ onClick }: { onClick: (e: LeafletMouseEvent) => void }) => {
  useMapEvents({
    click: onClick,
  });
  return null;
};

const MapScreen: React.FC = () => {
  const { location, isMock, setLocation } = useGeolocation();
  const { spawnedPokemon, removeSpawn } = useSpawning(location);
  const { pokestops, spinPokestop, isSpinable } = usePokestops(location);
  const trainer = useTrainer();
  const collection = useCollection();
  const [activeOverlay, setActiveOverlay] = useState<'none' | 'menu' | 'pokedex' | 'storage' | 'inventory'>('none');
  const [encounter, setEncounter] = useState<SpawnedPokemon | null>(null);
  const [activeStop, setActiveStop] = useState<Pokestop | null>(null);

  // Record an encounter as "seen" the moment the player taps a wild Pokémon.
  const openEncounter = (spawn: SpawnedPokemon) => {
    collection.recordSeen(spawn.speciesId);
    setEncounter(spawn);
  };

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
  const handleMapClick = (e: LeafletMouseEvent) => {
    if (isMock) {
      setLocation({ lat: e.latlng.lat, lng: e.latlng.lng });
    }
  };

  return (
    <div className="w-full h-[100dvh] relative overflow-hidden bg-sky-200">

      {/* The 100% Authentic PoGo Map CSS Filter wrapper */}
      {/* We apply sepia/hue-rotate to force Google/Carto maps into the vivid PoGo green/blue aesthetic */}
      <div className="absolute inset-0 z-0 pogo-map-filter">
        <MapContainer
          center={[location.lat, location.lng]}
          zoom={18}
          zoomControl={false}
          className="w-full h-full"
        >
          {/* Use Voyager No Labels for a clean video game look */}
          <TileLayer
            url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager_nolabels/{z}/{x}/{y}{r}.png"
            attribution=""
          />
          <LocationUpdater center={[location.lat, location.lng]} />

          {/* Capture map clicks for mock walking */}
          <MapClickCapturer onClick={handleMapClick} />

          {/* Render PokéStops as the iconic blue spinning discs */}
          {pokestops.map((stop: Pokestop) => {
            const spinnable = isSpinable(stop);
            const stopIcon = L.divIcon({
              html: `
                <div class="relative flex flex-col items-center -ml-5 -mt-10 cursor-pointer">
                  <div class="w-10 h-10 rounded-full ${spinnable ? 'bg-[#48b6e0]' : 'bg-[#8a6fc4]'} border-[3px] border-white shadow-[0_4px_8px_rgba(0,0,0,0.4)] flex items-center justify-center">
                    <div class="w-5 h-5 rounded-full bg-white/90 flex items-center justify-center">
                      <div class="w-2.5 h-2.5 rounded-full ${spinnable ? 'bg-[#48b6e0]' : 'bg-[#8a6fc4]'}"></div>
                    </div>
                  </div>
                  <div class="w-1.5 h-5 ${spinnable ? 'bg-[#3a9ec4]' : 'bg-[#74599e]'}"></div>
                </div>
              `,
              className: 'custom-pokestop-icon',
              iconSize: [40, 60],
            });
            return (
              <Marker
                key={stop.id}
                position={[stop.lat, stop.lng]}
                icon={stopIcon}
                eventHandlers={{ click: () => setActiveStop(stop) }}
              />
            );
          })}

          {/* Render Spawns */}
          {spawnedPokemon.map((spawn: SpawnedPokemon) => {
            // Real PoGo sprite first, falling back to official artwork, then basic sprite.
            const pogo = getPogoSprite(spawn.speciesId);
            const artwork = getPokemonImage(spawn.speciesId);
            const basic = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${spawn.speciesId}.png`;
            const icon = L.divIcon({
              html: `
                <div class="relative w-16 h-16 flex items-center justify-center hover:scale-110 transition-transform cursor-pointer -ml-4 -mt-4">
                  <div class="absolute inset-0 rounded-full bg-white/40 animate-ping opacity-70 border-[2px] border-white"></div>
                  <img src="${pogo}" alt="${spawn.species.name}" class="w-[120%] h-[120%] object-contain drop-shadow-[0_5px_10px_rgba(0,0,0,0.5)] z-10" onerror="this.onerror=function(){this.onerror=null;this.src='${basic}'};this.src='${artwork}'" />
                </div>
              `,
              className: 'custom-pokemon-icon',
              iconSize: [64, 64],
            });

            return (
              <Marker
                key={spawn.id}
                position={[spawn.lat, spawn.lng]}
                icon={icon}
                eventHandlers={{ click: () => openEncounter(spawn) }}
              />
            );
          })}
        </MapContainer>
      </div>

      {/* CSS injection for the authentic map filter.
          We filter ONLY the tile layer (not markers) so the land takes on the
          vivid Pokémon GO green while the Pokémon sprites stay crisp and full-color. */}
      <style>{`
        .pogo-map-filter .leaflet-tile-pane {
          filter: sepia(45%) hue-rotate(62deg) saturate(1.7) brightness(1.03) contrast(1.02);
        }
      `}</style>

      {/* The Player Avatar in the center of the screen (Fixed) */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-16 h-16 pointer-events-none z-10">
         <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-12 h-4 bg-black/30 rounded-[100%] blur-sm" />
         <div className="w-full h-full bg-red-500 rounded-full border-[3px] border-white shadow-lg overflow-hidden flex items-center justify-center">
            <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="white" stroke="white" strokeWidth="1"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
         </div>
         {/* Fake GPS Mock Indicator */}
         {isMock && (
           <div className="absolute -top-6 left-1/2 -translate-x-1/2 bg-slate-800/80 text-white text-[10px] px-2 py-0.5 rounded-full whitespace-nowrap border border-white/20 shadow-md">
             Mock GPS
           </div>
         )}
      </div>

      {/* Primary HUD Layer */}
      <HUD onOpenMenu={() => setActiveOverlay('menu')} playerLevel={trainer.level} xpProgress={trainer.progress} />

      {/* Overlays */}
      {activeOverlay === 'menu' && (
        <MainMenu
          onClose={() => setActiveOverlay('none')}
          onOpenPokedex={() => setActiveOverlay('pokedex')}
          onOpenStorage={() => setActiveOverlay('storage')}
          onOpenInventory={() => setActiveOverlay('inventory')}
        />
      )}

      {activeOverlay === 'pokedex' && (
        <PokedexScreen
          onClose={() => setActiveOverlay('menu')}
          owned={collection.owned}
          candies={collection.candies}
          seen={collection.seen}
          onEvolve={collection.evolve}
        />
      )}

      {activeOverlay === 'storage' && (
        <PokemonStorageScreen
          onClose={() => setActiveOverlay('menu')}
          owned={collection.owned}
          candies={collection.candies}
          stardust={collection.stardust}
          onEvolve={collection.evolve}
          onPowerUp={collection.powerUp}
        />
      )}

      {activeOverlay === 'inventory' && (
        <InventoryScreen onClose={() => setActiveOverlay('menu')} />
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
