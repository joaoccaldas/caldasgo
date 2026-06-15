import React, { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Backpack, Camera, Megaphone, Settings, ShoppingBag, Ticket, X } from 'lucide-react';

interface MainMenuProps {
  onClose: () => void;
  onOpenPokedex: () => void;
  onOpenInventory: () => void;
  onOpenStorage: () => void;
}

type MenuView = 'root' | 'settings' | 'events' | 'battle' | 'shop' | 'camera' | 'news';

const TEAL = '#216f70';

const PokedexIcon = () => (
  <svg viewBox="0 0 24 24" className="h-9 w-9" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <rect x="5" y="3" width="14" height="18" rx="2" /><circle cx="9" cy="8" r="2.2" /><path d="M14 7h3M14 10h3M8 14h8M8 17h8" />
  </svg>
);

const BattleIcon = () => (
  <svg viewBox="0 0 24 24" className="h-9 w-9" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="M4 6h16l-8 14L4 6Z" /><path d="m9 9 3 3 3-3" /><circle cx="12" cy="14.5" r="1.4" fill="currentColor" stroke="none" />
  </svg>
);

const PokemonIcon = () => (
  <svg viewBox="0 0 24 24" className="h-9 w-9" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="M7 3 10 9M17 3l-3 6" /><path d="M6 13a6 6 0 0 1 12 0c0 4-3 7-6 7s-6-3-6-7Z" /><circle cx="9.5" cy="13.5" r=".8" fill="currentColor" stroke="none" /><circle cx="14.5" cy="13.5" r=".8" fill="currentColor" stroke="none" />
  </svg>
);

interface MenuButtonProps {
  label: string;
  icon: React.ReactNode;
  onClick: () => void;
  delay: number;
  notify?: boolean;
  accent?: boolean;
}

const MenuButton: React.FC<MenuButtonProps> = ({ label, icon, onClick, delay, notify, accent }) => (
  <motion.button
    type="button"
    initial={{ opacity: 0, scale: 0.55, y: 12 }}
    animate={{ opacity: 1, scale: 1, y: 0 }}
    transition={{ delay, type: 'spring', stiffness: 230, damping: 18 }}
    whileTap={{ scale: 0.93 }}
    onClick={onClick}
    className="group flex w-[92px] flex-col items-center gap-2"
  >
    <div className={`relative flex h-[76px] w-[76px] items-center justify-center rounded-full border-2 border-white/95 shadow-[0_7px_18px_rgba(48,96,81,.18)] ring-1 ${accent ? 'bg-gradient-to-br from-[#54cbb4] to-[#319bad] text-white ring-[#50b6aa]/40' : 'bg-white/92 text-[#2b7572] ring-[#cce5d1]'}`}>
      {icon}
      {notify && <span className="absolute -right-0.5 -top-0.5 h-4 w-4 rounded-full border-[3px] border-white bg-[#f35f72]" />}
    </div>
    <span className="text-[12px] font-black uppercase tracking-[0.09em] text-[#236a68] drop-shadow-[0_1px_0_rgba(255,255,255,.7)]">{label}</span>
  </motion.button>
);

const BackButton = ({ onClick }: { onClick: () => void }) => (
  <button type="button" onClick={onClick} className="flex h-11 w-11 items-center justify-center rounded-full bg-white/85 text-[#2e6e70] shadow-md ring-1 ring-white active:scale-95" aria-label="Back">
    <svg viewBox="0 0 24 24" className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round"><path d="m15 18-6-6 6-6" /></svg>
  </button>
);

interface SubmenuShellProps {
  title: string;
  eyebrow: string;
  onBack: () => void;
  children: React.ReactNode;
}

