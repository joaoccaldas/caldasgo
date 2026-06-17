import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { getSpecies, getTypeIcon, TYPE_COLORS } from '../data/pokemonDatabase';
import { getMoveset, getAppraisal } from '../data/moves';
import { calculateHP, powerUpCost, MAX_LEVEL } from '../data/cpTable';
import PokemonSprite from './PokemonSprite';
import ScreenHeader from './ScreenHeader';
import type { CandyBag, OwnedPokemon } from '../types';

interface PokemonStorageScreenProps {
  onClose: () => void;
  owned: OwnedPokemon[];
  candies: CandyBag;
  stardust: number;
  onEvolve: (uid: string, toSpeciesId: number, candyCost: number) => Promise<boolean>;
  onPowerUp: (uid: string) => Promise<boolean>;
  onToggleFavorite: (uid: string) => Promise<void>;
}

// The real game marks a favorited Pokémon with a gold star, both in the
// storage grid and on the detail screen.
const StarIcon: React.FC<{ filled: boolean; className?: string }> = ({ filled, className }) => (
  <svg viewBox="0 0 24 24" className={className} aria-hidden="true">
    <path
      d="M12 2l2.9 6.3 6.9.7-5.2 4.6 1.5 6.8L12 17.6 5.9 20.4l1.5-6.8L2.2 9l6.9-.7z"
      fill={filled ? '#f6a821' : 'none'}
      stroke={filled ? '#e08a10' : '#cbd5e1'}
      strokeWidth="1.5"
    />
  </svg>
);

const CANDY_ICON = 'https://cdn.jsdelivr.net/gh/PokeMiners/pogo_assets@master/Images/Items/pokemon_details_candy.png';

// Stardust is a glowing teal four-point sparkle in the real game.
const StardustIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg viewBox="0 0 24 24" className={className} aria-hidden="true">
    <path d="M12 1l2.2 7.4L21 11l-6.8 2.6L12 21l-2.2-7.4L3 11l6.8-2.6z" fill="#2dd4bf" stroke="#0d9488" strokeWidth="0.8" />
  </svg>
);

type SortKey = 'recent' | 'cp' | 'name' | 'number';

const SORTS: { key: SortKey; label: string }[] = [
  { key: 'recent', label: 'Recent' },
  { key: 'cp', label: 'CP' },
  { key: 'name', label: 'Name' },
  { key: 'number', label: 'Number' },
];

// Real Pokémon GO starts trainers with 300 storage; we mirror that cap for the header.
const STORAGE_CAP = 300;

const ivPercent = (ivs: OwnedPokemon['ivs']) =>
  Math.round(((ivs.attack + ivs.defense + ivs.stamina) / 45) * 100);

