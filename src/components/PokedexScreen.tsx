import { useMemo, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { getSpecies, getTypeIcon, POKEMON_DATABASE, TYPE_COLORS } from '../data/pokemonDatabase';
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

type DexFilter = 'all' | 'caught' | 'seen' | 'missing';

const REGIONS = [
  { generation: 0, label: 'All' },
  { generation: 1, label: 'Kanto' },
  { generation: 2, label: 'Johto' },
  { generation: 3, label: 'Hoenn' },
  { generation: 4, label: 'Sinnoh' },
  { generation: 5, label: 'Unova' },
  { generation: 6, label: 'Kalos' },
  { generation: 7, label: 'Alola' },
  { generation: 8, label: 'Galar' },
  { generation: 9, label: 'Paldea' },
];

const FILTERS: { key: DexFilter; label: string }[] = [
  { key: 'all', label: 'All' },
  { key: 'caught', label: 'Caught' },
  { key: 'seen', label: 'Seen' },
  { key: 'missing', label: 'Missing' },
];

const PokedexScreen: React.FC<PokedexScreenProps> = ({ onClose, owned, candies, seen, onEvolve }) => {
  const [generation, setGeneration] = useState(0);
  const [filter, setFilter] = useState<DexFilter>('all');
  const [query, setQuery] = useState('');
  const [searchOpen, setSearchOpen] = useState(false);
  const [selectedId, setSelectedId] = useState<number | null>(null);

  const seenSet = useMemo(() => new Set(seen), [seen]);
  const ownedBySpecies = useMemo(() => {
    const map = new Map<number, OwnedPokemon[]>();
    owned.forEach((pokemon) => {
      const current = map.get(pokemon.speciesId) || [];
      current.push(pokemon);
      current.sort((a, b) => b.cp - a.cp);
      map.set(pokemon.speciesId, current);
    });
    return map;
  }, [owned]);

  const entries = useMemo(() => {
    const normalized = query.trim().toLowerCase();
    return POKEMON_DATABASE.filter((species) => {
      const caught = ownedBySpecies.has(species.id);
      const wasSeen = seenSet.has(species.id) || caught;
      if (generation && species.generation !== generation) return false;
      if (filter === 'caught' && !caught) return false;
      if (filter === 'seen' && !wasSeen) return false;
      if (filter === 'missing' && wasSeen) return false;
      if (normalized && !species.name.toLowerCase().includes(normalized) && !species.id.toString().includes(normalized)) return false;
      return true;
    });
  }, [generation, filter, query, ownedBySpecies, seenSet]);

  const selectedSpecies = selectedId ? getSpecies(selectedId) : undefined;
  const selectedOwned = selectedId ? ownedBySpecies.get(selectedId) : undefined;
  const bestOwned = selectedOwned?.[0];
  const selectedSeen = selectedId ? seenSet.has(selectedId) || !!bestOwned : false;
  const caughtCount = ownedBySpecies.size;
  const seenCount = new Set([...seen, ...owned.map((pokemon) => pokemon.speciesId)]).size;

  return (
    <motion.div initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 40 }} className="absolute inset-0 z-[700] flex flex-col overflow-hidden bg-[linear-gradient(180deg,#dff2f6_0%,#cceaf0_48%,#b9dfe8_100%)] text-[#315d61]">
      <header className="shrink-0 border-b border-white/70 bg-white/58 px-4 pb-3 pt-[max(18px,env(safe-area-inset-top))] shadow-sm backdrop-blur-md">
        <div className="flex items-center justify-between gap-3">
          <div>
            <p className="text-[10px] font-black uppercase tracking-[0.18em] text-[#68959b]">National</p>
            <h1 className="text-2xl font-black tracking-[-0.04em] text-[#2e676e]">Pokédex</h1>
          </div>
          <div className="flex items-center gap-2">
            <button type="button" onClick={() => setSearchOpen(!searchOpen)} className="flex h-10 w-10 items-center justify-center rounded-full bg-white/78 text-[#39777c] shadow-sm ring-1 ring-white active:scale-95" aria-label="Search Pokédex"><svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2.2"><circle cx="11" cy="11" r="7" /><path d="m20 20-4-4" /></svg></button>
            <div className="rounded-full bg-[#2c9bb1] px-4 py-2 text-sm font-black text-white shadow-sm">{caughtCount} / {POKEMON_DATABASE.length}</div>
          </div>
        </div>
        <div className="mt-3 grid grid-cols-2 gap-2">
          <div className="rounded-2xl bg-white/72 px-3 py-2 ring-1 ring-white"><p className="text-[9px] font-black uppercase tracking-wider text-[#7b9da0]">Caught</p><p className="text-lg font-black text-[#2e676e]">{caughtCount}</p></div>
          <div className="rounded-2xl bg-white/72 px-3 py-2 ring-1 ring-white"><p className="text-[9px] font-black uppercase tracking-wider text-[#7b9da0]">Seen</p><p className="text-lg font-black text-[#2e676e]">{seenCount}</p></div>
        </div>
        <AnimatePresence initial={false}>
          {searchOpen && <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden"><div className="mt-3 flex h-11 items-center gap-2 rounded-full bg-white/82 px-4 ring-1 ring-white"><svg viewBox="0 0 24 24" className="h-5 w-5 text-[#72969a]" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="7" /><path d="m20 20-4-4" /></svg><input value={query} onChange={(event) => setQuery(event.target.value)} autoFocus placeholder="Search name or number" className="min-w-0 flex-1 bg-transparent text-sm font-bold text-[#315d61] outline-none placeholder:text-[#91aaac]" />{query && <button type="button" onClick={() => setQuery('')} className="text-[#78999c]"><svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 6 6 18M6 6l12 12" /></svg></button>}</div></motion.div>}
        </AnimatePresence>
      </header>

      <div className="shrink-0 border-b border-white/65 bg-white/45 px-3 py-2 backdrop-blur-sm">
        <div className="flex gap-2 overflow-x-auto no-scrollbar">{REGIONS.map((region) => <button key={region.generation} type="button" onClick={() => setGeneration(region.generation)} className={`rounded-full px-4 py-2 text-[11px] font-black uppercase tracking-[0.08em] ${generation === region.generation ? 'bg-[#2c9bb1] text-white shadow-sm' : 'bg-white/70 text-[#5f8589]'}`}>{region.label}</button>)}</div>
        <div className="mt-2 flex gap-2 overflow-x-auto no-scrollbar">{FILTERS.map((item) => <button key={item.key} type="button" onClick={() => setFilter(item.key)} className={`rounded-full px-3.5 py-1.5 text-[10px] font-black uppercase tracking-[0.08em] ${filter === item.key ? 'bg-[#59b994] text-white shadow-sm' : 'bg-white/60 text-[#69898d]'}`}>{item.label}</button>)}</div>
      </div>

      <div className="min-h-0 flex-1 overflow-y-auto px-2.5 pb-28 pt-3">
        <div className="grid grid-cols-4 gap-2">
          {entries.map((species) => {
            const caught = ownedBySpecies.get(species.id);
            const wasSeen = seenSet.has(species.id) || !!caught;
            return (
              <motion.button key={species.id} type="button" whileTap={{ scale: 0.95 }} onClick={() => wasSeen && setSelectedId(species.id)} disabled={!wasSeen} className={`relative flex aspect-[.82] flex-col items-center overflow-hidden rounded-[17px] border border-white/80 p-1.5 shadow-sm ring-1 ${caught ? 'bg-white/86 ring-[#d7ece7]' : wasSeen ? 'bg-[#d7e9ec]/85 ring-white/60' : 'bg-[#c8e0e5]/60 ring-white/40'}`}>
                {caught && caught.length > 1 && <span className="absolute left-1 top-1 z-10 rounded-full bg-[#2d8795] px-1.5 py-0.5 text-[8px] font-black text-white">×{caught.length}</span>}
                <div className="flex min-h-0 w-full flex-1 items-center justify-center">
                  {caught ? <PokemonSprite id={species.id} name={species.name} className="max-h-full max-w-full object-contain drop-shadow" /> : wasSeen ? <PokemonSprite id={species.id} name={species.name} className="max-h-full max-w-full object-contain [filter:brightness(0)_opacity(.38)]" /> : <span className="text-2xl font-black text-[#95bbc0]">?</span>}
                </div>
                <p className="text-[9px] font-black tracking-wider text-[#5b858a]">{species.id.toString().padStart(4, '0')}</p>
                <p className={`w-full truncate text-center text-[9px] font-black ${wasSeen ? 'text-[#315d61]' : 'text-[#8caeb2]'}`}>{wasSeen ? species.name : 'Unknown'}</p>
              </motion.button>
            );
          })}
        </div>
        {entries.length === 0 && <div className="py-16 text-center"><p className="text-lg font-black text-[#4d7c82]">No entries found</p><p className="mt-2 text-sm text-[#72949a]">Change the region, filter, or search.</p></div>}
      </div>

      <div className="pointer-events-none absolute inset-x-0 bottom-0 flex justify-center bg-gradient-to-t from-[#b9dfe8] via-[#b9dfe8]/95 to-transparent pb-[max(18px,env(safe-area-inset-bottom))] pt-10"><motion.button type="button" whileTap={{ scale: 0.9 }} onClick={onClose} className="pointer-events-auto flex h-16 w-16 items-center justify-center rounded-full border-2 border-white bg-white/95 text-[#39747a] shadow-[0_8px_22px_rgba(43,91,98,.2)] ring-1 ring-[#c4e1e5]" aria-label="Close Pokédex"><svg viewBox="0 0 24 24" className="h-8 w-8" fill="none" stroke="currentColor" strokeWidth="2.3"><path d="M18 6 6 18M6 6l12 12" /></svg></motion.button></div>

      <AnimatePresence>
        {selectedSpecies && selectedSeen && (
          <motion.div initial={{ x: '100%' }} animate={{ x: 0 }} exit={{ x: '100%' }} transition={{ type: 'tween', duration: 0.23 }} className="absolute inset-0 z-40 overflow-y-auto bg-white text-[#315d61]">
            <div className="absolute inset-x-0 top-0 h-[54vh] opacity-35" style={{ background: `linear-gradient(180deg, ${TYPE_COLORS[selectedSpecies.types[0]]}, #dff4ee 55%, white 100%)` }} />
            <div className="relative z-10 flex items-center justify-between px-4 pt-[max(18px,env(safe-area-inset-top))]"><button type="button" onClick={() => setSelectedId(null)} className="flex h-11 w-11 items-center justify-center rounded-full bg-white/72 text-[#4f7473] shadow-sm backdrop-blur"><svg viewBox="0 0 24 24" className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth="2.4"><path d="m15 18-6-6 6-6" /></svg></button><span className="rounded-full bg-white/65 px-3 py-1.5 text-xs font-black tracking-[0.12em] text-[#668481]">#{selectedSpecies.id.toString().padStart(3, '0')}</span><div className="h-11 w-11" /></div>
            <div className="relative z-10 mt-3 flex h-56 items-center justify-center"><PokemonSprite id={selectedSpecies.id} name={selectedSpecies.name} variant="artwork" className={`h-full w-[72%] object-contain drop-shadow-[0_18px_20px_rgba(35,73,72,.22)] ${bestOwned ? '' : '[filter:brightness(0)_opacity(.55)]'}`} /></div>
            <section className="relative z-10 min-h-[48vh] rounded-t-[34px] bg-white px-5 pb-[max(30px,env(safe-area-inset-bottom))] pt-6 shadow-[0_-10px_28px_rgba(35,73,72,.08)]">
              <div className="text-center"><p className="text-[10px] font-black uppercase tracking-[0.16em] text-[#8ba19e]">{bestOwned ? 'Caught' : 'Seen'}</p><h2 className="mt-1 text-3xl font-black tracking-[-0.04em]">{selectedSpecies.name}</h2><div className="mt-3 flex justify-center gap-2">{selectedSpecies.types.map((type) => <span key={type} className="flex items-center gap-1.5 rounded-full px-3 py-1 text-[10px] font-black uppercase tracking-wider text-white shadow-sm" style={{ background: TYPE_COLORS[type] }}><img src={getTypeIcon(type)} alt={type} className="h-4 w-4" onError={(event) => { event.currentTarget.style.display = 'none'; }} />{type}</span>)}</div></div>
              <div className="mt-5 grid grid-cols-3 divide-x divide-[#e2ece9] rounded-2xl bg-[#f5f9f7] py-4 ring-1 ring-[#e5efec]"><div className="text-center"><p className="text-base font-black">{selectedSpecies.weightKg} kg</p><p className="mt-1 text-[9px] font-black uppercase tracking-wider text-[#8aa09d]">Weight</p></div><div className="text-center"><p className="text-base font-black">{bestOwned ? bestOwned.cp : maxCP(selectedSpecies.baseStats)}</p><p className="mt-1 text-[9px] font-black uppercase tracking-wider text-[#8aa09d]">{bestOwned ? 'Best CP' : 'Max CP'}</p></div><div className="text-center"><p className="text-base font-black">{selectedSpecies.heightM} m</p><p className="mt-1 text-[9px] font-black uppercase tracking-wider text-[#8aa09d]">Height</p></div></div>
              <div className="mt-5 rounded-2xl bg-[#f7faf9] p-4 ring-1 ring-[#e6efec]"><p className="text-[10px] font-black uppercase tracking-[0.14em] text-[#8aa09d]">Pokédex entry</p><p className="mt-2 text-sm leading-6 text-[#6f8985]">A discovered creature from Generation {selectedSpecies.generation}. Continue exploring to learn more about its habitats, forms, and evolution family.</p></div>
              {bestOwned && <div className="mt-5 rounded-2xl bg-[#f4f9f7] p-4 ring-1 ring-[#e4eeeb]"><div className="flex items-center justify-between"><div><p className="text-[10px] font-black uppercase tracking-[0.14em] text-[#8aa09d]">Family candy</p><p className="text-xl font-black">{candies[selectedSpecies.family] || 0}</p></div><img src="https://cdn.jsdelivr.net/gh/PokeMiners/pogo_assets@master/Images/Items/pokemon_details_candy.png" alt="Candy" className="h-10 w-10" onError={(event) => { event.currentTarget.style.display = 'none'; }} /></div></div>}
              {bestOwned && selectedSpecies.evolutions.map((evolution) => {
                const target = getSpecies(evolution.toId);
                if (!target) return null;
                const canEvolve = (candies[selectedSpecies.family] || 0) >= evolution.candyCost;
                return <button key={`${evolution.toId}-${evolution.candyCost}`} type="button" onClick={() => onEvolve(bestOwned.uid, evolution.toId, evolution.candyCost)} disabled={!canEvolve} className="mt-4 flex w-full items-center justify-between rounded-full bg-gradient-to-r from-[#55c995] to-[#28a6a5] px-5 py-3.5 text-white shadow-lg disabled:opacity-45"><span className="text-sm font-black uppercase tracking-[0.12em]">Evolve to {target.name}</span><span className="text-sm font-black">{evolution.candyCost} candy</span></button>;
              })}
            </section>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default PokedexScreen;
