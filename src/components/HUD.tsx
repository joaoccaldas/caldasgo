import React, { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import PokemonSprite from './PokemonSprite';

interface HUDProps {
  onOpenMenu: () => void;
  playerLevel: number;
  xpProgress: number;
}

type HudPanel = 'weather' | 'research' | 'nearby' | null;

const CloseIcon = () => (
  <svg viewBox="0 0 24 24" className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round">
    <path d="M18 6 6 18M6 6l12 12" />
  </svg>
);

const HUD: React.FC<HUDProps> = ({ onOpenMenu, playerLevel, xpProgress }) => {
  const [panel, setPanel] = useState<HudPanel>(null);
  const circumference = 2 * Math.PI * 33;

  return (
    <>
      <div className="pointer-events-none absolute inset-0 z-[400]">
        <button
          type="button"
          aria-label="Open trainer profile"
          className="pointer-events-auto absolute left-3 top-[max(14px,env(safe-area-inset-top))] flex items-center gap-2 rounded-full bg-white/88 p-1.5 pr-3 shadow-[0_5px_18px_rgba(29,70,77,.28)] ring-1 ring-white/80 backdrop-blur-md active:scale-95"
        >
          <div className="relative h-[62px] w-[62px] shrink-0">
            <svg className="absolute inset-0 h-full w-full -rotate-90" viewBox="0 0 72 72" aria-hidden="true">
              <circle cx="36" cy="36" r="33" fill="none" stroke="rgba(34,73,84,.22)" strokeWidth="5" />
              <circle cx="36" cy="36" r="33" fill="none" stroke="#f7c649" strokeWidth="5" strokeLinecap="round" strokeDasharray={circumference} strokeDashoffset={circumference * (1 - Math.min(1, Math.max(0, xpProgress)))} style={{ filter: 'drop-shadow(0 0 2px rgba(247,198,73,.7))', transition: 'stroke-dashoffset .35s ease' }} />
            </svg>
            <div className="absolute inset-[6px] overflow-hidden rounded-full border-2 border-white bg-gradient-to-b from-[#bfe9f4] to-[#74c99d] shadow-inner">
              <img src="https://cdn.jsdelivr.net/gh/PokeAPI/sprites@master/sprites/pokemon/other/official-artwork/25.png" alt="Trainer avatar" className="h-[112%] w-[112%] -translate-x-1 -translate-y-0.5 object-cover" onError={(event) => { event.currentTarget.src = 'https://cdn.jsdelivr.net/gh/PokeAPI/sprites@master/sprites/pokemon/25.png'; }} />
            </div>
            <span className="absolute -bottom-1 left-1/2 min-w-7 -translate-x-1/2 rounded-full border border-white bg-[#3f8ac7] px-2 py-0.5 text-[10px] font-black leading-none text-white shadow-md">{playerLevel}</span>
          </div>
          <div className="hidden min-[390px]:block text-left">
            <p className="text-[9px] font-black uppercase tracking-[0.14em] text-[#5f8185]">Trainer</p>
            <p className="text-sm font-black leading-tight text-[#28545b]">Caldas</p>
            <div className="mt-1 h-1.5 w-16 overflow-hidden rounded-full bg-[#d6e7e4]"><div className="h-full rounded-full bg-[#f7c649]" style={{ width: `${Math.round(xpProgress * 100)}%` }} /></div>
          </div>
        </button>

        <div className="pointer-events-auto absolute right-3 top-[max(14px,env(safe-area-inset-top))] flex flex-col items-end gap-2.5">
          <button type="button" onClick={() => setPanel('weather')} aria-label="Open weather information" className="relative flex h-12 w-12 items-center justify-center rounded-full border border-white/80 bg-gradient-to-br from-[#61d5c3] to-[#2a9db0] text-white shadow-[0_5px_16px_rgba(28,86,95,.28)] backdrop-blur active:scale-95">
            <svg viewBox="0 0 24 24" className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="4" fill="rgba(255,255,255,.22)" /><path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4" /></svg>
            <span className="absolute -bottom-1 -right-1 flex h-5 min-w-5 items-center justify-center rounded-full border border-white bg-[#f6c243] px-1 text-[8px] font-black text-[#3b6066]">18°</span>
          </button>
          <button type="button" aria-label="Recenter map" className="flex h-10 w-10 items-center justify-center rounded-full border border-white/75 bg-white/88 text-[#376d75] shadow-[0_4px_13px_rgba(29,70,77,.22)] backdrop-blur active:scale-95">
            <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2.1" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="3" /><path d="M12 2v3M12 19v3M2 12h3M19 12h3" /><circle cx="12" cy="12" r="7" /></svg>
          </button>
        </div>

        <div className="pointer-events-auto absolute bottom-[max(22px,env(safe-area-inset-bottom))] left-0 right-0 flex items-end justify-between px-3.5">
          <div className="flex items-end gap-2">
            <button type="button" className="relative active:scale-95" aria-label="Open buddy">
              <div className="flex h-[60px] w-[60px] items-center justify-center overflow-hidden rounded-full border-[3px] border-white bg-gradient-to-b from-[#d8f29b] to-[#7bc978] shadow-[0_5px_16px_rgba(31,75,69,.3)]"><PokemonSprite id={1} name="Buddy" className="h-[112%] w-[112%] object-contain" /></div>
              <span className="absolute -right-1 -top-1 flex h-6 w-6 items-center justify-center rounded-full border-2 border-white bg-[#ef6270] text-white shadow-sm"><svg viewBox="0 0 24 24" className="h-3.5 w-3.5" fill="currentColor"><path d="M12 21s-8-4.4-8-11a4.5 4.5 0 0 1 8-2.8A4.5 4.5 0 0 1 20 10c0 6.6-8 11-8 11Z" /></svg></span>
            </button>
            <button type="button" onClick={() => setPanel('research')} className="relative mb-0.5 flex h-11 w-11 items-center justify-center rounded-full border border-white/80 bg-white/92 text-[#376d75] shadow-[0_4px_13px_rgba(29,70,77,.24)] backdrop-blur active:scale-95" aria-label="Open research">
              <svg viewBox="0 0 24 24" className="h-[22px] w-[22px]" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 3h6l1 3h3v15H5V6h3l1-3Z" /><path d="M9 11h6M9 15h6" /></svg>
              <span className="absolute -right-0.5 -top-0.5 h-3 w-3 rounded-full border-2 border-white bg-[#ef5c6d]" />
            </button>
          </div>

          <motion.button type="button" whileTap={{ scale: 0.93 }} onClick={onOpenMenu} aria-label="Open main menu" className="relative mb-[-5px] h-[82px] w-[82px] rounded-full drop-shadow-[0_8px_11px_rgba(23,62,70,.35)]">
            <img src="https://cdn.jsdelivr.net/gh/PokeMiners/pogo_assets@master/Images/Menu%20Icons/btn_action_menu.png" alt="" className="h-full w-full object-contain" onError={(event) => { event.currentTarget.src = 'https://cdn.jsdelivr.net/gh/PokeAPI/sprites@master/sprites/items/poke-ball.png'; }} />
          </motion.button>

          <button type="button" onClick={() => setPanel('nearby')} aria-label="Open nearby Pokémon" className="mb-0.5 flex h-[54px] min-w-[102px] items-center justify-center gap-0.5 overflow-hidden rounded-[16px] border border-white/85 bg-white/92 px-2 shadow-[0_5px_16px_rgba(29,70,77,.28)] backdrop-blur active:scale-95">
            {[1, 4, 7].map((id) => <div key={id} className="h-8 w-8 opacity-90"><PokemonSprite id={id} name="Nearby" className="h-full w-full object-contain" /></div>)}
            <svg viewBox="0 0 24 24" className="ml-0.5 h-4 w-4 text-[#55a684]" fill="none" stroke="currentColor" strokeWidth="2.2"><path d="m9 18 6-6-6-6" /></svg>
          </button>
        </div>
      </div>

      <AnimatePresence>
        {panel && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="absolute inset-0 z-[575] flex items-end bg-[#143c46]/35 px-3 pb-[max(12px,env(safe-area-inset-bottom))] backdrop-blur-[2px]" onClick={() => setPanel(null)}>
            <motion.section initial={{ y: '105%' }} animate={{ y: 0 }} exit={{ y: '105%' }} transition={{ type: 'spring', stiffness: 260, damping: 26 }} onClick={(event) => event.stopPropagation()} className="w-full overflow-hidden rounded-[28px] border border-white/80 bg-[#f9fcfb] shadow-[0_22px_55px_rgba(14,56,64,.35)]">
              <div className="flex items-center justify-between border-b border-[#dfecea] px-5 py-4">
                <div><p className="text-[10px] font-black uppercase tracking-[0.16em] text-[#72a09d]">CaldasGO</p><h3 className="text-xl font-black tracking-tight text-[#28555b]">{panel === 'weather' ? 'Current weather' : panel === 'research' ? 'Field research' : 'Nearby Pokémon'}</h3></div>
                <button type="button" onClick={() => setPanel(null)} className="flex h-10 w-10 items-center justify-center rounded-full bg-[#e9f3f1] text-[#47777b] active:scale-95"><CloseIcon /></button>
              </div>

              {panel === 'weather' && <div className="p-5"><div className="flex items-center gap-4 rounded-2xl bg-gradient-to-r from-[#51c9b0] to-[#338eaa] p-4 text-white shadow-lg"><div className="flex h-16 w-16 items-center justify-center rounded-full bg-white/18 ring-1 ring-white/35"><svg viewBox="0 0 24 24" className="h-9 w-9" fill="none" stroke="currentColor" strokeWidth="1.8"><circle cx="12" cy="12" r="4" /><path d="M12 2v2M12 20v2M2 12h2M20 12h2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4" /></svg></div><div><p className="text-3xl font-black">18°C</p><p className="text-sm font-bold text-white/85">Clear weather</p></div></div><p className="mt-4 text-xs font-black uppercase tracking-[0.12em] text-[#6a8e8e]">Weather boost</p><div className="mt-2 grid grid-cols-3 gap-2">{['Fire', 'Grass', 'Ground'].map((type) => <div key={type} className="rounded-xl bg-[#edf6f2] px-3 py-3 text-center text-xs font-black text-[#396d70] ring-1 ring-[#dcece6]">{type}</div>)}</div></div>}

              {panel === 'research' && <div className="space-y-3 p-5">{[['Catch 3 Pokémon', '1 / 3', 33], ['Visit 2 PokéStops', '0 / 2', 0], ['Make a Great Throw', 'Ready', 100]].map(([label, value, progress]) => <div key={label as string} className="rounded-2xl bg-white p-4 shadow-sm ring-1 ring-[#dfebe8]"><div className="flex items-center justify-between gap-3"><p className="text-sm font-black text-[#315e63]">{label}</p><span className="rounded-full bg-[#eaf5ef] px-2.5 py-1 text-[10px] font-black text-[#458576]">{value}</span></div><div className="mt-3 h-2 overflow-hidden rounded-full bg-[#dbeae6]"><div className="h-full rounded-full bg-gradient-to-r from-[#66ce99] to-[#29afa8]" style={{ width: `${progress}%` }} /></div></div>)}</div>}

              {panel === 'nearby' && <div className="grid grid-cols-3 gap-3 p-5">{[1, 4, 7, 25, 133, 143].map((id, index) => <button key={id} type="button" className="rounded-2xl bg-[#edf6f2] p-2 text-center ring-1 ring-[#dcece6] active:scale-95"><div className="mx-auto h-16 w-16"><PokemonSprite id={id} name="Nearby" className="h-full w-full object-contain" /></div><p className="mt-1 text-[10px] font-black uppercase tracking-wide text-[#4f777a]">{index < 3 ? `${80 + index * 45} m` : 'Explore'}</p></button>)}</div>}
            </motion.section>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default HUD;
