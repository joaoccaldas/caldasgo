import { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import { useGeolocation, Location } from '../hooks/useGeolocation';
import { useSpawning } from '../hooks/useSpawning';
import { usePokestops } from '../hooks/usePokestops';
import EncounterScreen from '../components/EncounterScreen';
import PokestopScreen from '../components/PokestopScreen';
import { SpawnedPokemon, Pokestop } from '../types';
import 'leaflet/dist/leaflet.css';

// Fix Leaflet's default icon path issues
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
});

// Create custom icons
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



// Component to recenter map when location changes
const RecenterMap = ({ location }: { location: Location }) => {
  const map = useMap();
  useEffect(() => {
    map.setView([location.lat, location.lng]);
  }, [location.lat, location.lng, map]);
  return null;
};

const MapScreen = () => {
  const { location, error } = useGeolocation();
  const { spawnedPokemon, removeSpawn } = useSpawning(location);
  const { pokestops, spinPokestop, isSpinable } = usePokestops(location);
  
  const [activeEncounter, setActiveEncounter] = useState<SpawnedPokemon | null>(null);
  const [activePokestop, setActivePokestop] = useState<Pokestop | null>(null);

  if (error) {
    return (
      <div className="h-full flex items-center justify-center bg-slate-900 text-white p-4 text-center">
        <p className="text-red-400">Error accessing location: {error}</p>
        <p className="text-sm mt-2 text-slate-400">Please enable GPS to play CaldasGo.</p>
      </div>
    );
  }

  if (!location) {
    return (
      <div className="h-full flex items-center justify-center bg-slate-900 text-white flex-col space-y-4">
        <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" />
        <p className="animate-pulse">Locating GPS signal...</p>
      </div>
    );
  }

  return (
    <>
      <div className="h-full w-full relative">
        <MapContainer 
          center={[location.lat, location.lng]} 
          zoom={18} 
          zoomControl={false}
          className="h-full w-full z-0"
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          <RecenterMap location={location} />
          
          {/* Player Marker */}
          <Marker position={[location.lat, location.lng]} icon={playerIcon}>
            <Popup>You are here!</Popup>
          </Marker>

          {/* Spawned Pokemon */}
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

          {/* Pokestops */}
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

        {/* Header Overlay */}
        <div className="absolute top-0 left-0 w-full p-4 z-[400] pointer-events-none">
          <h1 className="text-3xl font-black text-center text-yellow-400 drop-shadow-[0_2px_2px_rgba(0,0,0,0.8)] tracking-wider" style={{ WebkitTextStroke: '1px #3b82f6' }}>
            CaldasGo
          </h1>
        </div>
      </div>

      {/* Render Pokestop Screen */}
      {activePokestop && (
        <PokestopScreen 
          pokestop={activePokestop} 
          isSpinable={isSpinable(activePokestop)}
          onSpin={spinPokestop}
          onClose={() => setActivePokestop(null)} 
        />
      )}

      {/* Render Encounter Screen */}
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