const SubmenuShell: React.FC<SubmenuShellProps> = ({ title, eyebrow, onBack, children }) => (
  <motion.div initial={{ x: '100%' }} animate={{ x: 0 }} exit={{ x: '100%' }} transition={{ type: 'tween', duration: 0.22 }} className="absolute inset-0 z-20 flex flex-col bg-[linear-gradient(180deg,#eaf8ee_0%,#d8efd5_52%,#b8e29e_100%)]">
    <div className="shrink-0 px-4 pb-4 pt-[max(18px,env(safe-area-inset-top))]">
      <div className="flex items-center gap-3">
        <BackButton onClick={onBack} />
        <div><p className="text-[10px] font-black uppercase tracking-[0.18em] text-[#75a28f]">{eyebrow}</p><h2 className="text-2xl font-black tracking-[-0.035em] text-[#285f61]">{title}</h2></div>
      </div>
    </div>
    <div className="min-h-0 flex-1 overflow-y-auto px-4 pb-[max(28px,env(safe-area-inset-bottom))]">{children}</div>
  </motion.div>
);

const ToggleRow = ({ label, description, enabled, onToggle }: { label: string; description: string; enabled: boolean; onToggle: () => void }) => (
  <button type="button" onClick={onToggle} className="flex w-full items-center justify-between gap-4 border-b border-[#deebe3] px-4 py-4 text-left last:border-0">
    <div><p className="text-sm font-black text-[#315f62]">{label}</p><p className="mt-0.5 text-xs leading-5 text-[#77918e]">{description}</p></div>
    <div className={`relative h-7 w-12 shrink-0 rounded-full p-1 transition-colors ${enabled ? 'bg-[#43baa4]' : 'bg-[#c8d8d3]'}`}><span className={`block h-5 w-5 rounded-full bg-white shadow-sm transition-transform ${enabled ? 'translate-x-5' : 'translate-x-0'}`} /></div>
  </button>
);

