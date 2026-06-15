import { useMemo, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { getSpecies, getTypeIcon, TYPE_COLORS } from '../data/pokemonDatabase';
import { getAppraisal, getMoveset } from '../data/moves';
import { calculateHP, MAX_LEVEL, powerUpCost } from '../data/cpTable';
import PokemonSprite from './PokemonSprite';
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

type SortKey = 'recent' | 'cp' | 'name' | 'number';

const STORAGE_CAP = 300;
const CANDY_ICON = 'https://cdn.jsdelivr.net/gh/PokeMiners/pogo_assets@master/Images/Items/pokemon_details_candy.png';

const StarIcon = ({ filled, className = 'h-5 w-5' }: { filled: boolean; className?: string }) => (
  <svg viewBox="0 0 24 24" className={className} aria-hidden="true">
    <path d="m12 2 2.9 6.3 6.9.7-5.2 4.6 1.5 6.8-6.1-2.8-6.1 2.8 1.5-6.8L2.2 9l6.9-.7L12 2Z" fill={filled ? '#f6b73c' : 'none'} stroke={filled ? '#db9121' : '#9bb2ae'} strokeWidth="1.5" />
  </svg>
);

const StardustIcon = ({ className = 'h-5 w-5' }: { className?: string }) => (
  <svg viewBox="0 0 24 24" className={className} aria-hidden="true"><path d="m12 1 2.2 7.4L21 11l-6.8 2.6L12 21l-2.2-7.4L3 11l6.8-2.6L12 1Z" fill="#35c8ba" stroke="#168f88" strokeWidth=".8" /></svg>
);

const ivPercent = (ivs: OwnedPokemon['ivs']) => Math.round(((ivs.attack + ivs.defense + ivs.stamina) / 45) * 100);

const PokemonStorageScreen: React.FC<PokemonStorageScreenProps> = ({
  onClose,
  owned,
  candies,
  stardust,
  onEvolve,
  onPowerUp,
  onToggleFavorite,
}) => {
  const [sortKey, setSortKey] = useState<SortKey>('recent');
  const [selectedUid, setSelectedUid] = useState<string | null>(null);
  const [query, setQuery] = useState('');
  const [favoritesOnly, setFavoritesOnly] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);

  const sorted = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();
    const list = owned.filter((pokemon) => {
      const species = getSpecies(pokemon.speciesId);
      if (!species) return false;
      if (favoritesOnly && !pokemon.favorite) return false;
      if (!normalizedQuery) return true;
      return species.name.toLowerCase().includes(normalizedQuery) || species.id.toString().includes(normalizedQuery) || `cp${pokemon.cp}`.includes(normalizedQuery.replace(/\s/g, ''));
    });

    switch (sortKey) {
      case 'cp':
        return list.sort((a, b) => b.cp - a.cp);
      case 'name':
        return list.sort((a, b) => (getSpecies(a.speciesId)?.name || '').localeCompare(getSpecies(b.speciesId)?.name || ''));
      case 'number':
        return list.sort((a, b) => a.speciesId - b.speciesId);
      case 'recent':
      default:
        return list.sort((a, b) => b.caughtAt - a.caughtAt);
    }
  }, [owned, sortKey, query, favoritesOnly]);

  const selected = selectedUid ? owned.find((pokemon) => pokemon.uid === selectedUid) : undefined;
  const selectedSpecies = selected ? getSpecies(selected.speciesId) : undefined;

  return (
    <motion.div initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 40 }} className="absolute inset-0 z-[700] flex flex-col overflow-hidden bg-[linear-gradient(180deg,#f8fbfa_0%,#edf5f3_100%)] text-[#315d61]">
      <header className="shrink-0 border-b border-[#dce9e6] bg-white/94 px-4 pb-3 pt-[max(18px,env(safe-area-inset-top))] shadow-sm backdrop-blur">
        <div className="flex items-center justify-between gap-3">
          <div>
            <p className="text-[10px] font-black uppercase tracking-[0.18em] text-[#7c9f9a]">Collection</p>
            <h1 className="text-2xl font-black tracking-[-0.04em] text-[#315d61]">Pokémon</h1>
          </div>
          <div className="flex items-center gap-2">
            <button type="button" onClick={() => setSearchOpen(!searchOpen)} className="flex h-10 w-10 items-center justify-center rounded-full bg-[#edf5f2] text-[#4b807b] ring-1 ring-[#ddeae6] active:scale-95" aria-label="Search Pokémon">
              <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2.2"><circle cx="11" cy="11" r="7" /><path d="m20 20-4-4" /></svg>
            </button>
            <div className="rounded-full bg-[#edf5f2] px-3 py-2 text-sm font-black ring-1 ring-[#ddeae6]">{owned.length} / {STORAGE_CAP}</div>
          </div>
        </div>
        <AnimatePresence initial={false}>
          {searchOpen && (
            <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden">
              <div className="mt-3 flex h-11 items-center gap-2 rounded-full bg-[#edf5f2] px-4 ring-1 ring-[#dce9e5]">
                <svg viewBox="0 0 24 24" className="h-5 w-5 shrink-0 text-[#71928e]" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="7" /><path d="m20 20-4-4" /></svg>
                <input value={query} onChange={(event) => setQuery(event.target.value)} autoFocus placeholder="Search name, number, or CP" className="min-w-0 flex-1 bg-transparent text-sm font-bold text-[#315d61] outline-none placeholder:text-[#92a8a4]" />
                {query && <button type="button" onClick={() => setQuery('')} className="text-[#75928f]"><svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 6 6 18M6 6l12 12" /></svg></button>}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      <div className="shrink-0 border-b border-[#dce9e6] bg-white/88 px-3 py-2">
        <div className="flex gap-2 overflow-x-auto no-scrollbar">
          {([
            ['recent', 'Recent'],
            ['cp', 'CP'],
            ['name', 'Name'],
            ['number', 'Number'],
          ] as [SortKey, string][]).map(([key, label]) => (
            <button key={key} type="button" onClick={() => setSortKey(key)} className={`rounded-full px-4 py-2 text-[11px] font-black uppercase tracking-[0.1em] ${sortKey === key ? 'bg-[#2e9da1] text-white shadow-sm' : 'bg-[#edf4f1] text-[#648681]'}`}>{label}</button>
          ))}
          <button type="button" onClick={() => setFavoritesOnly(!favoritesOnly)} className={`flex items-center gap-1 rounded-full px-4 py-2 text-[11px] font-black uppercase tracking-[0.1em] ${favoritesOnly ? 'bg-[#efb23e] text-white shadow-sm' : 'bg-[#edf4f1] text-[#648681]'}`}><StarIcon filled={favoritesOnly} className="h-4 w-4" /> Favorites</button>
        </div>
      </div>

      <div className="min-h-0 flex-1 overflow-y-auto px-2.5 pb-28 pt-3">
        {sorted.length === 0 ? (
          <div className="mx-auto mt-14 max-w-xs text-center"><div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-white text-[#8da6a1] shadow-sm ring-1 ring-[#e0ebe8]"><PokemonIcon /></div><h2 className="mt-4 text-lg font-black">No Pokémon found</h2><p className="mt-2 text-sm leading-6 text-[#78918d]">Catch creatures on the map or change your search and filters.</p></div>
        ) : (
          <div className="grid grid-cols-3 gap-2">
            {sorted.map((pokemon) => {
              const species = getSpecies(pokemon.speciesId);
              if (!species) return null;
              const typeColor = TYPE_COLORS[species.types[0]];
              return (
                <motion.button key={pokemon.uid} type="button" whileTap={{ scale: 0.95 }} onClick={() => setSelectedUid(pokemon.uid)} className="relative flex aspect-[.92] flex-col items-center overflow-hidden rounded-[18px] border border-white bg-white/94 p-1.5 shadow-[0_4px_12px_rgba(47,91,83,.09)] ring-1 ring-[#e1ece9]">
                  <div className="absolute inset-x-0 top-0 h-[58%] opacity-18" style={{ background: `linear-gradient(180deg, ${typeColor}, transparent)` }} />
                  {pokemon.favorite && <StarIcon filled className="absolute right-1.5 top-1.5 z-10 h-4 w-4 drop-shadow-sm" />}
                  <p className="relative z-10 text-[10px] font-black uppercase tracking-wide text-[#587a78]">CP {pokemon.cp}</p>
                  <div className="relative z-10 flex min-h-0 w-full flex-1 items-center justify-center"><PokemonSprite id={species.id} name={species.name} className="max-h-full max-w-full object-contain drop-shadow-md" /></div>
                  <p className="relative z-10 w-full truncate text-center text-[11px] font-black text-[#315d61]">{species.name}</p>
                  <div className="relative z-10 mt-1 h-1.5 w-[78%] overflow-hidden rounded-full bg-[#e2ece9]"><div className="h-full rounded-full" style={{ width: `${Math.min(100, pokemon.level * 2.5)}%`, background: typeColor }} /></div>
                </motion.button>
              );
            })}
          </div>
        )}
      </div>

      <div className="pointer-events-none absolute inset-x-0 bottom-0 flex justify-center bg-gradient-to-t from-[#edf5f3] via-[#edf5f3]/95 to-transparent pb-[max(18px,env(safe-area-inset-bottom))] pt-10">
        <motion.button type="button" whileTap={{ scale: 0.9 }} onClick={onClose} className="pointer-events-auto flex h-16 w-16 items-center justify-center rounded-full border-2 border-white bg-white/95 text-[#39716f] shadow-[0_8px_22px_rgba(47,91,83,.2)] ring-1 ring-[#cfe3dc]" aria-label="Close storage"><svg viewBox="0 0 24 24" className="h-8 w-8" fill="none" stroke="currentColor" strokeWidth="2.3" strokeLinecap="round"><path d="M18 6 6 18M6 6l12 12" /></svg></motion.button>
      </div>

      <AnimatePresence>
        {selected && selectedSpecies && (
          <motion.div initial={{ x: '100%' }} animate={{ x: 0 }} exit={{ x: '100%' }} transition={{ type: 'tween', duration: 0.23 }} className="absolute inset-0 z-40 overflow-y-auto bg-white text-[#315d61]">
            <div className="absolute inset-x-0 top-0 h-[47vh] opacity-30" style={{ background: `linear-gradient(180deg, ${TYPE_COLORS[selectedSpecies.types[0]]} 0%, #dff5ee 55%, white 100%)` }} />
            <div className="relative z-10 flex items-center justify-between px-4 pt-[max(18px,env(safe-area-inset-top))]">
              <button type="button" onClick={() => setSelectedUid(null)} className="flex h-11 w-11 items-center justify-center rounded-full bg-white/72 text-[#4f7473] shadow-sm backdrop-blur active:scale-95"><svg viewBox="0 0 24 24" className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth="2.4"><path d="m15 18-6-6 6-6" /></svg></button>
              <span className="rounded-full bg-white/65 px-3 py-1.5 text-xs font-black tracking-[0.12em] text-[#668481] backdrop-blur">#{selectedSpecies.id.toString().padStart(3, '0')}</span>
              <button type="button" onClick={() => onToggleFavorite(selected.uid)} className="flex h-11 w-11 items-center justify-center rounded-full bg-white/72 shadow-sm backdrop-blur active:scale-95"><StarIcon filled={!!selected.favorite} className="h-7 w-7" /></button>
            </div>

            <div className="relative z-10 mt-3 flex flex-col items-center">
              <div className="relative flex h-52 w-full items-center justify-center">
                <svg className="absolute top-2 h-32 w-72 opacity-65" viewBox="0 0 280 140"><path d="M20 130 A120 120 0 0 1 260 130" fill="none" stroke="white" strokeWidth="4" /><circle cx="140" cy="10" r="5" fill="white" /></svg>
                <div className="absolute top-5 rounded-full bg-white/75 px-4 py-1.5 shadow-sm backdrop-blur"><span className="text-xs font-black text-[#718986]">CP </span><span className="text-2xl font-black tracking-tight text-[#315d61]">{selected.cp}</span></div>
                <motion.div animate={{ y: [-4, 5, -4] }} transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }} className="mt-12 h-40 w-56"><PokemonSprite id={selectedSpecies.id} name={selectedSpecies.name} variant="artwork" className="h-full w-full object-contain drop-shadow-[0_16px_18px_rgba(35,73,72,.22)]" /></motion.div>
              </div>

              <section className="w-full rounded-t-[34px] bg-white px-5 pb-[max(30px,env(safe-area-inset-bottom))] pt-6 shadow-[0_-10px_28px_rgba(35,73,72,.08)]">
                <div className="text-center"><h2 className="text-3xl font-black tracking-[-0.04em] text-[#315d61]">{selectedSpecies.name}</h2><p className="mt-1 text-xs font-bold uppercase tracking-[0.13em] text-[#87a09c]">Level {selected.level} · IV {ivPercent(selected.ivs)}%</p></div>

                {(() => {
                  const hp = calculateHP(selectedSpecies.baseStats.stamina, selected.level, selected.ivs.stamina);
                  return <div className="mx-auto mt-4 max-w-sm"><div className="h-2 overflow-hidden rounded-full bg-[#dfeae7]"><div className="h-full w-full rounded-full bg-gradient-to-r from-[#65d46f] to-[#3daf70]" /></div><p className="mt-1.5 text-center text-xs font-black text-[#718986]">{hp} / {hp} HP</p></div>;
                })()}

                <div className="mt-5 grid grid-cols-3 divide-x divide-[#e3ece9] rounded-2xl bg-[#f5f9f7] py-4 ring-1 ring-[#e5efec]">
                  <div className="text-center"><p className="text-base font-black">{selectedSpecies.weightKg} kg</p><p className="mt-1 text-[9px] font-black uppercase tracking-wider text-[#8aa09d]">Weight</p></div>
                  <div className="flex flex-col items-center gap-1"><div className="flex gap-1">{selectedSpecies.types.map((type) => <span key={type} className="flex h-7 w-7 items-center justify-center rounded-full shadow-sm" style={{ background: TYPE_COLORS[type] }}><img src={getTypeIcon(type)} alt={type} className="h-4 w-4 object-contain" onError={(event) => { event.currentTarget.style.display = 'none'; }} /></span>)}</div><p className="text-[9px] font-black uppercase tracking-wider text-[#8aa09d]">Type</p></div>
                  <div className="text-center"><p className="text-base font-black">{selectedSpecies.heightM} m</p><p className="mt-1 text-[9px] font-black uppercase tracking-wider text-[#8aa09d]">Height</p></div>
                </div>

                {(() => {
                  const appraisal = getAppraisal(ivPercent(selected.ivs));
                  return <div className="mt-4 rounded-2xl bg-[#f7faf9] p-4 ring-1 ring-[#e6efec]"><div className="flex items-center justify-between"><div><p className="text-[10px] font-black uppercase tracking-[0.14em] text-[#8aa09d]">Appraisal</p><p className="text-sm font-black">{appraisal.label}</p></div><div className="flex gap-0.5">{[0, 1, 2].map((index) => <StarIcon key={index} filled={index < appraisal.stars} className="h-5 w-5" />)}</div></div><div className="mt-4 grid grid-cols-3 gap-2">{[['Attack', selected.ivs.attack], ['Defense', selected.ivs.defense], ['HP', selected.ivs.stamina]].map(([label, value]) => <div key={label as string}><div className="mb-1 flex justify-between text-[9px] font-black uppercase text-[#7f9994]"><span>{label}</span><span>{value}/15</span></div><div className="h-1.5 overflow-hidden rounded-full bg-[#dfeae7]"><div className="h-full rounded-full bg-[#ef9a52]" style={{ width: `${(Number(value) / 15) * 100}%` }} /></div></div>)}</div></div>;
                })()}

                <div className="mt-5 grid grid-cols-2 gap-3">
                  <div className="rounded-2xl bg-[#f4f9f7] p-3 ring-1 ring-[#e4eeeb]"><div className="flex items-center gap-2"><StardustIcon className="h-7 w-7" /><div><p className="text-lg font-black">{stardust.toLocaleString()}</p><p className="text-[9px] font-black uppercase tracking-wider text-[#8aa09d]">Stardust</p></div></div></div>
                  <div className="rounded-2xl bg-[#f4f9f7] p-3 ring-1 ring-[#e4eeeb]"><div className="flex items-center gap-2"><img src={CANDY_ICON} alt="Candy" className="h-7 w-7" onError={(event) => { event.currentTarget.style.display = 'none'; }} /><div><p className="text-lg font-black">{candies[selectedSpecies.family] || 0}</p><p className="truncate text-[9px] font-black uppercase tracking-wider text-[#8aa09d]">Candy</p></div></div></div>
                </div>

                {(() => {
                  const { fast, charged } = getMoveset(selectedSpecies.types);
                  return <div className="mt-5 rounded-2xl bg-[#f7faf9] p-4 ring-1 ring-[#e6efec]"><p className="mb-2 text-[10px] font-black uppercase tracking-[0.15em] text-[#8aa09d]">Moves</p>{[fast, charged].map((move, index) => <div key={`${move.name}-${index}`} className="flex items-center justify-between border-t border-[#e3ece9] py-3 first:border-t-0"><div className="flex items-center gap-2"><span className="flex h-8 w-8 items-center justify-center rounded-full" style={{ background: TYPE_COLORS[move.type] }}><img src={getTypeIcon(move.type)} alt={move.type} className="h-4 w-4" onError={(event) => { event.currentTarget.style.display = 'none'; }} /></span><p className="text-sm font-black">{move.name}</p></div><span className="text-[9px] font-black uppercase tracking-wider text-[#91a6a2]">{index === 0 ? 'Fast' : 'Charged'}</span></div>)}</div>;
                })()}

                {selected.level >= MAX_LEVEL ? <p className="mt-5 text-center text-xs font-black uppercase tracking-wider text-[#8ba09c]">Maximum level reached</p> : (() => {
                  const cost = powerUpCost(selected.level);
                  const canPowerUp = stardust >= cost.stardust && (candies[selectedSpecies.family] || 0) >= cost.candy;
                  return <button type="button" onClick={() => onPowerUp(selected.uid)} disabled={!canPowerUp} className="mt-5 flex w-full items-center justify-between rounded-full bg-gradient-to-r from-[#f4c34c] to-[#e5a62f] px-5 py-3.5 text-[#624a15] shadow-lg disabled:opacity-45"><span className="text-sm font-black uppercase tracking-[0.13em]">Power up</span><span className="flex items-center gap-3 text-xs font-black"><span className="flex items-center gap-1"><StardustIcon className="h-4 w-4" />{cost.stardust}</span><span className="flex items-center gap-1"><img src={CANDY_ICON} alt="" className="h-4 w-4" />{cost.candy}</span></span></button>;
                })()}

                {selectedSpecies.evolutions.map((evolution) => {
                  const target = getSpecies(evolution.toId);
                  if (!target) return null;
                  const canEvolve = (candies[selectedSpecies.family] || 0) >= evolution.candyCost;
                  return <button key={`${evolution.toId}-${evolution.candyCost}`} type="button" onClick={() => onEvolve(selected.uid, evolution.toId, evolution.candyCost)} disabled={!canEvolve} className="mt-3 flex w-full items-center justify-between rounded-full bg-gradient-to-r from-[#55c995] to-[#28a6a5] px-5 py-3.5 text-white shadow-lg disabled:opacity-45"><span className="text-sm font-black uppercase tracking-[0.13em]">Evolve to {target.name}</span><span className="flex items-center gap-1 text-sm font-black"><img src={CANDY_ICON} alt="" className="h-5 w-5" />{evolution.candyCost}</span></button>;
                })}
              </section>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

const PokemonIcon = () => (
  <svg viewBox="0 0 24 24" className="h-10 w-10" fill="none" stroke="currentColor" strokeWidth="1.7"><path d="M7 3 10 9M17 3l-3 6" /><path d="M6 13a6 6 0 0 1 12 0c0 4-3 7-6 7s-6-3-6-7Z" /><circle cx="9.5" cy="13.5" r=".8" fill="currentColor" /><circle cx="14.5" cy="13.5" r=".8" fill="currentColor" /></svg>
);

export default PokemonStorageScreen;
