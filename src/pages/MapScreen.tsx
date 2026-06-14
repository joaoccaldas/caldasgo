import { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap, useMapEvents } from 'react-leaflet';
import L from 'leaflet';
import { useGeolocation } from '../hooks/useGeolocation';
import type { Location } from '../hooks/useGeolocation';
import { useSpawning } from '../hooks/useSpawning';
import { usePokestops } from '../hooks/usePokestops';

import EncounterScreen from '../components/EncounterScreen';
import PokestopScreen from '../components/PokestopScreen';
import HUD from '../components/HUD';
import MainMenu from '../components/MainMenu';
import PokedexScreen from './PokedexScreen';
import InventoryScreen from './InventoryScreen';

import type { SpawnedPokemon, Pokestop } from '../types';
import 'leaflet/dist/leaflet.css';

delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
});

const playerIcon = new L.Icon({
  iconUrl: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/poke-ball.png',
  iconSize: [32, 32],
  iconAnchor: [16, 16],
});

const getPokestopIcon = (isSpinable: boolean) => new L.DivIcon({
  className: 'bg-transparent',
  html: `<div style="width: 30px; height: 30px; border-radius: 50%; border: 3px solid white; background-color: ${isSpinable ? '#3b82f6' : '#a855f7'}; box-shadow: 0 0 10px rgba(0,0,0,0.5);"></div>`,
  iconSize: [30, 30],
  iconAnchor: [15, 15]
});

const RecenterMap = ({ location }: { location: Location }) => {
  const map = useMap();
  useEffect(() => {
    map.setView([location.lat, location.lng]);
  }, [location.lat, location.lng, map]);
  return null;
};

// Allows tapping the map to walk when in Mock mode
const MapTapHandler = ({ isMock, setLocation }: { isMock: boolean, setLocation: (l: Location) => void }) => {
  useMapEvents({
    click(e) {
      if (isMock) {
        setLocation({ lat: e.latlng.lat, lng: e.latlng.lng });
      }
    }
  });
  return null;
};

const MapScreen = () => {
  const { location, error, isMock, setLocation } = useGeolocation();
  const { spawnedPokemon, removeSpawn } = useSpawning(location);
  const { pokestops, spinPokestop, isSpinable } = usePokestops(location);
  
  const [activeEncounter, setActiveEncounter] = useState<SpawnedPokemon | null>(null);
  const [activePokestop, setActivePokestop] = useState<Pokestop | null>(null);
  const [activeModal, setActiveModal] = useState<'none' | 'menu' | 'pokedex' | 'inventory'>('none');

  if (error && !location) {
    return (
      <div className="h-full flex items-center justify-center bg-slate-900 text-white p-4 text-center">
        <p className="text-red-400">Error accessing location: {error}</p>
      </div>
    );
  }

  if (!location) {
    return (
      <div className="h-full flex items-center justify-center bg-[#a3e4d7] text-white flex-col space-y-4">
        <div className="w-16 h-16 bg-red-500 rounded-full border-4 border-white animate-bounce shadow-xl flex items-center justify-center relative overflow-hidden">
           <div className="w-full h-1/2 bg-white absolute bottom-0"></div>
           <div className="w-4 h-4 bg-white border-2 border-slate-800 rounded-full z-10"></div>
        </div>
        <p className="animate-pulse text-slate-800 font-bold tracking-widest uppercase">GPS Signal not found...</p>
      </div>
    );
  }

  return (
    <>
      <div className="h-full w-full relative bg-[#a3e4d7]">
        <MapContainer 
          center={[location.lat, location.lng]} 
          zoom={18} 
          zoomControl={false}
          className="h-full w-full z-0"
        >
          {/* Using a cleaner, stylized map tile similar to PoGo */}
          <TileLayer
            attribution='&copy; OpenStreetMap'
            url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager_nolabels/{z}/{x}/{y}{r}.png"
          />
          <RecenterMap location={location} />
          <MapTapHandler isMock={isMock} setLocation={setLocation} />
          
          <Marker position={[location.lat, location.lng]} icon={playerIcon}>
            <Popup>You are here! {isMock && "(Mock Location)"}</Popup>
          </Marker>

          {spawnedPokemon.map(spawn => (
            <Marker 
              key={spawn.id} 
              position={[spawn.lat, spawn.lng]}
              icon={new L.Icon({
                iconUrl: spawn.pokemonData.image,
                iconSize: [64, 64],
                iconAnchor: [32, 32]
              })}
              eventHandlers={{
                click: () => setActiveEncounter(spawn)
              }}
            />
          ))}

          {pokestops.map(stop => (
            <Marker 
              key={stop.id} 
              position={[stop.lat, stop.lng]}
              icon={getPokestopIcon(isSpinable(stop))}
              eventHandlers={{
                click: () => setActivePokestop(stop)
              }}
            />
          ))}
        </MapContainer>

        {isMock && (
          <div className="absolute top-4 left-4 z-[400] bg-red-500 text-white text-xs font-bold px-3 py-1 rounded-full shadow-lg border-2 border-white pointer-events-none">
            GPS Error: Tap map to walk
          </div>
        )}

        {/* The HUD */}
        {activeModal === 'none' && !activeEncounter && !activePokestop && (
          <HUD 
            onOpenMenu={() => setActiveModal('menu')} 
            playerLevel={40} 
          />
        )}
      </div>

      {/* Main Menu Overlay */}
      {activeModal === 'menu' && (
        <MainMenu 
          onClose={() => setActiveModal('none')}
          onOpenPokedex={() => setActiveModal('pokedex')}
          onOpenInventory={() => setActiveModal('inventory')}
        />
      )}

      {/* Full Screen Screens */}
      {activeModal === 'pokedex' && (
        <div className="absolute inset-0 z-[700] bg-slate-900">
           <PokedexScreen onClose={() => setActiveModal('none')} />
        </div>
      )}
      
      {activeModal === 'inventory' && (
        <div className="absolute inset-0 z-[700] bg-slate-900">
           <InventoryScreen onClose={() => setActiveModal('none')} />
        </div>
      )}

      {activePokestop && (
        <PokestopScreen 
          pokestop={activePokestop} 
          isSpinable={isSpinable(activePokestop)}
          onSpin={spinPokestop}
          onClose={() => setActivePokestop(null)} 
        />
      )}

      {activeEncounter && (
        <EncounterScreen 
          spawn={activeEncounter} 
          onClose={() => setActiveEncounter(null)}
          onCaught={() => {
            removeSpawn(activeEncounter.id);
            setActiveEncounter(null);
          }}
        />
      )}
    </>
  );
};

export default MapScreen;
