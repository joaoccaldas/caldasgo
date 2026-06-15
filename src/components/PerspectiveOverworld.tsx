import { useEffect, useMemo, useRef, useState, type MouseEvent as ReactMouseEvent } from 'react';
import TrainerAvatar from './TrainerAvatar';
import PerspectiveTerrain from './PerspectiveTerrain';
import { getPogoSprite, getPokemonImage } from '../data/pokemonDatabase';
import type { Location } from '../hooks/useGeolocation';
import type { Pokestop, SpawnedPokemon } from '../types';

const METERS_PER_DEGREE_LATITUDE = 111_320;
const clamp = (minimum: number, value: number, maximum: number) => Math.min(maximum, Math.max(minimum, value));

interface PerspectiveOverworldProps {
  location: Location;
  isMock: boolean;
  setLocation: (location: Location) => void;
  pokestops: Pokestop[];
  spawnedPokemon: SpawnedPokemon[];
  isSpinable: (stop: Pokestop) => boolean;
  onOpenStop: (stop: Pokestop) => void;
  onOpenPokemon: (spawn: SpawnedPokemon) => void;
  onHeadingChange?: (heading: number) => void;
}

interface ProjectedPoint {
  x: number;
  y: number;
  scale: number;
  opacity: number;
  visible: boolean;
  depth: number;
}

const relativeMeters = (point: Location, center: Location) => {
  const latitudeRadians = center.lat * Math.PI / 180;
  return {
    north: (point.lat - center.lat) * METERS_PER_DEGREE_LATITUDE,
    east: (point.lng - center.lng) * METERS_PER_DEGREE_LATITUDE * Math.cos(latitudeRadians),
  };
};

const projectPoint = (point: Location, center: Location, width: number, height: number): ProjectedPoint => {
  const { north, east } = relativeMeters(point, center);
  const playerY = height * 0.615;
  const horizonY = height * 0.165;
  const depth = clamp(0.42, 1 - north / 330, 1.48);
  const x = width / 2 + east * 1.62 * depth;
  const y = playerY - (north / 255) * (playerY - horizonY);
  const scale = clamp(0.55, 1.08 - north / 285, 1.43);
  const edgeFade = clamp(0, 1 - Math.max(0, Math.abs(east) - 145) / 70, 1);
  const distanceFade = clamp(0, 1 - Math.max(0, Math.abs(north) - 205) / 75, 1);
  return { x, y, scale, opacity: Math.min(edgeFade, distanceFade), visible: x > -100 && x < width + 100 && y > horizonY - 90 && y < height + 120, depth };
};

const headingBetween = (from: Location, to: Location) => {
  const latitudeRadians = from.lat * Math.PI / 180;
  const north = (to.lat - from.lat) * METERS_PER_DEGREE_LATITUDE;
  const east = (to.lng - from.lng) * METERS_PER_DEGREE_LATITUDE * Math.cos(latitudeRadians);
  return (Math.atan2(east, north) * 180 / Math.PI + 360) % 360;
};

const distanceBetween = (from: Location, to: Location) => {
  const { north, east } = relativeMeters(to, from);
  return Math.sqrt(north * north + east * east);
};

