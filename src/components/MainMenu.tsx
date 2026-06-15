import { useState, type ReactNode } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Backpack, Camera, HelpCircle, Megaphone, Settings, ShoppingBag, Ticket } from 'lucide-react';
import { BackCircle, BottomCloseButton, CircleAction, NativePanel } from './ui/PogoPrimitives';

interface MainMenuProps {
  onClose: () => void;
  onOpenPokedex: () => void;
  onOpenInventory: () => void;
  onOpenStorage: () => void;
}

type MenuView = 'root' | 'settings' | 'events' | 'battle' | 'shop' | 'camera' | 'news' | 'tips';

const DexIcon = () => <svg viewBox="0 0 32 32" className="h-9 w-9" fill="none" stroke="currentColor" strokeWidth="2"><rect x="7" y="4" width="18" height="24" rx="3" /><circle cx="12" cy="11" r="3" /><path d="M17 9h5M17 13h5M11 19h11M11 23h8" /></svg>;
const BattleIcon = () => <svg viewBox="0 0 32 32" className="h-9 w-9" fill="none" stroke="currentColor" strokeWidth="2"><path d="M5 8h22L16 28 5 8Z" /><path d="m12 13 4 4 4-4" /><circle cx="16" cy="21" r="2" fill="currentColor" stroke="none" /></svg>;
const PokemonIcon = () => <svg viewBox="0 0 32 32" className="h-9 w-9" fill="none" stroke="currentColor" strokeWidth="2"><path d="m9 4 4 8M23 4l-4 8" /><path d="M8 19c0-6 3-10 8-10s8 4 8 10c0 5-4 9-8 9s-8-4-8-9Z" /><circle cx="13" cy="19" r="1.4" fill="currentColor" stroke="none" /><circle cx="19" cy="19" r="1.4" fill="currentColor" stroke="none" /></svg>;

const MenuOrb = ({ label, icon, onClick, accent = false, delay = 0 }: { label: string; icon: ReactNode; onClick: () => void; accent?: boolean; delay?: number }) => (
  <motion.button
    type="button"
    initial={{ opacity: 0, scale: 0.7 }}
    animate={{ opacity: 1, scale: 1 }}
    transition={{ delay, type: 'spring', stiffness: 230, damping: 19 }}
    whileTap={{ scale: 0.92 }}
    onClick={onClick}
    className="flex w-[94px] flex-col items-center gap-2"
  >
    <span className={`flex h-[74px] w-[74px] items-center justify-center rounded-full border-2 border-white/95 shadow-[var(--pogo-shadow-sm)] ring-1 ${accent ? 'bg-gradient-to-br from-[#55cbb1] to-[#2d96a8] text-white ring-[#53b8aa]/35' : 'bg-white/92 text-[#2e7773] ring-[#cde4d9]'}`}>{icon}</span>
    <span className="text-[11px] font-black uppercase tracking-[0.1em] text-[#246864] [text-shadow:0_1px_0_rgba(255,255,255,.85)]">{label}</span>
  </motion.button>
);

const Subscreen = ({ title, subtitle, onBack, children }: { title: string; subtitle: string; onBack: () => void; children: ReactNode }) => (
  <motion.div initial={{ x: '100%' }} animate={{ x: 0 }} exit={{ x: '100%' }} transition={{ type: 'tween', duration: 0.22 }} className="absolute inset-0 z-20 flex flex-col bg-[linear-gradient(180deg,#edf8ed_0%,#d8efd4_54%,#b6df9d_100%)] text-[#315f61]">
    <div className="pogo-soft-noise absolute inset-0 opacity-55" />
    <header className="relative flex items-center gap-3 px-4 pb-4 pt-[max(18px,env(safe-area-inset-top))]">
      <BackCircle onClick={onBack} />
      <div><p className="text-[9px] font-black uppercase tracking-[0.18em] text-[#78a28f]">{subtitle}</p><h2 className="text-2xl font-black tracking-[-0.035em]">{title}</h2></div>
    </header>
    <div className="relative min-h-0 flex-1 overflow-y-auto px-4 pb-[max(28px,env(safe-area-inset-bottom))]">{children}</div>
  </motion.div>
);

const ToggleRow = ({ label, description, enabled, onClick }: { label: string; description: string; enabled: boolean; onClick: () => void }) => (
  <button type="button" onClick={onClick} className="flex w-full items-center justify-between gap-4 border-b border-[#deebe3] px-4 py-4 text-left last:border-0">
    <div><p className="text-sm font-black">{label}</p><p className="mt-0.5 text-xs leading-5 text-[#77918e]">{description}</p></div>
    <span className={`relative h-7 w-12 shrink-0 rounded-full p-1 ${enabled ? 'bg-[#42b9a2]' : 'bg-[#c9d8d3]'}`}><span className={`block h-5 w-5 rounded-full bg-white shadow-sm transition-transform ${enabled ? 'translate-x-5' : ''}`} /></span>
  </button>
);

