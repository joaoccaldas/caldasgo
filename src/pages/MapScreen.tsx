import { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import { useGeolocation, Location } from '../hooks/useGeolocation';
import { useSpawning } from '../hooks/useSpawning';
import L from 'leaflet';
import EncounterScreen from '../components/EncounterScreen';
import { SpawnedPokemon } from '../types';

// Fix for default marker icon in Leaflet + Vite
import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';

let DefaultIcon = L.icon({
    iconUrl: icon,
    shadowUrl: iconShadow,
    iconSize: [25, 41],
    iconAnchor: [12, 41]
});

L.Marker.prototype.options.icon = DefaultIcon;

// Custom icon creator for Pokemon
const createPokemonIcon = (imageUrl: string) => {
  return L.divIcon({
    html: `<div class="w-16 h-16 rounded-full bg-slate-800/80 border-2 border-yellow-400 p-1 flex items-center justify-center shadow-lg transform -translate-x-1/2 -translate-y-1/2 animate-bounce"><img src="${imageUrl}" class="w-full h-full object-contain drop-shadow-md" /></div>`,
    className: 'pokemon-marker',
    iconSize: [64, 64],
    iconAnchor: [32, 64], // Anchor at bottom center
  });
};

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
  const [activeEncounter, setActiveEncounter] = useState<SpawnedPokemon | null>(null);

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
          <Marker position={[location.lat, location.lng]}>
            <Popup>You are here!</Popup>
          </Marker>

          {/* Spawned Pokemon */}
          {spawnedPokemon.map((spawn) => (
            <Marker 
              key={spawn.id} 
              position={[spawn.lat, spawn.lng]}
              icon={createPokemonIcon(spawn.pokemonData.image)}
              eventHandlers={{
                click: () => setActiveEncounter(spawn)
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
