import React, { useMemo, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { useInventory } from '../hooks/useInventory';

interface InventoryScreenProps {
  onClose: () => void;
}

type ItemCategory = 'all' | 'medicine' | 'balls' | 'berries' | 'boosts';

type InventoryItem = {
  id: string;
  name: string;
  count: number;
  image: string;
  desc: string;
  category: Exclude<ItemCategory, 'all'>;
  tint: string;
};

const ITEM_BASE = 'https://cdn.jsdelivr.net/gh/PokeAPI/sprites@master/sprites/items/';

const InventoryScreen: React.FC<InventoryScreenProps> = ({ onClose }) => {
  const { inventory } = useInventory();
  const [category, setCategory] = useState<ItemCategory>('all');
  const [selected, setSelected] = useState<InventoryItem | null>(null);

  const items: InventoryItem[] = useMemo(() => [
    { id: 'potion', name: 'Potion', count: 12, image: `${ITEM_BASE}potion.png`, desc: 'A spray-type medicine that restores 20 HP to one Pokémon.', category: 'medicine', tint: '#dff1ff' },
    { id: 'super-potion', name: 'Super Potion', count: 5, image: `${ITEM_BASE}super-potion.png`, desc: 'A stronger medicine that restores 50 HP to one Pokémon.', category: 'medicine', tint: '#f0e4ff' },
    { id: 'hyper-potion', name: 'Hyper Potion', count: 3, image: `${ITEM_BASE}hyper-potion.png`, desc: 'A powerful medicine that restores 200 HP to one Pokémon.', category: 'medicine', tint: '#ffe3f1' },
    { id: 'revive', name: 'Revive', count: 3, image: `${ITEM_BASE}revive.png`, desc: 'Revives a fainted Pokémon and restores half of its maximum HP.', category: 'medicine', tint: '#fff1c8' },
    { id: 'poke-ball', name: 'Poké Ball', count: inventory.pokeballs, image: `${ITEM_BASE}poke-ball.png`, desc: 'A standard device used to catch wild Pokémon.', category: 'balls', tint: '#ffe7e7' },
    { id: 'great-ball', name: 'Great Ball', count: 15, image: `${ITEM_BASE}great-ball.png`, desc: 'A high-performance Ball with a better catch rate.', category: 'balls', tint: '#e0eeff' },
    { id: 'ultra-ball', name: 'Ultra Ball', count: 8, image: `${ITEM_BASE}ultra-ball.png`, desc: 'An ultra-high-performance Ball with an excellent catch rate.', category: 'balls', tint: '#fff1bd' },
    { id: 'razz-berry', name: 'Razz Berry', count: inventory.razzBerries, image: `${ITEM_BASE}razz-berry.png`, desc: 'Feed this to a wild Pokémon to make it easier to catch.', category: 'berries', tint: '#ffe4f0' },
    { id: 'nanab-berry', name: 'Nanab Berry', count: 6, image: `${ITEM_BASE}nanab-berry.png`, desc: 'Calms a wild Pokémon and makes its movement less erratic.', category: 'berries', tint: '#fff0dc' },
    { id: 'golden-razz-berry', name: 'Golden Razz Berry', count: 2, image: `${ITEM_BASE}golden-razz-berry.png`, desc: 'Makes a wild Pokémon much easier to catch.', category: 'berries', tint: '#fff3c4' },
    { id: 'incense', name: 'Incense', count: 2, image: `${ITEM_BASE}incense.png`, desc: 'Attracts wild Pokémon to your location for a limited time.', category: 'boosts', tint: '#e6e2ff' },
    { id: 'lucky-egg', name: 'Lucky Egg', count: 1, image: `${ITEM_BASE}lucky-egg.png`, desc: 'Doubles the XP you earn for a limited time.', category: 'boosts', tint: '#fff4c4' },
  ], [inventory.pokeballs, inventory.razzBerries]);

  const shownItems = category === 'all' ? items : items.filter((item) => item.category === category);
  const totalItems = items.reduce((sum, item) => sum + item.count, 0);
  const capacity = 350;

  return (
    <motion.div initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 40 }} className="absolute inset-0 z-[700] flex flex-col overflow-hidden bg-[linear-gradient(180deg,#f8fbfa_0%,#edf5f3_100%)] text-[#315d61]">
      <header className="shrink-0 border-b border-[#dce9e6] bg-white/94 px-4 pb-3 pt-[max(18px,env(safe-area-inset-top))] shadow-sm backdrop-blur">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-[10px] font-black uppercase tracking-[0.18em] text-[#7c9f9a]">Trainer bag</p>
            <h1 className="text-2xl font-black tracking-[-0.04em] text-[#315d61]">Items</h1>
          </div>
          <div className="flex items-center gap-2 rounded-full bg-[#edf5f2] px-3 py-2 ring-1 ring-[#ddeae6]">
            <svg viewBox="0 0 24 24" className="h-5 w-5 text-[#4b807b]" fill="none" stroke="currentColor" strokeWidth="2"><path d="M5 8h14l-1 13H6L5 8Z" /><path d="M9 8V5a3 3 0 0 1 6 0v3" /></svg>
            <span className="text-sm font-black">{totalItems} / {capacity}</span>
          </div>
        </div>
        <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-[#dce9e5]"><div className="h-full rounded-full bg-gradient-to-r from-[#55c89f] to-[#2ca7ad]" style={{ width: `${Math.min(100, (totalItems / capacity) * 100)}%` }} /></div>
      </header>

      <nav className="shrink-0 overflow-x-auto border-b border-[#dce9e6] bg-white/88 px-3 py-2 no-scrollbar">
        <div className="flex min-w-max gap-2">
          {([
            ['all', 'All'],
            ['medicine', 'Medicine'],
            ['balls', 'Balls'],
            ['berries', 'Berries'],
            ['boosts', 'Boosts'],
          ] as [ItemCategory, string][]).map(([key, label]) => (
            <button key={key} type="button" onClick={() => setCategory(key)} className={`rounded-full px-4 py-2 text-[11px] font-black uppercase tracking-[0.1em] transition-colors ${category === key ? 'bg-[#2e9da1] text-white shadow-sm' : 'bg-[#edf4f1] text-[#648681]'}`}>
              {label}
            </button>
          ))}
        </div>
      </nav>

      <div className="min-h-0 flex-1 overflow-y-auto px-3 pb-28 pt-3">
        <div className="space-y-2.5">
          {shownItems.map((item) => (
            <motion.button key={item.id} type="button" whileTap={{ scale: 0.985 }} onClick={() => setSelected(item)} className="flex w-full items-center gap-3 rounded-[22px] border border-white bg-white/92 p-3 text-left shadow-[0_4px_13px_rgba(47,91,83,.08)] ring-1 ring-[#e4eeeb]">
              <div className="relative flex h-[72px] w-[72px] shrink-0 items-center justify-center overflow-hidden rounded-[19px]" style={{ background: item.tint }}>
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_35%_25%,rgba(255,255,255,.9),transparent_55%)]" />
                <img src={item.image} alt={item.name} className="relative h-[64px] w-[64px] object-contain drop-shadow-md" />
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex items-start justify-between gap-3">
                  <div><p className="text-base font-black leading-tight text-[#315d61]">{item.name}</p><p className="mt-1 line-clamp-2 text-xs leading-5 text-[#78918d]">{item.desc}</p></div>
                  <span className="shrink-0 rounded-full bg-[#edf5f2] px-2.5 py-1 text-xs font-black text-[#4c7774]">×{item.count}</span>
                </div>
              </div>
              <svg viewBox="0 0 24 24" className="h-5 w-5 shrink-0 text-[#9ab0ad]" fill="none" stroke="currentColor" strokeWidth="2.2"><path d="m9 18 6-6-6-6" /></svg>
            </motion.button>
          ))}
        </div>
      </div>

      <div className="pointer-events-none absolute inset-x-0 bottom-0 flex justify-center bg-gradient-to-t from-[#edf5f3] via-[#edf5f3]/95 to-transparent pb-[max(18px,env(safe-area-inset-bottom))] pt-10">
        <motion.button type="button" whileTap={{ scale: 0.9 }} onClick={onClose} className="pointer-events-auto flex h-16 w-16 items-center justify-center rounded-full border-2 border-white bg-white/95 text-[#39716f] shadow-[0_8px_22px_rgba(47,91,83,.2)] ring-1 ring-[#cfe3dc]" aria-label="Close items">
          <svg viewBox="0 0 24 24" className="h-8 w-8" fill="none" stroke="currentColor" strokeWidth="2.3" strokeLinecap="round"><path d="M18 6 6 18M6 6l12 12" /></svg>
        </motion.button>
      </div>

      <AnimatePresence>
        {selected && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setSelected(null)} className="absolute inset-0 z-30 flex items-end bg-[#163e46]/38 px-3 pb-[max(12px,env(safe-area-inset-bottom))] backdrop-blur-[2px]">
            <motion.section initial={{ y: '105%' }} animate={{ y: 0 }} exit={{ y: '105%' }} transition={{ type: 'spring', stiffness: 260, damping: 26 }} onClick={(event) => event.stopPropagation()} className="w-full overflow-hidden rounded-[28px] bg-white shadow-[0_24px_60px_rgba(16,58,65,.35)]">
              <div className="relative flex flex-col items-center px-6 pb-6 pt-7">
                <button type="button" onClick={() => setSelected(null)} className="absolute right-4 top-4 flex h-9 w-9 items-center justify-center rounded-full bg-[#edf4f2] text-[#64827f]" aria-label="Close details"><svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2.2"><path d="M18 6 6 18M6 6l12 12" /></svg></button>
                <div className="flex h-32 w-32 items-center justify-center rounded-[30px]" style={{ background: selected.tint }}><img src={selected.image} alt={selected.name} className="h-28 w-28 object-contain drop-shadow-xl" /></div>
                <h2 className="mt-4 text-2xl font-black tracking-tight text-[#315d61]">{selected.name}</h2>
                <span className="mt-2 rounded-full bg-[#edf5f2] px-3 py-1 text-xs font-black text-[#4c7774]">You have {selected.count}</span>
                <p className="mt-4 max-w-sm text-center text-sm leading-6 text-[#758e8a]">{selected.desc}</p>
                <button type="button" disabled={selected.count === 0} className="mt-6 h-13 w-full rounded-full bg-gradient-to-r from-[#5acb9d] to-[#2ca6ad] py-3.5 text-sm font-black uppercase tracking-[0.16em] text-white shadow-lg disabled:opacity-40">Use item</button>
              </div>
            </motion.section>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default InventoryScreen;
