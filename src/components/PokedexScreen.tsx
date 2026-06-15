import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  POKEMON_DATABASE,
  REGIONS,
  getSpecies,
  getTypeIcon,
  isShowcaseRarity,
  TYPE_COLORS,
} from '../data/pokemonDatabase';
import { maxCP } from '../data/cpTable';
import PokemonSprite from './PokemonSprite';
import type { CandyBag, OwnedPokemon } from '../types';

interface PokedexScreenProps {
  onClose: () => void;
  owned: OwnedPokemon[];
  candies: CandyBag;
  seen: number[];
  onEvolve: (uid: string, toSpeciesId: number, candyCost: number) => Promise<boolean>;
}

type RarityFilter = 'all' | 'caught' | 'legendary' | 'mythical';

const FILTERS: { key: RarityFilter; label: string }[] = [
  { key: 'all', label: 'All' },
  { key: 'caught', label: 'Caught' },
  { key: 'legendary', label: 'Legendary' },
  { key: 'mythical', label: 'Mythical' },
];

const ivPercent = (ivs: OwnedPokemon['ivs']) =>
  Math.round(((ivs.attack + ivs.defense + ivs.stamina) / 45) * 100);

const PokedexScreen: React.FC<PokedexScreenProps> = ({ onClose, owned, candies, seen, onEvolve }) => {
  const [selectedSpeciesId, setSelectedSpeciesId] = useState<number | null>(null);
  const seenSet = useMemo(() => new Set(seen), [seen]);

  // Search & filter state
  const [isSearching, setIsSearching] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [rarityFilter, setRarityFilter] = useState<RarityFilter>('all');
  const [regionFilter, setRegionFilter] = useState<number | 'all'>('all');
  const [isPickingRegion, setIsPickingRegion] = useState(false);

  const ownedBySpecies = useMemo(() => {
    const map = new Map<number, OwnedPokemon[]>();
    for (const p of owned) {
      const list = map.get(p.speciesId) || [];
      list.push(p);
      map.set(p.speciesId, list);
    }
    for (const list of map.values()) {
      list.sort((a, b) => b.cp - a.cp);
    }
    return map;
  }, [owned]);

  const caughtSpeciesCount = ownedBySpecies.size;

  const filteredGrid = useMemo(() => {
    let entries = POKEMON_DATABASE;

    if (regionFilter !== 'all') {
      entries = entries.filter(species => species.generation === regionFilter);
    }

    if (rarityFilter === 'caught') {
      entries = entries.filter(species => ownedBySpecies.has(species.id));
    } else if (rarityFilter === 'legendary' || rarityFilter === 'mythical') {
      entries = entries.filter(species => species.rarity === rarityFilter);
    }

    if (searchQuery.trim() !== '') {
      const query = searchQuery.toLowerCase();
      entries = entries.filter(species => {
        if (!isNaN(Number(query))) {
          return species.id.toString().includes(query);
        }
        return species.name.toLowerCase().includes(query);
      });
    }

    return entries;
  }, [searchQuery, rarityFilter, regionFilter, ownedBySpecies]);

  const regionLabel = regionFilter === 'all' ? 'NATIONAL' : REGIONS.find(r => r.generation === regionFilter)?.name.toUpperCase() ?? 'NATIONAL';

  const selectedSpecies = selectedSpeciesId !== null ? getSpecies(selectedSpeciesId) : undefined;
  const selectedOwned = selectedSpeciesId !== null ? ownedBySpecies.get(selectedSpeciesId) : undefined;
  const bestOwned = selectedOwned?.[0];
  const selectedShiny = selectedSpecies ? isShowcaseRarity(selectedSpecies.rarity) : false;

  const handleEvolve = async (toSpeciesId: number, candyCost: number) => {
    if (!bestOwned) return;
    const success = await onEvolve(bestOwned.uid, toSpeciesId, candyCost);
    if (success) {
      setSelectedSpeciesId(toSpeciesId);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 50 }}
      className="absolute inset-0 z-[700] bg-[#bfe6f2] flex flex-col font-sans overflow-hidden"
    >
      {/* Search Bar Overlay */}
      <AnimatePresence>
        {isSearching && (
          <motion.div
            initial={{ y: -100 }}
            animate={{ y: 0 }}
            exit={{ y: -100 }}
            className="absolute top-0 left-0 right-0 z-30 bg-[#0b2a3a] p-4 shadow-lg flex items-center gap-2"
          >
            <div className="flex-1 bg-white rounded-full flex items-center px-4 h-10">
               <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#64748b" strokeWidth="2"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>
               <input
                 autoFocus
                 type="text"
                 placeholder="Search by name or number..."
                 value={searchQuery}
                 onChange={(e) => setSearchQuery(e.target.value)}
                 className="flex-1 bg-transparent outline-none ml-2 text-slate-800 placeholder-slate-400 font-medium"
               />
               {searchQuery && (
                 <button onClick={() => setSearchQuery('')} className="text-slate-400 p-1">
                   <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
                 </button>
               )}
            </div>
            <button onClick={() => { setIsSearching(false); setSearchQuery(''); }} className="text-white font-bold ml-2">
              Cancel
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Top bar: region label, caught/total pill, Pokédex icon */}
      <div className="shrink-0 px-4 pt-12 pb-2 flex items-center justify-between relative z-10">
        <button onClick={() => setIsPickingRegion(true)} className="text-[#1f6f6b] font-black tracking-wide text-lg flex items-center gap-1">
          {regionLabel}
          <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="#1f6f6b" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="m6 9 6 6 6-6"/></svg>
        </button>
        <div className="bg-[#2a9ab5] px-5 py-1.5 rounded-full shadow-md">
          <span className="text-white font-black text-lg tracking-wide">{caughtSpeciesCount} / {POKEMON_DATABASE.length}</span>
        </div>
        <svg viewBox="0 0 24 24" className="w-9 h-9" fill="none" stroke="#1f6f6b" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
          <rect x="5" y="3" width="14" height="18" rx="2" /><circle cx="9" cy="8" r="2.2" /><path d="M14 7h3M14 10h3M8 14h8M8 17h8" />
        </svg>
      </div>

      {/* 4-column grid */}
      <div className="flex-1 overflow-y-auto px-3 pt-1 pb-44">
        <div className="grid grid-cols-4 gap-2">
          {filteredGrid.map((species) => {
            const caught = ownedBySpecies.get(species.id);
            const shiny = isShowcaseRarity(species.rarity);
            const seenOnly = !caught && !shiny && seenSet.has(species.id);
            const clickable = !!caught || shiny;

            return (
              <button
                key={species.id}
                onClick={() => clickable && setSelectedSpeciesId(species.id)}
                className={`aspect-[4/5] rounded-2xl flex flex-col items-center justify-center relative overflow-hidden ${clickable ? 'active:scale-95 transition-transform' : ''} ${shiny ? 'bg-amber-50 ring-1 ring-amber-300' : 'bg-[#d6eef8]'}`}
              >
                {shiny && <span className="absolute top-1 right-1.5 text-xs" title="Shiny">✨</span>}
                {caught && caught.length > 1 && (
                  <span className="absolute top-1 left-1.5 bg-[#2a7a8c] text-white font-bold text-[9px] px-1.5 rounded-full">x{caught.length}</span>
                )}

                <div className="flex-1 w-full flex items-center justify-center p-2 relative">
                  {clickable && <div className="absolute bottom-1.5 w-9 h-2 bg-black/10 rounded-[50%] blur-[1px]" />}
                  {clickable ? (
                    <PokemonSprite id={species.id} name={species.name} shiny={shiny} className="max-h-full max-w-full object-contain drop-shadow relative z-10" />
                  ) : seenOnly ? (
                    <PokemonSprite id={species.id} name={species.name} className="max-h-full max-w-full object-contain [filter:brightness(0)_opacity(0.45)]" />
                  ) : (
                    <span className="text-[#a3cdda] font-black text-xl">?</span>
                  )}
                </div>
                <span className="text-[#2a7a8c] font-black text-xs tracking-wider pb-1.5">
                  {species.id.toString().padStart(4, '0')}
                </span>
              </button>
            );
          })}
          {filteredGrid.length === 0 && (
            <div className="col-span-4 py-10 text-center text-[#3a7a8c] font-medium">
              No Pokémon found matching "{searchQuery}"
            </div>
          )}
        </div>
      </div>

      {/* Bottom filter pills (POKÉMON / SHINY style category bar) */}
      <div className="absolute bottom-[88px] left-0 right-0 px-3 flex gap-2 overflow-x-auto justify-center z-20 no-scrollbar">
        {FILTERS.map(filter => (
          <button
            key={filter.key}
            onClick={() => setRarityFilter(filter.key)}
            className={`px-4 py-1.5 rounded-full text-xs font-black tracking-wide uppercase whitespace-nowrap shadow-sm transition-colors ${
              rarityFilter === filter.key ? 'bg-[#2a9ab5] text-white' : 'bg-white/85 text-[#3a7a8c]'
            }`}
          >
            {filter.label}
          </button>
        ))}
      </div>

      {/* Bottom controls: Search / Close / Regions */}
      <div className="absolute bottom-6 left-0 right-0 flex items-center justify-center gap-12 z-20">
        <button
          onClick={() => setIsSearching(true)}
          className="w-12 h-12 rounded-full bg-white shadow-md flex items-center justify-center"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#2a7a8c" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>
        </button>
        <motion.button
          whileTap={{ scale: 0.9 }}
          onClick={onClose}
          className="w-14 h-14 rounded-full bg-white shadow-md flex items-center justify-center"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="#2a7a8c" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
        </motion.button>
        <button onClick={() => setIsPickingRegion(true)} className="w-12 h-12 rounded-full bg-white shadow-md flex flex-col items-center justify-center">
          <svg viewBox="0 0 24 24" className="w-6 h-6" fill="none" stroke="#2a7a8c" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="4" y="4" width="11" height="11" rx="2"/><path d="M9 15v3a2 2 0 0 0 2 2h7a2 2 0 0 0 2-2v-7a2 2 0 0 0-2-2h-3"/></svg>
        </button>
      </div>

      {/* Region Picker Sheet */}
      <AnimatePresence>
        {isPickingRegion && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 z-[800] bg-black/40 flex items-end"
            onClick={() => setIsPickingRegion(false)}
          >
            <motion.div
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              transition={{ type: 'tween', duration: 0.25 }}
              onClick={(e) => e.stopPropagation()}
              className="w-full bg-white rounded-t-3xl max-h-[70vh] overflow-y-auto pb-8"
            >
              <div className="sticky top-0 bg-white pt-4 pb-2 px-5 flex items-center justify-between border-b border-slate-100">
                <h3 className="text-lg font-black text-slate-800 tracking-wide">SELECT REGION</h3>
                <button onClick={() => setIsPickingRegion(false)} className="w-9 h-9 rounded-full bg-slate-100 flex items-center justify-center text-slate-500">
                  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
                </button>
              </div>
              <div className="px-3 pt-2">
                <button
                  onClick={() => { setRegionFilter('all'); setIsPickingRegion(false); }}
                  className={`w-full flex items-center justify-between px-4 py-3 rounded-xl mb-1 transition-colors ${regionFilter === 'all' ? 'bg-[#2a9ab5]/15' : 'active:bg-slate-50'}`}
                >
                  <span className="font-bold text-slate-700">National</span>
                  <span className="text-sm font-bold text-slate-400">{caughtSpeciesCount} / {POKEMON_DATABASE.length}</span>
                </button>
                {REGIONS.map(region => {
                  const regionSpecies = POKEMON_DATABASE.filter(s => s.generation === region.generation);
                  const caughtInRegion = regionSpecies.filter(s => ownedBySpecies.has(s.id)).length;
                  return (
                    <button
                      key={region.generation}
                      onClick={() => { setRegionFilter(region.generation); setIsPickingRegion(false); }}
                      className={`w-full flex items-center justify-between px-4 py-3 rounded-xl mb-1 transition-colors ${regionFilter === region.generation ? 'bg-[#2a9ab5]/15' : 'active:bg-slate-50'}`}
                    >
                      <span className="font-bold text-slate-700">{region.name}</span>
                      <span className="text-sm font-bold text-slate-400">{caughtInRegion} / {regionSpecies.length}</span>
                    </button>
                  );
                })}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Authentic Flat Detail View */}
      <AnimatePresence>
        {selectedSpecies && (bestOwned || selectedShiny) && (
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'tween', duration: 0.2 }}
            className="absolute inset-0 bg-white z-50 flex flex-col font-sans overflow-y-auto"
          >
             {/* Gradient Background matching Pokemon type */}
             <div
                className="absolute inset-0 opacity-20 z-0"
                style={{ background: `linear-gradient(to bottom, ${TYPE_COLORS[selectedSpecies.types[0]]} 0%, white 50%)` }}
             />

             {/* Top Nav */}
             <div className="w-full flex justify-between items-center p-4 z-10 pt-12">
               <button onClick={() => setSelectedSpeciesId(null)} className="w-10 h-10 flex items-center justify-center text-slate-500 active:bg-slate-100 rounded-full">
                  <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="m15 18-6-6 6-6"/></svg>
               </button>
               <span className="text-slate-400 font-black text-sm tracking-widest">#{selectedSpecies.id.toString().padStart(3, '0')}</span>
             </div>

             {/* CP Badge */}
             <div className="w-full flex justify-center mt-2 z-10 relative">
               <div className="bg-white px-4 py-1 rounded-full shadow-sm border border-slate-200 z-10 flex items-baseline gap-1">
                 <span className="text-xs font-bold text-slate-500">{bestOwned ? 'CP' : 'MAX CP'}</span>
                 <span className="text-2xl font-black text-slate-800 tracking-tighter">
                   {bestOwned ? bestOwned.cp : maxCP(selectedSpecies.baseStats)}
                 </span>
               </div>
             </div>

             {/* Render */}
             <motion.div
               animate={{ y: [-5, 5] }}
               transition={{ repeat: Infinity, duration: 4, repeatType: "mirror", ease: "easeInOut" }}
               className="w-full h-[30vh] flex flex-col items-center justify-center relative z-10"
             >
               <PokemonSprite
                 id={selectedSpecies.id}
                 name={selectedSpecies.name}
                 shiny={selectedShiny}
                 variant="artwork"
                 className="w-[70%] h-full object-contain drop-shadow-2xl"
               />
             </motion.div>

             {/* Base Info */}
             <div className="w-full flex flex-col items-center z-10 mt-2 flex-1 bg-white pt-4 shadow-[0_-10px_20px_rgba(0,0,0,0.05)] rounded-t-[2.5rem] pb-8">
               {selectedShiny && (
                 <div className="flex items-center gap-1 bg-amber-100 text-amber-700 font-black text-xs px-3 py-1 rounded-full mb-2 uppercase tracking-wider">
                   ✨ Shiny {selectedSpecies.rarity}
                 </div>
               )}

               <h2 className="text-3xl font-black text-slate-800 tracking-wide uppercase mb-1">
                 {selectedSpecies.name}
               </h2>

               {bestOwned ? (
                 <div className="text-slate-500 font-bold text-sm mb-4">
                   Level {bestOwned.level} &middot; IV {ivPercent(bestOwned.ivs)}%
                   {selectedOwned && selectedOwned.length > 1 && (
                     <span> &middot; Best of {selectedOwned.length} caught</span>
                   )}
                 </div>
               ) : (
                 <div className="text-slate-400 font-bold text-sm mb-4 text-center px-8">
                   Not caught yet — keep exploring to find one in the wild!
                 </div>
               )}

               {/* IV breakdown */}
               {bestOwned && (
                 <div className="w-full px-8 flex justify-center gap-8 mb-6 text-center">
                   <div className="flex flex-col items-center">
                     <span className="text-lg font-black text-slate-800">{bestOwned.ivs.attack}/15</span>
                     <span className="text-[10px] font-bold text-slate-400 tracking-wider">ATTACK</span>
                   </div>
                   <div className="flex flex-col items-center">
                     <span className="text-lg font-black text-slate-800">{bestOwned.ivs.defense}/15</span>
                     <span className="text-[10px] font-bold text-slate-400 tracking-wider">DEFENSE</span>
                   </div>
                   <div className="flex flex-col items-center">
                     <span className="text-lg font-black text-slate-800">{bestOwned.ivs.stamina}/15</span>
                     <span className="text-[10px] font-bold text-slate-400 tracking-wider">STAMINA</span>
                   </div>
                 </div>
               )}

               {/* Weight / Types / Height */}
               <div className="w-full px-8 flex justify-between items-center mb-6">
                 <div className="flex flex-col items-center flex-1 border-r border-slate-200">
                   <span className="text-lg font-black text-slate-800">{selectedSpecies.weightKg} <span className="text-xs">kg</span></span>
                   <span className="text-[10px] font-bold text-slate-400 tracking-wider mt-1">WEIGHT</span>
                 </div>

                 <div className="flex flex-col items-center flex-1 gap-1">
                   <div className="flex gap-1.5 justify-center flex-wrap">
                     {selectedSpecies.types.map(t => (
                       <div
                         key={t}
                         className="flex items-center gap-1 pl-1 pr-2 py-0.5 rounded-full text-white text-[10px] font-bold uppercase shadow-sm"
                         style={{ backgroundColor: TYPE_COLORS[t] }}
                       >
                         <img
                           src={getTypeIcon(t)}
                           alt={t}
                           className="w-4 h-4 object-contain"
                           onError={(e) => { e.currentTarget.style.display = 'none'; }}
                         />
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

               {/* Candy & Evolve - only relevant once you've actually caught one */}
               {bestOwned && (
                 <>
                   <div className="w-full px-8 flex justify-center gap-3 mb-6 items-center">
                     <img src="https://cdn.jsdelivr.net/gh/PokeMiners/pogo_assets@master/Images/Items/pokemon_details_candy.png" alt="Candy" className="w-8 h-8 drop-shadow-sm" />
                     <span className="font-black text-slate-800 text-xl">{candies[selectedSpecies.family] || 0}</span>
                     <span className="text-slate-400 font-bold text-xs tracking-wider uppercase">{selectedSpecies.family} CANDY</span>
                   </div>

                   {selectedSpecies.evolutions.length > 0 && (
                     <div className="w-full px-8 flex flex-col gap-3">
                       {selectedSpecies.evolutions.map(evo => {
                         const targetSpecies = getSpecies(evo.toId);
                         if (!targetSpecies) return null;
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
                               border: '2px solid #148A58'
                             }}
                           >
                             <span className="text-white font-black tracking-widest text-base drop-shadow-[0_1px_2px_rgba(0,0,0,0.5)] font-sans">
                               EVOLVE TO {targetSpecies.name.toUpperCase()}
                               {evo.item && <span className="block text-[10px] font-bold normal-case opacity-80">Requires {evo.item}</span>}
                             </span>
                             <div className="flex items-center gap-1 text-white font-black drop-shadow-[0_1px_2px_rgba(0,0,0,0.5)] text-lg">
                               <img src="https://cdn.jsdelivr.net/gh/PokeMiners/pogo_assets@master/Images/Items/pokemon_details_candy.png" alt="Candy" className="w-5 h-5 drop-shadow-md" />
                               <span>{evo.candyCost}</span>
                             </div>
                           </button>
                         );
                       })}
                     </div>
                   )}
                 </>
               )}
             </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default PokedexScreen;