const MainMenu: React.FC<MainMenuProps> = ({ onClose, onOpenPokedex, onOpenInventory, onOpenStorage }) => {
  const [view, setView] = useState<MenuView>('root');
  const [sound, setSound] = useState(true);
  const [vibration, setVibration] = useState(true);
  const [batterySaver, setBatterySaver] = useState(false);

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="absolute inset-0 z-[600] overflow-hidden bg-[linear-gradient(160deg,rgba(239,249,231,.98),rgba(211,239,200,.97)_47%,rgba(151,216,128,.98))]">
      <div className="pogo-soft-noise pointer-events-none absolute inset-0 opacity-60" />
      <div className="pointer-events-none absolute -left-32 top-10 h-80 w-80 rounded-full border border-white/40" />
      <div className="pointer-events-none absolute -right-28 bottom-10 h-72 w-72 rounded-full border border-white/44" />
      <svg viewBox="0 0 390 350" preserveAspectRatio="none" className="pointer-events-none absolute inset-x-0 bottom-0 h-[46%] w-full opacity-32" aria-hidden="true"><path d="M0 260c75-74 132-20 193-92 64-76 129-22 197-95v277H0Z" fill="#fff" /><path d="M0 293c77-62 136-13 201-80 66-68 126-19 189-77" fill="none" stroke="#fff" strokeWidth="3" /></svg>

      <AnimatePresence mode="wait">
        {view === 'root' && (
          <motion.div key="root" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="relative flex h-full flex-col px-4 pb-[max(18px,env(safe-area-inset-bottom))] pt-[max(16px,env(safe-area-inset-top))]">
            <div className="flex justify-between">
              <div className="flex gap-2">
                <CircleAction size="sm" icon={<Settings className="h-5 w-5" strokeWidth={1.9} />} onClick={() => setView('settings')} />
                <CircleAction size="sm" icon={<HelpCircle className="h-5 w-5" strokeWidth={1.9} />} onClick={() => setView('tips')} />
              </div>
              <CircleAction size="sm" badge icon={<Ticket className="h-5 w-5" strokeWidth={1.9} />} onClick={() => setView('events')} />
            </div>

            <div className="flex flex-1 items-center justify-center pb-4 pt-2">
              <div className="grid w-full max-w-[350px] grid-cols-3 place-items-center gap-x-4 gap-y-6">
                <MenuOrb label="Pokédex" icon={<DexIcon />} onClick={onOpenPokedex} delay={0.03} />
                <span />
                <MenuOrb label="Battle" icon={<BattleIcon />} onClick={() => setView('battle')} delay={0.07} />
                <span />
                <MenuOrb label="Shop" icon={<ShoppingBag className="h-9 w-9" strokeWidth={1.8} />} onClick={() => setView('shop')} accent delay={0.11} />
                <span />
                <MenuOrb label="Pokémon" icon={<PokemonIcon />} onClick={onOpenStorage} delay={0.15} />
                <span />
                <MenuOrb label="Items" icon={<Backpack className="h-9 w-9" strokeWidth={1.8} />} onClick={onOpenInventory} delay={0.19} />
              </div>
            </div>

            <div className="mx-auto grid w-full max-w-[286px] grid-cols-3 items-end justify-items-center">
              <CircleAction size="sm" badge icon={<Camera className="h-5 w-5" strokeWidth={1.9} />} onClick={() => setView('camera')} />
              <BottomCloseButton onClick={onClose} label="Close menu" />
              <CircleAction size="sm" badge icon={<Megaphone className="h-5 w-5" strokeWidth={1.9} />} onClick={() => setView('news')} />
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {view === 'settings' && <Subscreen title="Settings" subtitle="Game preferences" onBack={() => setView('root')}><NativePanel className="overflow-hidden"><ToggleRow label="Music and sound" description="Play map, encounter and menu audio." enabled={sound} onClick={() => setSound(!sound)} /><ToggleRow label="Vibration" description="Use haptic feedback for catches and rewards." enabled={vibration} onClick={() => setVibration(!vibration)} /><ToggleRow label="Battery saver" description="Reduce motion and dim the display." enabled={batterySaver} onClick={() => setBatterySaver(!batterySaver)} /></NativePanel><NativePanel className="mt-4 p-4"><p className="text-[9px] font-black uppercase tracking-[0.16em] text-[#7a9b92]">About</p><p className="mt-1 text-sm font-black">CaldasGO v1.0</p><p className="mt-1 text-xs leading-5 text-[#77918e]">Unofficial educational location-game project.</p></NativePanel></Subscreen>}

        {view === 'tips' && <Subscreen title="Tips" subtitle="Trainer guide" onBack={() => setView('root')}><div className="space-y-3">{[['Explore safely', 'Stay aware of traffic, private property and your surroundings.'], ['Catch creatures', 'Tap a creature on the map, use a berry and throw a ball.'], ['Visit landmarks', 'Open nearby PokéStops and spin their Photo Discs for supplies.']].map(([title, body], index) => <NativePanel key={title} className="flex gap-4 p-4"><span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#e7f5ec] text-sm font-black text-[#2d8d7d]">{index + 1}</span><div><p className="text-sm font-black">{title}</p><p className="mt-1 text-xs leading-5 text-[#77918e]">{body}</p></div></NativePanel>)}</div></Subscreen>}

        {view === 'events' && <Subscreen title="Events" subtitle="Happening now" onBack={() => setView('root')}><NativePanel className="overflow-hidden bg-gradient-to-br from-[#318495] to-[#4dc69d] p-5 text-white"><span className="rounded-full bg-white/18 px-3 py-1 text-[9px] font-black uppercase tracking-[0.14em]">Live now</span><h3 className="mt-4 text-2xl font-black">Starter discovery hour</h3><p className="mt-2 text-sm leading-6 text-white/84">Classic starter Pokémon are appearing more often nearby.</p><div className="mt-4 h-2 overflow-hidden rounded-full bg-white/20"><div className="h-full w-2/3 rounded-full bg-[#ffe28a]" /></div></NativePanel></Subscreen>}

        {view === 'battle' && <Subscreen title="Battle" subtitle="GO Battle League" onBack={() => setView('root')}><NativePanel className="bg-gradient-to-br from-[#324770] to-[#78569d] p-5 text-white"><p className="text-[9px] font-black uppercase tracking-[0.16em] text-white/65">Season 1</p><h3 className="mt-1 text-3xl font-black">Caldas League</h3><p className="mt-2 text-sm leading-6 text-white/78">Choose a league and build a team of three.</p></NativePanel><div className="mt-4 space-y-3">{[['Great League', 'CP 1,500 max'], ['Ultra League', 'CP 2,500 max'], ['Master League', 'No CP limit']].map(([name, rule]) => <NativePanel key={name} className="flex items-center justify-between p-4"><div><p className="font-black">{name}</p><p className="text-xs font-bold text-[#7d9692]">{rule}</p></div><BattleIcon /></NativePanel>)}</div></Subscreen>}

        {view === 'shop' && <Subscreen title="Shop" subtitle="Items and upgrades" onBack={() => setView('root')}><NativePanel className="mb-4 flex items-center justify-between p-4"><div><p className="text-[9px] font-black uppercase tracking-[0.14em] text-[#7b9d94]">PokéCoins</p><p className="text-2xl font-black">1,250</p></div><span className="flex h-12 w-12 items-center justify-center rounded-full bg-[#f8cf4b] font-black text-[#785f13] ring-4 ring-[#fff3bd]">C</span></NativePanel><div className="grid grid-cols-2 gap-3">{[['Adventure Box', '480', 'great-ball.png'], ['Poké Balls ×20', '100', 'poke-ball.png'], ['Lucky Egg', '80', 'lucky-egg.png'], ['Incense', '80', 'incense.png']].map(([name, price, image]) => <NativePanel key={name} className="p-3"><div className="flex h-24 items-center justify-center rounded-2xl bg-[#edf6f1]"><img src={`https://cdn.jsdelivr.net/gh/PokeAPI/sprites@master/sprites/items/${image}`} alt="" className="h-16 w-16 object-contain" /></div><p className="mt-3 text-sm font-black">{name}</p><p className="mt-2 text-xs font-black text-[#80691c]">C {price}</p></NativePanel>)}</div></Subscreen>}

        {view === 'camera' && <Subscreen title="Snapshot" subtitle="Camera mode" onBack={() => setView('root')}><NativePanel className="p-6 text-center"><div className="mx-auto flex h-24 w-24 items-center justify-center rounded-full bg-gradient-to-br from-[#58c8b0] to-[#338da7] text-white shadow-lg"><Camera className="h-11 w-11" strokeWidth={1.7} /></div><h3 className="mt-5 text-xl font-black">Take a Pokémon snapshot</h3><p className="mt-2 text-sm leading-6 text-[#78918e]">Choose a caught Pokémon and position it in the scene.</p></NativePanel></Subscreen>}

        {view === 'news' && <Subscreen title="News" subtitle="Latest updates" onBack={() => setView('root')}><div className="space-y-3">{[['New overworld', 'The map, trainer and HUD have been rebuilt for mobile play.'], ['Starter event', 'Classic starter Pokémon are appearing nearby.'], ['Project notice', 'CaldasGO is an unofficial educational project.']].map(([title, body], index) => <NativePanel key={title} className="flex gap-3 p-4"><span className={`mt-1 h-3 w-3 shrink-0 rounded-full ${index === 0 ? 'bg-[#ef6072]' : 'bg-[#48b79c]'}`} /><div><p className="text-sm font-black">{title}</p><p className="mt-1 text-xs leading-5 text-[#78918e]">{body}</p></div></NativePanel>)}</div></Subscreen>}
      </AnimatePresence>
    </motion.div>
  );
};

export default MainMenu;
