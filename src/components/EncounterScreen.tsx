import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import type { SpawnedPokemon, OwnedPokemon } from '../types';
import PokemonSprite from './PokemonSprite';
import { useInventory } from '../hooks/useInventory';

// XP awarded for catching a Pokémon, and a bonus the first time a species is caught.
const CATCH_XP = 100;
const NEW_SPECIES_XP = 500;

interface EncounterScreenProps {
  spawn: SpawnedPokemon;
  onClose: () => void;
  onCaught: (pokemon: OwnedPokemon, xpGained: number) => void;
  catchPokemon: (spawn: SpawnedPokemon) => Promise<{ pokemon: OwnedPokemon; isNewSpecies: boolean }>;
  gainXp: (amount: number) => Promise<number>;
}

const EncounterScreen: React.FC<EncounterScreenProps> = ({ spawn, onClose, onCaught, catchPokemon, gainXp }) => {
  const { inventory, consumeItem } = useInventory();
  const [catching, setCatching] = useState(false);
  const [message, setMessage] = useState('');
  const [isCaught, setIsCaught] = useState(false);
  const [berryActive, setBerryActive] = useState(false);
  const [isAttacking, setIsAttacking] = useState(false);
  const [glitchMode, setGlitchMode] = useState<number>(0);
  
  const [throwText, setThrowText] = useState<{text: string, color: string} | null>(null);

  // Chaotic random attacks
  useEffect(() => {
    if (catching || isCaught) return;
    const interval = setInterval(() => {
      if (Math.random() > 0.6) {
        setIsAttacking(true);
        setGlitchMode(Math.floor(Math.random() * 3));
        setTimeout(() => setIsAttacking(false), 1000);
      }
    }, 3000);
    return () => clearInterval(interval);
  }, [catching, isCaught]);

  // Catch Ring State
  const [ringScale, setRingScale] = useState(1);
  useEffect(() => {
    if (catching || isCaught) return;
    const interval = setInterval(() => {
      setRingScale(prev => (prev <= 0.3 ? 1 : prev - 0.05));
    }, 100);
    return () => clearInterval(interval);
  }, [catching, isCaught]);

  const handleUseBerry = async () => {
    if (berryActive || catching) return;
    const success = await consumeItem('razzBerries', 1);
    if (success) {
      setBerryActive(true);
      setMessage(`Razz Berry fed!`);
      setTimeout(() => setMessage(''), 2000);
    }
  };

  const handleCatch = async () => {
    if (catching || isCaught) return;

    const consumed = await consumeItem('pokeballs', 1);
    if (!consumed) {
      setMessage(`Out of Pokéballs!`);
      setTimeout(() => setMessage(''), 2000);
      return;
    }

    setCatching(true);
    setMessage('');

    // Determine Throw Quality based on ringScale at time of click
    let qualityText = 'Nice!';
    let qualityColor = '#ffffff';
    let catchBonus = 0.1;

    if (ringScale < 0.35) {
      qualityText = 'Excellent!';
      qualityColor = '#facc15'; // Gold
      catchBonus = 0.4;
    } else if (ringScale < 0.65) {
      qualityText = 'Great!';
      qualityColor = '#22c55e'; // Green
      catchBonus = 0.2;
    }

    setThrowText({ text: qualityText, color: qualityColor });
    setTimeout(() => setThrowText(null), 2500);

    await new Promise(r => setTimeout(r, 1500));

    const catchRate = Math.min((berryActive ? 0.8 : 0.4) + catchBonus, 0.95);
    const success = Math.random() < catchRate;

    if (success) {
      const { pokemon, isNewSpecies } = await catchPokemon(spawn);
      const xpGained = CATCH_XP + (isNewSpecies ? NEW_SPECIES_XP : 0);
      await gainXp(xpGained);

      setMessage(`Gotcha! ${spawn.species.name} was caught! +${xpGained} XP`);
      setIsCaught(true);

      setTimeout(() => {
        onCaught(pokemon, xpGained);
      }, 2000);
    } else {
      setMessage(`Oh no! The Pokémon broke free!`);
      setTimeout(() => setMessage(''), 2000);
      setCatching(false);
      setBerryActive(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className={`absolute inset-0 z-[800] overflow-hidden flex flex-col transition-all duration-75 ${
        isAttacking ? (glitchMode === 0 ? 'bg-red-500 invert' : glitchMode === 1 ? 'bg-black hue-rotate-180 scale-110 blur-sm' : 'bg-green-500 skew-y-12') : 'bg-sky-100'
      }`}
    >
      {/* 1:1 Authentic Encounter Background */}
      <div className="absolute inset-0 w-full h-full overflow-hidden">
        {/* Sky */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#60c4ff] to-[#c6f0ff]" />
        {/* Clouds */}
        <div className="absolute top-1/4 left-1/4 w-32 h-12 bg-white/50 rounded-full blur-xl" />
        <div className="absolute top-1/3 right-1/4 w-48 h-16 bg-white/40 rounded-full blur-xl" />
        {/* Grass Horizon */}
        <div className="absolute bottom-0 w-[200%] h-[45%] bg-gradient-to-b from-[#8fe45c] to-[#3ca032] rounded-t-[100%] -left-1/2 shadow-[inset_0_10px_20px_rgba(255,255,255,0.3)]">
           {/* Ground texture overlay */}
           <div className="w-full h-full opacity-10 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-black via-transparent to-transparent mix-blend-overlay"></div>
        </div>
      </div>

      {/* Top HUD: Exact Placement */}
      <div className="relative w-full flex justify-between items-start p-5 pt-12 z-10 pointer-events-auto">
        {/* Run Button (Top Left) */}
        <button
          onClick={onClose}
          className="w-10 h-10 bg-slate-800/50 backdrop-blur rounded-full flex items-center justify-center text-white border border-white/30 shadow-sm active:scale-95 transition-transform"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M13 14h-3"/><path d="M13 10h-3"/><path d="M10 14v4"/><path d="M10 10V6"/><path d="M14 6h3a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2h-3"/><path d="M6 10h2"/><path d="M6 14h2"/></svg>
        </button>

        {/* AR Toggle (Top Right) */}
        <div className="flex gap-2">
           <div className="h-8 px-3 bg-slate-800/50 backdrop-blur rounded-full flex items-center text-white text-xs font-bold border border-white/30 shadow-sm">
             AR
           </div>
        </div>
      </div>

      {/* Center Action */}
      <div className="flex-1 flex flex-col items-center justify-center w-full relative z-10 -mt-10">

        {/* CP Arch */}
        {!isCaught && (
          <div className="absolute top-0 flex flex-col items-center">
            <svg width="240" height="120" viewBox="0 0 240 120" className="absolute top-0 opacity-60">
               <path d="M 20 120 A 100 100 0 0 1 220 120" fill="none" stroke="white" strokeWidth="3" />
               <circle cx="120" cy="20" r="4" fill="white" />
            </svg>
            <div className="bg-slate-800/60 backdrop-blur px-5 py-1 rounded-full border border-slate-500/50 shadow-md mt-6">
              <span className="text-white font-black tracking-wider text-xl drop-shadow-md">
                CP {spawn.cp}
              </span>
            </div>
          </div>
        )}

        <AnimatePresence>
          {!isCaught && (
            <motion.div
              key="pokemon"
              initial={{ scale: 0.5, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0, opacity: 0 }}
              className="relative w-64 h-64 flex items-center justify-center mt-12"
            >
              {/* Fake Ground Shadow */}
              <div className="absolute bottom-2 w-40 h-10 bg-black/30 rounded-[100%] blur-md"></div>

              <motion.div
                animate={{ 
                  translateY: isAttacking ? [-50, 50, -50] : [-10, 10],
                  scale: isAttacking ? [1, 2, 0.5, 1] : 1,
                  rotate: isAttacking ? [0, 180, 360] : 0,
                }}
                transition={{ repeat: Infinity, duration: isAttacking ? 0.2 : 2, repeatType: "mirror", ease: "easeInOut" }}
                className="w-[120%] h-[120%] z-10"
              >
                <PokemonSprite
                  id={isAttacking && glitchMode === 2 ? 5 : spawn.speciesId} // Occasionally turns into MissingNo
                  name={spawn.species.name}
                  variant="artwork"
                  className={`w-full h-full object-contain drop-shadow-2xl ${isAttacking ? 'mix-blend-exclusion' : ''}`}
                />
              </motion.div>

              {/* The Catch Ring! */}
              {!catching && (
                 <div className="absolute w-[80%] h-[80%] flex items-center justify-center z-20 pointer-events-none">
                    {/* Outer White Ring */}
                    <div className="absolute w-full h-full rounded-full border-[3px] border-white/60" />
                    {/* Inner Colored Shrinking Ring */}
                    <div
                      className="absolute rounded-full border-[3px] border-green-500/80 shadow-[0_0_8px_rgba(34,197,94,0.5)]"
                      style={{
                        width: `${ringScale * 100}%`,
                        height: `${ringScale * 100}%`,
                        borderColor: ringScale < 0.35 ? '#facc15' : ringScale < 0.65 ? '#22c55e' : '#ffffff',
                        boxShadow: `0 0 8px ${ringScale < 0.35 ? 'rgba(250,204,21,0.5)' : ringScale < 0.65 ? 'rgba(34,197,94,0.5)' : 'rgba(255,255,255,0.5)'}`
                      }}
                    />
                 </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Throw Quality Text pop-up */}
        <AnimatePresence>
          {throwText && (
            <motion.div
              initial={{ scale: 0.5, opacity: 0, y: 10 }}
              animate={{ scale: 1, opacity: 1, y: -20 }}
              exit={{ scale: 1.1, opacity: 0 }}
              className="absolute z-50 pointer-events-none drop-shadow-md"
              style={{ top: '35%' }}
            >
              <span className="font-black text-3xl tracking-widest uppercase font-sans" style={{ color: throwText.color, WebkitTextStroke: '1px rgba(0,0,0,0.8)' }}>
                {throwText.text}
              </span>
            </motion.div>
          )}
        </AnimatePresence>

        {catching && (
          <motion.div
            initial={{ y: 200, scale: 0 }}
            animate={{ y: isCaught ? 0 : [0, -50, 0], scale: 1, rotate: isCaught ? [0, 10, -10, 0] : 0 }}
            transition={{ duration: 0.5 }}
            className={`w-20 h-20 rounded-full bg-[#ef4444] border-[4px] border-slate-800 shadow-[0_10px_30px_rgba(0,0,0,0.8)] absolute flex items-center justify-center overflow-hidden z-30 ${isCaught ? 'bg-red-600' : ''}`}
          >
            <div className="w-full h-1/2 bg-white absolute bottom-0 border-t-[4px] border-slate-800" />
            <div className="w-7 h-7 bg-white rounded-full absolute border-[4px] border-slate-800 flex items-center justify-center">
                <div className={`w-3 h-3 rounded-full ${isCaught ? 'bg-red-500 animate-pulse' : 'bg-white border border-slate-300 shadow-inner'}`} />
            </div>
            <div className="absolute top-1 right-2 w-4 h-2 bg-white/30 rounded-full rotate-45" />
          </motion.div>
        )}
      </div>

      {/* Message Box */}
      {message && (
        <div className="absolute bottom-[140px] w-full px-12 z-20 pointer-events-none">
          <div className="bg-slate-800/90 backdrop-blur rounded-full py-2 px-4 shadow-xl border border-slate-600/50 text-center">
            <p className="text-sm font-bold text-white tracking-wide">{message}</p>
          </div>
        </div>
      )}

      {/* Bottom Controls: Exact Placement */}
      <div className="absolute bottom-0 w-full h-[140px] z-10 pointer-events-none">
        {!isCaught && (
          <>
            {/* Berry Selector (Bottom Left) */}
            <div className="absolute left-6 bottom-8 pointer-events-auto flex flex-col items-center">
              <button
                onClick={handleUseBerry}
                disabled={catching || berryActive || inventory.razzBerries === 0}
                className={`w-14 h-14 rounded-full flex flex-col items-center justify-center transition-all ${
                  catching || berryActive || inventory.razzBerries === 0
                    ? 'bg-slate-900/60 grayscale opacity-50 border-2 border-white/30'
                    : 'bg-slate-900/60 border-2 border-white/50 hover:scale-105 active:scale-95 backdrop-blur-md shadow-lg'
                }`}
              >
                <div className="relative flex items-center justify-center w-full h-full">
                   <img src="https://cdn.jsdelivr.net/gh/PokeAPI/sprites@master/sprites/items/razz-berry.png" alt="Razz Berry" className="w-9 h-9 object-contain drop-shadow-md" />
                   <div className="absolute top-0 right-0 bg-white text-slate-800 text-[10px] font-black px-1.5 py-0.5 leading-none rounded-full shadow-sm">{inventory.razzBerries}</div>
                </div>
              </button>
            </div>

            {/* Throw Pokeball (Bottom Center) */}
            <div className="absolute left-1/2 -translate-x-1/2 bottom-8 pointer-events-auto flex flex-col items-center">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleCatch}
                disabled={catching}
                className={`w-24 h-24 rounded-full shadow-[0_10px_30px_rgba(0,0,0,0.5)] relative overflow-hidden flex items-center justify-center ${catching ? 'opacity-50 cursor-not-allowed' : 'bg-[#ef4444] border-[4px] border-slate-800'}`}
              >
                {!catching && (
                  <>
                    <div className="w-full h-1/2 bg-white absolute bottom-0 border-t-[4px] border-slate-800" />
                    <div className="w-9 h-9 bg-white rounded-full absolute border-[4px] border-slate-800 flex items-center justify-center shadow-inner">
                       <div className="w-4 h-4 bg-white rounded-full border-2 border-slate-300 shadow-inner" />
                    </div>
                    <div className="absolute top-1 right-2 w-5 h-2.5 bg-white/30 rounded-full rotate-45" />
                  </>
                )}
              </motion.button>
              <div className="mt-1 bg-slate-800/80 px-3 py-0.5 rounded-full text-white text-[10px] font-bold tracking-widest border border-slate-600">
                {inventory.pokeballs}
              </div>
            </div>

            {/* Ball Selector (Bottom Right) */}
            <div className="absolute right-6 bottom-8 pointer-events-auto flex flex-col items-center">
              <div className="w-14 h-14 rounded-full bg-slate-900/60 backdrop-blur-md shadow-lg border-2 border-white/50 flex items-center justify-center cursor-pointer hover:scale-105 active:scale-95 transition-transform relative">
                <img src="https://cdn.jsdelivr.net/gh/PokeAPI/sprites@master/sprites/items/poke-ball.png" alt="Pokeball" className="w-10 h-10 object-contain drop-shadow-md" />
                <div className="absolute top-0 right-0 bg-white text-slate-800 text-[10px] font-black px-1.5 py-0.5 leading-none rounded-full shadow-sm z-10">{inventory.pokeballs}</div>
              </div>
            </div>
          </>
        )}
      </div>
    </motion.div>
  );
};

export default EncounterScreen;

