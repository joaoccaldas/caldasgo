import { useRef, useState } from 'react';

import HUD from '../components/HUD';
import PerspectiveOverworld from '../components/PerspectiveOverworld';
import MainMenu from '../components/MainMenu';
import EncounterScreen from '../components/EncounterScreen';
import PokedexScreen from '../components/PokedexScreen';
import PokemonStorageScreen from '../components/PokemonStorageScreen';
import InventoryScreen from '../components/InventoryScreen';
import PokestopScreen from '../components/PokestopScreen';
import { useGeolocation, type Location } from '../hooks/useGeolocation';
import { useSpawning } from '../hooks/useSpawning';
import { usePokestops } from '../hooks/usePokestops';
import { useTrainer } from '../hooks/useTrainer';
import { useCollection } from '../hooks/useCollection';
import type { Pokestop, SpawnedPokemon } from '../types';

const MapScreen: React.FC = () => {
  const { location, isMock, setLocation } = useGeolocation();
  const { spawnedPokemon, removeSpawn } = useSpawning(location);
  const { pokestops, spinPokestop, isSpinable } = usePokestops(location);
  const trainer = useTrainer();
  const collection = useCollection();
  const initialLocation = useRef<Location | null>(null);
  const [heading, setHeading] = useState(0);
  const [activeOverlay, setActiveOverlay] = useState<'none' | 'menu' | 'pokedex' | 'storage' | 'inventory'>('none');
  const [encounter, setEncounter] = useState<SpawnedPokemon | null>(null);
  const [activeStop, setActiveStop] = useState<Pokestop | null>(null);

  if (!location) {
    return (
      <div className="relative flex h-[100dvh] w-full flex-col items-center justify-center overflow-hidden bg-[linear-gradient(180deg,#8fd5df,#7ac98d)]">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,255,255,.4),transparent_55%)]" />
        <div className="relative h-24 w-24">
          <div className="absolute inset-0 animate-ping rounded-full border-2 border-white/45" />
          <div className="absolute inset-[13px] animate-spin rounded-full border-[7px] border-white/45 border-t-white" />
          <div className="absolute inset-[33px] rounded-full bg-white shadow-[0_4px_14px_rgba(35,85,90,.25)]" />
        </div>
        <p className="relative mt-5 text-xs font-black uppercase tracking-[0.22em] text-white">Acquiring GPS signal</p>
      </div>
    );
  }

  if (!initialLocation.current) initialLocation.current = location;

  const openEncounter = (spawn: SpawnedPokemon) => {
    collection.recordSeen(spawn.speciesId);
    setEncounter(spawn);
  };

  return (
    <div className="relative h-[100dvh] w-full overflow-hidden bg-[#8fd1d4] font-sans">
      <PerspectiveOverworld
        location={location}
        isMock={isMock}
        setLocation={setLocation}
        pokestops={pokestops}
        spawnedPokemon={spawnedPokemon}
        isSpinable={isSpinable}
        onOpenStop={setActiveStop}
        onOpenPokemon={openEncounter}
        onHeadingChange={setHeading}
      />

      <HUD
        onOpenMenu={() => setActiveOverlay('menu')}
        playerLevel={trainer.level}
        xpProgress={trainer.progress}
        heading={heading}
        isMock={isMock}
        onRecenter={() => {
          if (isMock && initialLocation.current) setLocation(initialLocation.current);
        }}
      />

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
          onToggleFavorite={collection.toggleFavorite}
        />
      )}

      {activeOverlay === 'inventory' && <InventoryScreen onClose={() => setActiveOverlay('menu')} />}

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