const MainMenu: React.FC<MainMenuProps> = ({ onClose, onOpenPokedex, onOpenInventory, onOpenStorage }) => {
  const [view, setView] = useState<MenuView>('root');
  const [sound, setSound] = useState(true);
  const [vibration, setVibration] = useState(true);
  const [batterySaver, setBatterySaver] = useState(false);

  const closeOrBack = () => {
    if (view === 'root') onClose();
    else setView('root');
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.2 }} className="absolute inset-0 z-[600] overflow-hidden bg-[linear-gradient(150deg,#f3faec_0%,#dff2cf_44%,#a9df8d_100%)]">
      <div className="pointer-events-none absolute inset-0 opacity-60">
        <div className="absolute -left-32 top-8 h-80 w-80 rounded-full border border-white/45" />
        <div className="absolute -left-20 top-20 h-56 w-56 rounded-full border border-white/35" />
        <div className="absolute -right-28 bottom-12 h-72 w-72 rounded-full border border-white/45" />
        <svg className="absolute inset-x-0 bottom-0 h-[48%] w-full" viewBox="0 0 390 360" preserveAspectRatio="none" aria-hidden="true"><path d="M0 245 C75 182 116 228 178 170 C245 107 309 175 390 94 V360 H0Z" fill="rgba(255,255,255,.16)" /><path d="M0 285 C75 225 129 273 194 208 C254 149 327 206 390 146" fill="none" stroke="rgba(255,255,255,.38)" strokeWidth="3" /></svg>
      </div>

      <AnimatePresence mode="wait">
        {view === 'root' ? (
          <motion.div key="root" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="relative flex h-full flex-col px-4 pb-[max(20px,env(safe-area-inset-bottom))] pt-[max(18px,env(safe-area-inset-top))]">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-[10px] font-black uppercase tracking-[0.2em] text-[#6e9b84]">CaldasGO</p>
                <h1 className="mt-0.5 text-2xl font-black tracking-[-0.04em] text-[#285f61]">Main menu</h1>
              </div>
              <div className="flex flex-col items-end gap-3">
                <button type="button" onClick={() => setView('settings')} className="flex items-center gap-2 rounded-full bg-white/55 px-3 py-2 text-[#286d6c] backdrop-blur-sm active:scale-95"><span className="text-[11px] font-black uppercase tracking-[0.1em]">Settings</span><Settings className="h-5 w-5" strokeWidth={2} /></button>
                <button type="button" onClick={() => setView('events')} className="flex items-center gap-2 rounded-full bg-white/55 px-3 py-2 text-[#286d6c] backdrop-blur-sm active:scale-95"><span className="text-[11px] font-black uppercase tracking-[0.1em]">Events</span><Ticket className="h-5 w-5" strokeWidth={2} /></button>
              </div>
            </div>

            <div className="flex flex-1 items-center justify-center py-4">
              <div className="grid w-full max-w-[360px] grid-cols-3 place-items-center gap-x-5 gap-y-5">
                <div className="col-start-1"><MenuButton label="Pokédex" icon={<PokedexIcon />} onClick={onOpenPokedex} delay={0.04} /></div>
                <div className="col-start-3"><MenuButton label="Battle" icon={<BattleIcon />} onClick={() => setView('battle')} delay={0.08} notify /></div>
                <div className="col-start-2"><MenuButton label="Shop" icon={<ShoppingBag className="h-9 w-9" strokeWidth={1.9} />} onClick={() => setView('shop')} delay={0.12} accent /></div>
                <div className="col-start-1"><MenuButton label="Pokémon" icon={<PokemonIcon />} onClick={onOpenStorage} delay={0.16} /></div>
                <div className="col-start-3"><MenuButton label="Items" icon={<Backpack className="h-9 w-9" strokeWidth={1.9} />} onClick={onOpenInventory} delay={0.2} /></div>
              </div>
            </div>

            <div className="mx-auto flex w-full max-w-[290px] items-center justify-between">
              <button type="button" onClick={() => setView('camera')} className="relative flex h-12 w-12 items-center justify-center rounded-full bg-white/58 text-[#2c7270] ring-1 ring-white/80 active:scale-95" aria-label="Camera"><Camera className="h-6 w-6" strokeWidth={1.9} /><span className="absolute -right-0.5 -top-0.5 h-3 w-3 rounded-full border-2 border-white bg-[#f05d70]" /></button>
              <motion.button type="button" whileTap={{ scale: 0.9 }} onClick={closeOrBack} className="flex h-16 w-16 items-center justify-center rounded-full border-2 border-white bg-white/82 text-[#2d706e] shadow-[0_7px_18px_rgba(42,100,83,.2)] ring-1 ring-[#bfdfbf]" aria-label="Close menu"><X className="h-8 w-8" strokeWidth={2.25} /></motion.button>
              <button type="button" onClick={() => setView('news')} className="relative flex h-12 w-12 items-center justify-center rounded-full bg-white/58 text-[#2c7270] ring-1 ring-white/80 active:scale-95" aria-label="News"><Megaphone className="h-6 w-6" strokeWidth={1.9} /><span className="absolute -right-0.5 -top-0.5 h-3 w-3 rounded-full border-2 border-white bg-[#f05d70]" /></button>
            </div>
          </motion.div>
        ) : null}
      </AnimatePresence>

      <AnimatePresence>
        {view === 'settings' && <SubmenuShell title="Settings" eyebrow="Game preferences" onBack={() => setView('root')}><div className="overflow-hidden rounded-[24px] bg-white/88 shadow-sm ring-1 ring-white"><ToggleRow label="Music and sound" description="Play map, encounter and menu audio." enabled={sound} onToggle={() => setSound(!sound)} /><ToggleRow label="Vibration" description="Use haptic feedback for catches and rewards." enabled={vibration} onToggle={() => setVibration(!vibration)} /><ToggleRow label="Battery saver" description="Dim the screen when the phone points downward." enabled={batterySaver} onToggle={() => setBatterySaver(!batterySaver)} /></div><div className="mt-4 rounded-[24px] bg-white/72 p-4 ring-1 ring-white"><p className="text-[10px] font-black uppercase tracking-[0.15em] text-[#779b91]">Local project</p><p className="mt-1 text-sm font-black text-[#315f62]">CaldasGO v1.0</p><p className="mt-1 text-xs leading-5 text-[#77918e]">Unofficial educational programming project. Location data stays in the browser session.</p></div></SubmenuShell>}

        {view === 'events' && <SubmenuShell title="Events" eyebrow="Today in CaldasGO" onBack={() => setView('root')}><div className="space-y-4"><div className="overflow-hidden rounded-[26px] bg-gradient-to-br from-[#297e91] to-[#51c89e] text-white shadow-lg"><div className="p-5"><span className="rounded-full bg-white/18 px-3 py-1 text-[10px] font-black uppercase tracking-[0.12em]">Live now</span><h3 className="mt-4 text-2xl font-black tracking-tight">Starter discovery hour</h3><p className="mt-2 text-sm leading-6 text-white/85">Bulbasaur, Charmander and Squirtle appear more often nearby.</p><div className="mt-4 h-2 overflow-hidden rounded-full bg-white/20"><div className="h-full w-2/3 rounded-full bg-[#ffe28a]" /></div><p className="mt-2 text-[10px] font-black uppercase tracking-wider text-white/75">40 minutes remaining</p></div></div><div className="rounded-[24px] bg-white/84 p-5 ring-1 ring-white"><p className="text-[10px] font-black uppercase tracking-[0.15em] text-[#77a095]">Next event</p><h3 className="mt-1 text-lg font-black text-[#315f62]">Evening exploration</h3><p className="mt-2 text-sm leading-6 text-[#76908d]">Ghost-type creatures receive a night-time spawn boost after sunset.</p></div></div></SubmenuShell>}

        {view === 'battle' && <SubmenuShell title="Battle" eyebrow="Trainer challenge" onBack={() => setView('root')}><div className="overflow-hidden rounded-[28px] bg-gradient-to-br from-[#273e63] via-[#3c5b8f] to-[#7f55a4] p-5 text-white shadow-xl"><p className="text-[10px] font-black uppercase tracking-[0.16em] text-white/70">Season 1</p><h3 className="mt-1 text-3xl font-black tracking-tight">Caldas League</h3><p className="mt-2 max-w-[280px] text-sm leading-6 text-white/78">Choose a league, build a team of three and face a local AI trainer.</p><div className="mt-5 flex items-center justify-between rounded-2xl bg-white/12 p-3 ring-1 ring-white/15"><div><p className="text-[10px] font-black uppercase tracking-wider text-white/65">Current rank</p><p className="text-xl font-black">Rookie I</p></div><div className="flex h-14 w-14 items-center justify-center rounded-full bg-[#f6c84d] text-2xl font-black text-[#4a4565] ring-4 ring-white/20">1</div></div></div><div className="mt-4 space-y-3">{[['Great League', 'CP 1,500 max', '#52bfa8'], ['Ultra League', 'CP 2,500 max', '#5e8ed0'], ['Master League', 'No CP limit', '#8265b8']].map(([name, rule, color]) => <button key={name} type="button" className="flex w-full items-center justify-between rounded-2xl bg-white/86 p-4 text-left ring-1 ring-white active:scale-[.99]"><div><p className="text-base font-black text-[#315f62]">{name}</p><p className="text-xs font-bold text-[#7d9692]">{rule}</p></div><span className="flex h-10 w-10 items-center justify-center rounded-full text-white" style={{ background: color }}><BattleIcon /></span></button>)}</div></SubmenuShell>}

        {view === 'shop' && <SubmenuShell title="Shop" eyebrow="Items and upgrades" onBack={() => setView('root')}><div className="mb-4 flex items-center justify-between rounded-2xl bg-white/86 px-4 py-3 ring-1 ring-white"><div><p className="text-[10px] font-black uppercase tracking-[0.14em] text-[#7b9d94]">PokéCoins</p><p className="text-2xl font-black text-[#315f62]">1,250</p></div><div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#f8cf4b] text-lg font-black text-[#785f13] ring-4 ring-[#fff3bd]">C</div></div><div className="grid grid-cols-2 gap-3">{[
          ['Adventure Box', '480', 'great-ball.png', 'Balls and berries'],
          ['Poké Balls ×20', '100', 'poke-ball.png', 'Catch essentials'],
          ['Lucky Egg', '80', 'lucky-egg.png', 'Double XP'],
          ['Incense', '80', 'incense.png', 'Attract creatures'],
          ['Egg Incubator', '150', 'egg-incubator.png', 'Hatch one egg'],
          ['Bag Upgrade', '200', 'item-finder.png', '+50 item slots'],
        ].map(([name, price, image, note]) => <button key={name} type="button" className="rounded-[22px] bg-white/88 p-3 text-left shadow-sm ring-1 ring-white active:scale-[.98]"><div className="flex h-24 items-center justify-center rounded-2xl bg-[#edf6f1]"><img src={`https://cdn.jsdelivr.net/gh/PokeAPI/sprites@master/sprites/items/${image}`} alt="" className="h-16 w-16 object-contain [image-rendering:auto]" /></div><p className="mt-3 text-sm font-black leading-tight text-[#315f62]">{name}</p><p className="mt-1 text-[10px] font-bold text-[#819792]">{note}</p><div className="mt-3 flex items-center gap-1 text-xs font-black text-[#80691c]"><span className="flex h-4 w-4 items-center justify-center rounded-full bg-[#f7ce47] text-[8px]">C</span>{price}</div></button>)}</div></SubmenuShell>}

        {view === 'camera' && <SubmenuShell title="Snapshot" eyebrow="Camera mode" onBack={() => setView('root')}><div className="rounded-[28px] bg-white/86 p-6 text-center ring-1 ring-white"><div className="mx-auto flex h-24 w-24 items-center justify-center rounded-full bg-gradient-to-br from-[#58c8b0] to-[#338da7] text-white shadow-lg"><Camera className="h-11 w-11" strokeWidth={1.7} /></div><h3 className="mt-5 text-xl font-black text-[#315f62]">Take a creature snapshot</h3><p className="mt-2 text-sm leading-6 text-[#78918e]">Select a caught creature, position it in the scene and save a local screenshot.</p><button type="button" className="mt-6 h-13 w-full rounded-full bg-gradient-to-r from-[#57c99e] to-[#2da6aa] py-3.5 text-sm font-black uppercase tracking-[0.16em] text-white shadow-lg">Choose Pokémon</button></div></SubmenuShell>}

        {view === 'news' && <SubmenuShell title="News" eyebrow="CaldasGO updates" onBack={() => setView('root')}><div className="space-y-3">{[['New map interface', 'The overworld HUD and navigation have been redesigned for clearer mobile play.'], ['Starter event active', 'Find the three classic starter creatures around your current location.'], ['Project notice', 'CaldasGO is an unofficial educational local game project.']].map(([title, body], index) => <article key={title} className="rounded-[22px] bg-white/86 p-4 ring-1 ring-white"><div className="flex items-start gap-3"><span className={`mt-1 h-3 w-3 shrink-0 rounded-full ${index === 0 ? 'bg-[#ef6072]' : 'bg-[#48b79c]'}`} /><div><p className="text-sm font-black text-[#315f62]">{title}</p><p className="mt-1 text-xs leading-5 text-[#78918e]">{body}</p><p className="mt-2 text-[9px] font-black uppercase tracking-[0.14em] text-[#9aadaa]">Today</p></div></div></article>)}</div></SubmenuShell>}
      </AnimatePresence>
    </motion.div>
  );
};

export default MainMenu;