const PerspectiveOverworld: React.FC<PerspectiveOverworldProps> = ({
  location,
  isMock,
  setLocation,
  pokestops,
  spawnedPokemon,
  isSpinable,
  onOpenStop,
  onOpenPokemon,
  onHeadingChange,
}) => {
  const [viewport, setViewport] = useState(() => ({ width: window.innerWidth, height: window.innerHeight }));
  const [heading, setHeading] = useState(0);
  const [isWalking, setIsWalking] = useState(false);
  const previousLocation = useRef<Location | null>(null);

  useEffect(() => {
    const update = () => setViewport({ width: window.innerWidth, height: window.innerHeight });
    window.addEventListener('resize', update, { passive: true });
    return () => window.removeEventListener('resize', update);
  }, []);

  useEffect(() => {
    const previous = previousLocation.current;
    previousLocation.current = location;
    if (!previous || distanceBetween(previous, location) < 0.45) return;
    const nextHeading = headingBetween(previous, location);
    setHeading(nextHeading);
    onHeadingChange?.(nextHeading);
    setIsWalking(true);
    const timer = window.setTimeout(() => setIsWalking(false), 720);
    return () => window.clearTimeout(timer);
  }, [location, onHeadingChange]);

  const stops = useMemo(() => pokestops.map((stop) => ({ stop, point: projectPoint(stop, location, viewport.width, viewport.height) })), [location, pokestops, viewport]);
  const pokemon = useMemo(() => spawnedPokemon.map((spawn) => ({ spawn, point: projectPoint(spawn, location, viewport.width, viewport.height) })), [location, spawnedPokemon, viewport]);

  const handleWalk = (event: ReactMouseEvent<HTMLDivElement>) => {
    if (!isMock) return;
    const bounds = event.currentTarget.getBoundingClientRect();
    const x = event.clientX - bounds.left;
    const y = event.clientY - bounds.top;
    const playerY = bounds.height * 0.615;
    const horizonY = bounds.height * 0.165;
    const north = clamp(-135, ((playerY - y) / Math.max(1, playerY - horizonY)) * 255, 175);
    const depth = clamp(0.52, 1 - north / 330, 1.42);
    const east = clamp(-145, (x - bounds.width / 2) / (1.62 * depth), 145);
    const latitudeRadians = location.lat * Math.PI / 180;
    setLocation({
      lat: location.lat + north / METERS_PER_DEGREE_LATITUDE,
      lng: location.lng + east / (METERS_PER_DEGREE_LATITUDE * Math.cos(latitudeRadians)),
    });
  };

  return (
    <div className="absolute inset-0 z-0 cursor-crosshair" onClick={handleWalk} role="presentation">
      <PerspectiveTerrain location={location} />

      <div className="pointer-events-none absolute inset-0 z-10">
        {stops.map(({ stop, point }) => point.visible && (
          <button
            key={stop.id}
            type="button"
            onClick={(event) => { event.stopPropagation(); onOpenStop(stop); }}
            aria-label="Open PokéStop"
            className="pointer-events-auto absolute h-[112px] w-[78px] active:scale-95"
            style={{ left: point.x, top: point.y + 24, opacity: point.opacity, transform: `translate(-50%, -100%) scale(${point.scale})`, transformOrigin: '50% 100%', zIndex: Math.round(180 + point.depth * 40) }}
          >
            <span className="absolute bottom-[3px] left-1/2 h-[12px] w-[52px] -translate-x-1/2 rounded-[50%] bg-[#184b52]/25 blur-[2px]" />
            {isSpinable(stop) && <span className="pokestop-beacon absolute bottom-[16px] left-1/2 h-[54px] w-[54px] -translate-x-1/2 rounded-full border-2 border-[#73dfff]/55" />}
            <svg viewBox="0 0 80 118" className={`relative h-full w-full overflow-visible drop-shadow-[0_7px_7px_rgba(27,65,72,.28)] ${isSpinable(stop) ? '' : 'grayscale opacity-70'}`} aria-hidden="true">
              <path d="M36 51h8v50h-8Z" fill="#2baed1" /><path d="M24 96h32l11 14H13Z" fill="#1b80a9" /><path d="M17 107h46l8 6H9Z" fill="#176783" />
              <path d="m40 13 21 12-21 12-21-12Z" fill="#c9f8ff" /><path d="m19 25 21 12v25L19 50Z" fill="#4bc9e7" /><path d="m61 25-21 12v25l21-12Z" fill="#188ec6" />
              <circle cx="40" cy="49" r="19" fill="none" stroke="#75dcf3" strokeWidth="3" opacity=".4" />
            </svg>
          </button>
        ))}

        {pokemon.map(({ spawn, point }) => {
          if (!point.visible) return null;
          const artwork = getPokemonImage(spawn.speciesId);
          const basic = `https://cdn.jsdelivr.net/gh/PokeAPI/sprites@master/sprites/pokemon/${spawn.speciesId}.png`;
          return (
            <button
              key={spawn.id}
              type="button"
              onClick={(event) => { event.stopPropagation(); onOpenPokemon(spawn); }}
              aria-label={`Encounter ${spawn.species.name}`}
              className="pointer-events-auto absolute h-[94px] w-[94px] active:scale-95"
              style={{ left: point.x, top: point.y + 22, opacity: point.opacity, transform: `translate(-50%, -100%) scale(${point.scale})`, transformOrigin: '50% 100%', zIndex: Math.round(205 + point.depth * 45) }}
            >
              <span className="absolute bottom-[4px] left-1/2 h-[13px] w-[58px] -translate-x-1/2 rounded-[50%] bg-[#153f45]/28 blur-[2px]" />
              <span className="pokemon-ground-ring absolute bottom-[1px] left-1/2 h-[52px] w-[74px] -translate-x-1/2 rounded-[50%] border-2 border-white/75 bg-white/12" />
              <img
                src={getPogoSprite(spawn.speciesId)}
                alt={spawn.species.name}
                draggable={false}
                className="pokemon-float relative z-10 h-[88px] w-[88px] object-contain drop-shadow-[0_7px_7px_rgba(20,58,64,.34)]"
                onError={(event) => {
                  const image = event.currentTarget;
                  if (!image.dataset.fallback) { image.dataset.fallback = 'artwork'; image.src = artwork; }
                  else if (image.dataset.fallback === 'artwork') { image.dataset.fallback = 'basic'; image.src = basic; }
                }}
              />
            </button>
          );
        })}
      </div>

      <div className="pointer-events-none absolute left-1/2 top-[61.5%] z-[300] -translate-x-1/2 -translate-y-[78%]">
        <TrainerAvatar heading={heading} isWalking={isWalking} isMock={isMock} />
      </div>

      <style>{`
        .pokemon-float { animation: map-pokemon-float 2.15s ease-in-out infinite; }
        .pokemon-ground-ring { animation: map-pokemon-ring 2.15s ease-out infinite; }
        .pokestop-beacon { animation: map-stop-beacon 2.05s ease-out infinite; }
        .map-cloud-shadow { animation: map-cloud-drift 16s ease-in-out infinite alternate; }
        @keyframes map-pokemon-float { 0%,100% { transform: translateY(0) rotate(-.6deg); } 50% { transform: translateY(-7px) rotate(.6deg); } }
        @keyframes map-pokemon-ring { 0% { opacity: .72; transform: translateX(-50%) scale(.55); } 78%,100% { opacity: 0; transform: translateX(-50%) scale(1.15); } }
        @keyframes map-stop-beacon { 0% { opacity: .75; transform: translateX(-50%) scale(.58); } 80%,100% { opacity: 0; transform: translateX(-50%) scale(1.25); } }
        @keyframes map-cloud-drift { from { transform: translateX(-8%) rotate(-4deg); } to { transform: translateX(115%) rotate(3deg); } }
      `}</style>
    </div>
  );
};

export default PerspectiveOverworld;