const PokemonStorageScreen: React.FC<PokemonStorageScreenProps> = ({ onClose, owned, candies, stardust, onEvolve, onPowerUp, onToggleFavorite }) => {
  const [sortKey, setSortKey] = useState<SortKey>('recent');
  const [selectedUid, setSelectedUid] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  const sorted = useMemo(() => {
    let list = [...owned];
    if (searchQuery.trim() !== '') {
      const q = searchQuery.toLowerCase();
      list = list.filter(p => {
         const s = getSpecies(p.speciesId);
         if (!s) return false;
         if (!isNaN(Number(q))) return s.id.toString().includes(q);
         return s.name.toLowerCase().includes(q);
      });
    }

    switch (sortKey) {
      case 'cp':
        list.sort((a, b) => {
          if (b.cp !== a.cp) return b.cp - a.cp;
          return (getSpecies(a.speciesId)?.name || '').localeCompare(getSpecies(b.speciesId)?.name || '');
        });
        break;
      case 'name':
        list.sort((a, b) => {
          const cmp = (getSpecies(a.speciesId)?.name || '').localeCompare(getSpecies(b.speciesId)?.name || '');
          if (cmp !== 0) return cmp;
          return b.cp - a.cp;
        });
        break;
      case 'number':
        list.sort((a, b) => {
          if (a.speciesId !== b.speciesId) return a.speciesId - b.speciesId;
          return b.cp - a.cp;
        });
        break;
      case 'recent':
      default:
        list.sort((a, b) => b.caughtAt - a.caughtAt);
        break;
    }
    return list;
  }, [owned, sortKey, searchQuery]);

  const selected = selectedUid ? owned.find(p => p.uid === selectedUid) : undefined;
  const selectedSpecies = selected ? getSpecies(selected.speciesId) : undefined;

  const handleEvolve = async (toSpeciesId: number, candyCost: number) => {
    if (!selected) return;
    await onEvolve(selected.uid, toSpeciesId, candyCost);
    // The uid stays the same after evolution, so the detail view just re-renders with the new species.
  };

  const handlePowerUp = async () => {
    if (!selected) return;
    await onPowerUp(selected.uid);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 50 }}
      className="absolute inset-0 z-[700] bg-[#f8fafc] flex flex-col font-sans overflow-hidden"
    >
      {/* Unified Pokémon GO header */}
      <ScreenHeader title="POKÉMON" rightLabel={`${owned.length}/${STORAGE_CAP}`} />

      {/* Sort Bar */}
      <div className="flex flex-col bg-white border-b-2 border-slate-200 shadow-sm relative z-10 shrink-0">
        <div className="flex items-center px-4 py-2 border-b border-slate-100">
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#94a3b8" strokeWidth="2.5"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>
          <input
            type="text"
            placeholder="Search Pokémon"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="flex-1 bg-transparent outline-none ml-2 text-slate-700 placeholder-slate-400 font-bold text-sm"
          />
          {searchQuery && (
             <button onClick={() => setSearchQuery('')} className="text-slate-400 p-1 active:scale-95">
               <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
             </button>
          )}
        </div>
        <div className="flex items-center gap-2 px-3 py-2 overflow-x-auto">
          <span className="text-slate-400 text-[11px] font-bold uppercase tracking-wider shrink-0">Sort</span>
          {SORTS.map(s => (
            <button
              key={s.key}
              onClick={() => setSortKey(s.key)}
              className={`px-3 py-1 rounded-full text-xs font-bold tracking-wide whitespace-nowrap transition-colors ${
                sortKey === s.key ? 'bg-[#1b6e7e] text-white shadow-sm' : 'bg-slate-100 text-slate-500'
              }`}
            >
              {s.label}
            </button>
          ))}
        </div>
      </div>

      {/* Grid */}
      <div className="flex-1 overflow-y-auto px-2 pt-2 pb-24">
        {owned.length === 0 ? (
          <div className="py-16 text-center text-slate-400 font-medium px-8">
            You haven't caught any Pokémon yet. Tap one on the map to start your collection!
          </div>
        ) : (
          <div className="grid grid-cols-3 gap-2">
            {sorted.map(p => {
              const species = getSpecies(p.speciesId);
              if (!species) return null;
              return (
                <button
                  key={p.uid}
                  onClick={() => setSelectedUid(p.uid)}
                  style={{ 
                    background: `linear-gradient(135deg, ${TYPE_COLORS[species.types[0]]} 0%, #ffffff 50%, ${TYPE_COLORS[species.types[0]]} 100%)`,
                    border: '4px solid #FDE047',
                    boxShadow: 'inset 0 0 10px rgba(255,255,255,0.8), 0 4px 6px rgba(0,0,0,0.3)',
                  }}
                  className="relative aspect-[3/4] rounded-sm flex flex-col items-center overflow-hidden active:scale-95 transition-transform p-1"
                >
                  <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/holographic.png')] opacity-30 mix-blend-color-burn pointer-events-none" />
                  {p.favorite && (
                    <StarIcon filled className="absolute top-1 right-1 w-3.5 h-3.5 drop-shadow-sm z-10" />
                  )}
                  {/* CP on its own top strip so it never collides with the sprite */}
                  <div className="w-full bg-black/80 text-white font-mono text-[9px] px-1 py-0.5 flex justify-between tracking-tighter border-b-2 border-yellow-300 z-10">
                    <span>{species.name.toUpperCase()}</span>
                    <span className="text-red-400">HP {Math.floor(p.cp / 10)}</span>
                  </div>
                  <div className="flex-1 min-h-0 w-full flex items-center justify-center relative">
                    {p.isShiny && (
                      <div className="absolute inset-0 flex items-center justify-center overflow-hidden pointer-events-none opacity-40">
                         <div className="w-[150%] h-[150%] bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-amber-200/50 via-transparent to-transparent animate-[spin_6s_linear_infinite]" />
                      </div>
                    )}
                    <PokemonSprite
                      id={species.id}
                      name={species.name}
                      shiny={!!p.isShiny}
                      className="max-h-[80%] max-w-[90%] object-cover border-2 border-slate-800 relative z-10 bg-white"
                    />
                  </div>
                  <div className="w-full px-2 pb-1 pt-0.5">
                    <div className="w-full h-1 bg-slate-200 rounded-full overflow-hidden">
                      <div className="h-full bg-[#5fd35f]" style={{ width: '100%' }} />
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        )}
      </div>

      {/* Close Button */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-20">
        <motion.button
          whileTap={{ scale: 0.9 }}
          onClick={onClose}
          className="w-[72px] h-[72px] flex items-center justify-center bg-transparent border-none"
        >
          <img
            src="https://cdn.jsdelivr.net/gh/PokeMiners/pogo_assets@master/Images/Menu%20Icons/btn_close_normal.png"
            alt="Close"
            className="w-full h-full object-contain drop-shadow-lg"
            onError={(e) => { e.currentTarget.style.display = 'none'; }}
          />
        </motion.button>
      </div>

      {/* Individual Detail View */}
      <AnimatePresence>
        {selected && selectedSpecies && (
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'tween', duration: 0.2 }}
            className="absolute inset-0 bg-white z-50 flex flex-col font-sans overflow-y-auto"
          >
            <div
              className="absolute inset-0 opacity-20 z-0"
              style={{ background: `linear-gradient(to bottom, ${TYPE_COLORS[selectedSpecies.types[0]]} 0%, white 50%)` }}
            />

            {/* Top Nav */}
            <div className="w-full flex justify-between items-center p-4 z-10 pt-12">
              <button onClick={() => setSelectedUid(null)} className="w-10 h-10 flex items-center justify-center text-slate-500 active:bg-slate-100 rounded-full">
                <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="m15 18-6-6 6-6"/></svg>
              </button>
              <span className="text-slate-400 font-black text-sm tracking-widest">#{selectedSpecies.id.toString().padStart(3, '0')}</span>
              <button
                onClick={() => onToggleFavorite(selected.uid)}
                className="w-10 h-10 flex items-center justify-center active:bg-slate-100 rounded-full"
                aria-label={selected.favorite ? 'Remove favorite' : 'Mark as favorite'}
              >
                <StarIcon filled={!!selected.favorite} className="w-7 h-7" />
              </button>
            </div>

            {/* CP Arc */}
            <div className="w-full flex justify-center mt-6 z-10 relative">
               <div className="flex flex-col items-center relative w-full">
                  <div className="absolute -top-4 text-center">
                    <span className="text-white font-black tracking-widest text-2xl drop-shadow-md">
                      CP <span className="text-3xl font-display">{selected.cp}</span>
                    </span>
                  </div>
                  <svg width="280" height="140" viewBox="0 0 280 140" className="absolute top-6 opacity-80">
                     <path d="M 20 140 A 120 120 0 0 1 260 140" fill="none" stroke="white" strokeWidth="4" />
                     {/* Dynamic dot position based on level (simplified to roughly 50% for visual fidelity) */}
                     <circle cx="140" cy="20" r="5" fill="white" />
                  </svg>
               </div>
            </div>

            {/* Sprite */}
            <motion.div
              animate={{ y: [-5, 5] }}
              transition={{ repeat: Infinity, duration: 4, repeatType: 'mirror', ease: 'easeInOut' }}
              className="w-full h-[28vh] flex items-center justify-center relative z-10"
            >
              {selected.isShiny && (
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-50 z-0 mix-blend-screen">
                   <div className="w-[200%] h-[200%] bg-[radial-gradient(circle_at_center,_#fef08a_0%,_transparent_60%)] animate-pulse" />
                </div>
              )}
              <PokemonSprite
                id={selectedSpecies.id}
                name={selectedSpecies.name}
                shiny={!!selected.isShiny}
                className="w-[65%] h-full object-contain drop-shadow-2xl relative z-10"
              />
            </motion.div>

            {/* Info Sheet */}
            <div className="w-full flex flex-col items-center z-10 mt-2 flex-1 bg-white pt-4 shadow-[0_-10px_20px_rgba(0,0,0,0.05)] rounded-t-[2.5rem] pb-8">
              {/* HP bar */}
              {(() => {
                const hp = calculateHP(selectedSpecies.baseStats.stamina, selected.level, selected.ivs.stamina);
                return (
                  <div className="w-full px-12 flex flex-col items-center mb-1">
                    <div className="w-full h-1.5 bg-slate-200 rounded-full overflow-hidden shadow-inner border border-slate-300/50">
                      <div className="h-full bg-[#5fd35f] rounded-full" style={{ width: '100%' }} />
                    </div>
                    <span className="text-slate-500 font-bold text-[11px] mt-1">{hp} / {hp} HP</span>
                  </div>
                );
              })()}

              <h2 className="text-[28px] font-black text-slate-800 tracking-wide uppercase mt-1 mb-1">
                {selected.isShiny && <span className="text-amber-500 mr-2 text-xl drop-shadow-sm align-middle">✨</span>}
                {selectedSpecies.name}
              </h2>

              <div className="text-slate-500 font-bold text-sm mb-2">
                Level {selected.level} &middot; IV {ivPercent(selected.ivs)}%
              </div>

              {/* Appraisal stars (real game rates a Pokémon's IVs out of 3 stars) */}
              {(() => {
                const appraisal = getAppraisal(ivPercent(selected.ivs));
                return (
                  <div className="flex items-center gap-1 mb-4">
                    {[0, 1, 2].map(i => (
                      <svg key={i} viewBox="0 0 24 24" className="w-5 h-5" aria-hidden="true">
                        <path
                          d="M12 2l2.9 6.3 6.9.7-5.2 4.6 1.5 6.8L12 17.6 5.9 20.4l1.5-6.8L2.2 9l6.9-.7z"
                          fill={i < appraisal.stars ? '#f6a821' : '#e2e8f0'}
                          stroke={i < appraisal.stars ? '#e08a10' : '#cbd5e1'}
                          strokeWidth="0.6"
                        />
                      </svg>
                    ))}
                    <span className="ml-1 text-slate-500 font-bold text-xs uppercase tracking-wider">{appraisal.label}</span>
                  </div>
                );
              })()}

              {/* IV breakdown */}
              <div className="w-full px-8 flex justify-center gap-8 mb-6 text-center">
                <div className="flex flex-col items-center">
                  <span className="text-lg font-black text-slate-800">{selected.ivs.attack}/15</span>
                  <span className="text-[10px] font-bold text-slate-400 tracking-wider">ATTACK</span>
                </div>
                <div className="flex flex-col items-center">
                  <span className="text-lg font-black text-slate-800">{selected.ivs.defense}/15</span>
                  <span className="text-[10px] font-bold text-slate-400 tracking-wider">DEFENSE</span>
                </div>
                <div className="flex flex-col items-center">
                  <span className="text-lg font-black text-slate-800">{selected.ivs.stamina}/15</span>
                  <span className="text-[10px] font-bold text-slate-400 tracking-wider">STAMINA</span>
                </div>
              </div>

              {/* Weight / Types / Height */}
              <div className="w-full px-8 flex justify-between items-center mb-6">
                <div className="flex flex-col items-center flex-1 border-r border-slate-200">
                  <span className="text-lg font-black text-slate-800">{selectedSpecies.weightKg} <span className="text-xs">kg</span></span>
                  <span className="text-[10px] font-bold text-slate-400 tracking-wider mt-1">WEIGHT</span>
                </div>
                <div className="flex flex-col items-center flex-1 gap-1">
                  <div className="flex gap-1.5 justify-center flex-wrap">
                    {selectedSpecies.types.map(t => (
                      <div key={t} className="flex items-center gap-1 pl-1 pr-2 py-0.5 rounded-full text-white text-[10px] font-bold uppercase shadow-sm" style={{ backgroundColor: TYPE_COLORS[t] }}>
                        <img src={getTypeIcon(t)} alt={t} className="w-4 h-4 object-contain" onError={(e) => { e.currentTarget.style.display = 'none'; }} />
                        {t}
                      </div>
                    ))}
                  </div>
                  <span className="text-[10px] font-bold text-slate-400 tracking-wider mt-1">TYPE</span>
                </div>
                <div className="flex flex-col items-center flex-1 border-l border-slate-200">
                  <span className="text-lg font-black text-slate-800">{selectedSpecies.heightM} <span className="text-xs">m</span></span>
                  <span className="text-[10px] font-bold text-slate-400 tracking-wider mt-1">HEIGHT</span>
                </div>
              </div>

              {/* Moves (Fast + Charged), like the real Pokémon detail screen */}
              {(() => {
                const { fast, charged } = getMoveset(selectedSpecies.types);
                return (
                  <div className="w-full px-8 mb-6">
                    <div className="flex items-center gap-3 mb-2">
                      <div className="flex-1 h-px bg-slate-200" />
                      <span className="text-[10px] font-black text-slate-400 tracking-[0.2em] uppercase">Moves</span>
                      <div className="flex-1 h-px bg-slate-200" />
                    </div>
                    {[fast, charged].map((move, i) => (
                      <div key={i} className="flex items-center justify-between py-2 border-b border-slate-100 last:border-0">
                        <div className="flex items-center gap-2">
                          <div className="w-7 h-7 rounded-full flex items-center justify-center shadow-sm" style={{ backgroundColor: TYPE_COLORS[move.type] }}>
                            <img src={getTypeIcon(move.type)} alt={move.type} className="w-4 h-4 object-contain" onError={(e) => { e.currentTarget.style.display = 'none'; }} />
                          </div>
                          <span className="font-bold text-slate-700 text-sm">{move.name}</span>
                        </div>
                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">{i === 0 ? 'Fast' : 'Charged'}</span>
                      </div>
                    ))}
                  </div>
                );
              })()}

              {/* Stardust + Candy resources */}
              <div className="w-full px-8 flex justify-center gap-10 mb-4 items-start">
                <div className="flex flex-col items-center gap-1">
                  <div className="flex items-center gap-2">
                    <StardustIcon className="w-7 h-7 drop-shadow-sm" />
                    <span className="font-black text-slate-800 text-xl">{stardust.toLocaleString()}</span>
                  </div>
                  <span className="text-slate-400 font-bold text-[10px] tracking-wider uppercase">Stardust</span>
                </div>
                <div className="flex flex-col items-center gap-1">
                  <div className="flex items-center gap-2">
                    <img src={CANDY_ICON} alt="Candy" className="w-7 h-7 drop-shadow-sm" onError={(e) => { e.currentTarget.style.display = 'none'; }} />
                    <span className="font-black text-slate-800 text-xl">{candies[selectedSpecies.family] || 0}</span>
                  </div>
                  <span className="text-slate-400 font-bold text-[10px] tracking-wider uppercase">{selectedSpecies.family} Candy</span>
                </div>
              </div>

              {/* Power Up button */}
              {(() => {
                if (selected.level >= MAX_LEVEL) {
                  return <div className="text-slate-400 font-bold text-xs mb-6 uppercase tracking-wider">Max level reached</div>;
                }
                const cost = powerUpCost(selected.level);
                const canPowerUp = stardust >= cost.stardust && (candies[selectedSpecies.family] || 0) >= cost.candy;
                return (
                  <button
                    onClick={handlePowerUp}
                    disabled={!canPowerUp}
                    className="w-[80%] rounded-full py-3 mb-3 flex justify-between items-center px-6 active:scale-95 transition-transform disabled:opacity-50 disabled:active:scale-100"
                    style={{
                      background: 'linear-gradient(to bottom, #26C281 0%, #1DA66C 100%)',
                      boxShadow: '0 4px 10px rgba(38,194,129,0.4), inset 0 2px 4px rgba(255,255,255,0.3)',
                      border: '2px solid #148A58',
                    }}
                  >
                    <span className="text-white font-black tracking-widest text-base drop-shadow-[0_1px_1px_rgba(0,0,0,0.4)]">POWER UP</span>
                    <div className="flex items-center gap-3 text-white font-black text-sm">
                      <span className="flex items-center gap-1"><StardustIcon className="w-4 h-4" />{cost.stardust.toLocaleString()}</span>
                      <span className="flex items-center gap-1"><img src={CANDY_ICON} alt="" className="w-4 h-4" onError={(e) => { e.currentTarget.style.display = 'none'; }} />{cost.candy}</span>
                    </div>
                  </button>
                );
              })()}

              {/* Evolve buttons */}
              {selectedSpecies.evolutions.length > 0 && (
                <div className="w-full px-8 flex flex-col gap-3">
                  {selectedSpecies.evolutions.map(evo => {
                    const target = getSpecies(evo.toId);
                    if (!target) return null;
                    const candyCount = candies[selectedSpecies.family] || 0;
                    const canEvolve = candyCount >= evo.candyCost;
                    return (
                      <button
                        key={evo.toId}
                        onClick={() => handleEvolve(evo.toId, evo.candyCost)}
                        disabled={!canEvolve}
                        className="w-full rounded-full py-3 flex justify-between items-center px-6 active:scale-95 transition-transform disabled:opacity-50 disabled:active:scale-100"
                        style={{
                          background: 'linear-gradient(to bottom, #26C281 0%, #1DA66C 100%)',
                          boxShadow: '0 4px 10px rgba(38,194,129,0.4), inset 0 2px 4px rgba(255,255,255,0.3)',
                          border: '2px solid #148A58',
                        }}
                      >
                        <span className="text-white font-black tracking-widest text-base drop-shadow-[0_1px_2px_rgba(0,0,0,0.5)] font-sans">
                          EVOLVE TO {target.name.toUpperCase()}
                          {evo.item && <span className="block text-[10px] font-bold normal-case opacity-80">Requires {evo.item}</span>}
                        </span>
                        <div className="flex items-center gap-1 text-white font-black drop-shadow-[0_1px_2px_rgba(0,0,0,0.5)] text-lg">
                          <img src="https://cdn.jsdelivr.net/gh/PokeMiners/pogo_assets@master/Images/Items/pokemon_details_candy.png" alt="Candy" className="w-5 h-5 drop-shadow-md" onError={(e) => { e.currentTarget.style.display = 'none'; }} />
                          <span>{evo.candyCost}</span>
                        </div>
                      </button>
                    );
                  })}
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default PokemonStorageScreen;
