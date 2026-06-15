import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  POKEMON_DATABASE,
  REGIONS,
  getSpecies,
  getTypeIcon,
  TYPE_COLORS,
} from '../data/pokemonDatabase';
import { maxCP } from '../data/cpTable';
import PokemonSprite from './PokemonSprite';
import { typeBackdrop } from '../theme';
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
    // For a complete and impressive Pokédex, show all Pokémon entries. Unseen ones will render as numbers/placeholders.
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
  const selectedShiny = selectedOwned?.some(p => p.isShiny) ?? false;

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
      className="absolute inset-0 z-[700] flex flex-col font-sans overflow-hidden bg-[#f0f4f8]"
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

      {/* Authentic Red POKÉDEX Header */}
      <div className="shrink-0 bg-[#e3352f] shadow-md px-4 pt-12 pb-3 flex items-center justify-between relative z-10">
        <button onClick={onClose} className="text-white p-1 -ml-1 active:scale-95 transition-transform">
          <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="m15 18-6-6 6-6"/></svg>
        </button>
        <span className="text-white font-black tracking-widest text-lg drop-shadow-sm">POKÉDEX</span>
        <button onClick={() => setIsSearching(true)} className="text-white p-1 -mr-1 active:scale-95 transition-transform">
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>
        </button>
      </div>

      {/* Region / Caught Bar */}
      <div className="shrink-0 bg-white border-b border-slate-200 px-4 py-2 flex items-center justify-between relative z-10 shadow-sm">
        <button onClick={() => setIsPickingRegion(true)} className="text-slate-700 font-black tracking-wide text-sm flex items-center gap-1 uppercase">
          {regionLabel}
          <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="m6 9 6 6 6-6"/></svg>
        </button>
        <div className="bg-slate-100 border border-slate-200 px-3 py-1 rounded-full">
          <span className="text-slate-500 font-black text-xs tracking-wider uppercase">CAUGHT {caughtSpeciesCount}</span>
        </div>
      </div>

      {/* 3-column grid */}
      <div className="flex-1 overflow-y-auto px-2 pt-2 pb-44">
        <div className="grid grid-cols-3 gap-2">
          {filteredGrid.map((species) => {
            const caughtList = ownedBySpecies.get(species.id);
            const caught = !!caughtList;
            const shiny = caughtList?.some(p => p.isShiny) ?? false;
            const seenOnly = !caught && seenSet.has(species.id);
            const clickable = caught || seenOnly;
            const typeColor = TYPE_COLORS[species.types[0]];

            return (
              <button
                key={species.id}
                onClick={() => clickable && setSelectedSpeciesId(species.id)}
                className={`aspect-[4/5] rounded-xl flex flex-col items-center justify-center relative overflow-hidden border transition-all ${clickable ? 'active:scale-95 bg-white border-slate-200 shadow-sm' : 'bg-transparent border-transparent'}`}
                style={clickable ? undefined : undefined}
              >
                {/* Type-colored accent wash behind a registered Pokémon */}
                {clickable && (
                  <div className="absolute inset-x-0 top-0 h-2/3 opacity-25" style={{ background: `radial-gradient(circle at 50% 20%, ${typeColor} 0%, transparent 70%)` }} />
                )}
                {shiny && <span className="absolute top-1 right-1.5 text-xs z-20" title="Shiny">✨</span>}
                {caughtList && caughtList.length > 1 && (
                  <span className="absolute top-1 left-1.5 bg-pogo-teal text-white font-display font-extrabold text-[9px] px-1.5 rounded-pogo-pill z-20">x{caughtList.length}</span>
                )}

                <div className="flex-1 w-full flex items-center justify-center p-2 relative">
                  {clickable && <div className="absolute bottom-1.5 w-9 h-2 bg-black/10 rounded-[50%] blur-[1px]" />}
                  {caught ? (
                    <PokemonSprite id={species.id} name={species.name} shiny={shiny} className="max-h-full max-w-full object-contain drop-shadow relative z-10" />
                  ) : seenOnly ? (
                    <PokemonSprite id={species.id} name={species.name} className="max-h-full max-w-full object-contain [filter:brightness(0)_opacity(0.3)]" />
                  ) : (
                    <div className="w-14 h-14 rounded-full border-[3px] border-dotted border-slate-300 flex items-center justify-center bg-slate-100/50">
                       <span className="text-slate-400 font-black text-sm tracking-widest">{species.id.toString().padStart(3, '0')}</span>
                    </div>
                  )}
                </div>
                {caught && (
                  <span className="font-black text-slate-500 text-[11px] tracking-wider pb-1.5 z-10 bg-white/80 px-2 rounded-full">
                    {species.name}
                  </span>
                )}
                <span className={`font-black text-[10px] tracking-widest absolute bottom-1.5 ${caught ? 'text-slate-400 opacity-0' : 'text-slate-400'}`}>
                  {species.id.toString().padStart(3, '0')}
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

      {/* Bottom filter pills */}
      <div className="absolute bottom-6 left-0 right-0 px-3 flex gap-2 overflow-x-auto justify-center z-20 no-scrollbar pointer-events-auto">
        <div className="bg-white/90 backdrop-blur shadow-lg border border-slate-200 rounded-full p-1 flex items-center">
          {FILTERS.map(filter => (
            <button
              key={filter.key}
              onClick={() => setRarityFilter(filter.key)}
              className={`px-4 py-2 rounded-full text-[10px] font-black tracking-widest uppercase whitespace-nowrap transition-colors ${
                rarityFilter === filter.key ? 'bg-slate-800 text-white shadow-md' : 'bg-transparent text-slate-500 hover:bg-slate-100'
              }`}
            >
              {filter.label}
            </button>
          ))}
        </div>
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
        {selectedSpecies && (
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'tween', duration: 0.2 }}
            className="absolute inset-0 bg-white z-50 flex flex-col font-sans overflow-y-auto"
          >
             {/* Radial type-tinted backdrop, matching GO's detail sheet */}
             <div
                className="absolute inset-0 z-0"
                style={{ background: typeBackdrop(selectedSpecies.types[0]) }}
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
               <div className="bg-white px-5 py-1 rounded-pogo-pill shadow-pogo-mid border border-slate-100 z-10 flex items-baseline gap-1.5">
                 <span className="text-xs font-extrabold text-slate-500">{bestOwned ? 'CP' : 'MAX CP'}</span>
                 <span className="text-2xl font-display font-extrabold text-slate-800">
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
                   ✨ Shiny Variant
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
