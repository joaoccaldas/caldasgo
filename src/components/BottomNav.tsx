import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import PokemonSprite from './PokemonSprite';
import { COLORS } from '../theme';

interface BottomNavProps {
  onOpenPokedex: () => void;
  onOpenInventory: () => void;
  onOpenStorage: () => void;
}

/** Filled Poké Ball glyph for the central main button. */
const PokeBallIcon = () => (
  <svg viewBox="0 0 48 48" className="w-12 h-12" aria-hidden="true">
    <circle cx="24" cy="24" r="22" fill="#fff" stroke="#1f2937" strokeWidth="2" />
    <path d="M2 24a22 22 0 0 1 44 0z" fill="#ff5b6e" />
    <path d="M2 24h44" stroke="#1f2937" strokeWidth="2.5" />
    <circle cx="24" cy="24" r="7" fill="#fff" stroke="#1f2937" strokeWidth="2.5" />
    <circle cx="24" cy="24" r="2.6" fill="#1f2937" />
  </svg>
);

/** Filled red Pokédex device glyph. */
const PokedexFillIcon = () => (
  <img src="https://archives.bulbagarden.net/media/upload/b/b2/GO_Pok%C3%A9dex_icon.png" alt="Pokédex" className="w-[42px] h-[42px] object-contain drop-shadow-md" onError={(e) => { e.currentTarget.src = 'https://cdn.jsdelivr.net/gh/PokeAPI/sprites@master/sprites/items/pokedex.png'; }} />
);

/** Filled backpack / item bag glyph. */
const BagFillIcon = () => (
  <img src="https://archives.bulbagarden.net/media/upload/d/d4/GO_Items_icon.png" alt="Items" className="w-[42px] h-[42px] object-contain drop-shadow-md" onError={(e) => { e.currentTarget.src = 'https://cdn.jsdelivr.net/gh/PokeAPI/sprites@master/sprites/items/potion.png'; }} />
);

/** Filled shopping bag glyph for the Shop shortcut. */
const ShopFillIcon = () => (
  <img src="https://archives.bulbagarden.net/media/upload/2/22/GO_Shop_icon.png" alt="Shop" className="w-[42px] h-[42px] object-contain drop-shadow-md" />
);

/** Filled shield-and-star glyph for the Battle League shortcut. */
const BattleFillIcon = () => (
  <img src="https://archives.bulbagarden.net/media/upload/9/91/GO_Battle_icon.png" alt="Battle" className="w-[42px] h-[42px] object-contain drop-shadow-md" />
);

interface FanButton {
  key: 'pokedex' | 'items' | 'storage' | 'shop' | 'battle';
  label: string;
  icon: React.ReactNode;
  notify?: boolean;
  x: number;
  y: number;
}

// Arc above the central button, 150° spread / 108px radius.
const FAN_BUTTONS: FanButton[] = [
  { key: 'pokedex', label: 'POKÉDEX', icon: <PokedexFillIcon />, x: -104, y: 28 },
  { key: 'items', label: 'ITEMS', icon: <BagFillIcon />, x: -65, y: 86 },
  { key: 'storage', label: 'POKÉMON', icon: <PokeBallIcon />, x: 0, y: 108 },
  { key: 'shop', label: 'SHOP', icon: <ShopFillIcon />, x: 65, y: 86 },
  { key: 'battle', label: 'BATTLE', icon: <BattleFillIcon />, x: 104, y: 28, notify: true },
];

const FanItem: React.FC<{ btn: FanButton; delay: number; onClick?: () => void }> = ({ btn, delay, onClick }) => (
  <motion.div
    initial={{ scale: 0, opacity: 0 }}
    animate={{ scale: 1, opacity: 1 }}
    exit={{ scale: 0, opacity: 0 }}
    transition={{ delay, type: 'spring', damping: 14, stiffness: 240 }}
    className="absolute flex flex-col items-center gap-1.5"
    style={{ left: `calc(50% + ${btn.x}px)`, bottom: `${btn.y}px`, transform: 'translateX(-50%)' }}
  >
    <button
      onClick={onClick}
      className="relative w-16 h-16 rounded-full bg-pogo-glass backdrop-blur flex items-center justify-center shadow-pogo-mid active:scale-95 transition-transform border border-pogo-glass-border"
    >
      {btn.icon}
      {btn.notify && <span className="absolute -top-0.5 -right-0.5 w-3.5 h-3.5 rounded-full bg-pogo-red border-2 border-white" />}
    </button>
    <span className="text-white font-black text-[10px] tracking-wide drop-shadow-[0_1px_3px_rgba(0,0,0,0.6)]">{btn.label}</span>
  </motion.div>
);

/**
 * Persistent GO-style bottom navigation: a glass bar with quick-glance Nearby
 * (left) and Buddy (right) chips flanking a large central Poké Ball button.
 * Tapping the ball fans out Pokédex / Items / Pokémon / Shop / Battle above it.
 */
const BottomNav: React.FC<BottomNavProps> = ({ onOpenPokedex, onOpenInventory, onOpenStorage }) => {
  const [fanOpen, setFanOpen] = useState(false);

  const handlers: Record<FanButton['key'], (() => void) | undefined> = {
    pokedex: onOpenPokedex,
    storage: onOpenStorage,
    items: onOpenInventory,
    shop: undefined,
    battle: undefined,
  };

  return (
    <>
      {/* Backdrop + fan, shown only while the main button is expanded */}
      <AnimatePresence>
        {fanOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="absolute inset-0 z-[550] bg-black/40"
            onClick={() => setFanOpen(false)}
          >
            <div className="absolute left-1/2 bottom-[104px] -translate-x-1/2 w-0 h-0">
              {FAN_BUTTONS.map((btn, i) => (
                <FanItem
                  key={btn.key}
                  btn={btn}
                  delay={0.03 * i}
                  onClick={
                    handlers[btn.key]
                      ? () => {
                          setFanOpen(false);
                          handlers[btn.key]?.();
                        }
                      : undefined
                  }
                />
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Persistent bottom bar */}
      <div className="absolute bottom-0 left-0 w-full z-[560] pb-[max(env(safe-area-inset-bottom),0px)] pointer-events-none">
        <div
          className="relative h-[72px] bg-pogo-glass backdrop-blur-md rounded-t-pogo-xl shadow-pogo-high border-t border-pogo-glass-border flex items-center justify-between px-8 pointer-events-auto"
        >
          {/* Nearby radar chip */}
          <div className="w-12 h-12 rounded-full bg-white shadow-pogo-low border border-slate-100 flex items-center justify-center gap-0.5 overflow-hidden relative px-1">
            <div className="w-5 h-5 opacity-90"><PokemonSprite id={1} name="nearby" className="w-full h-full object-contain" /></div>
            <div className="w-5 h-5 opacity-70"><PokemonSprite id={4} name="nearby" className="w-full h-full object-contain" /></div>
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-pogo-cyan/25 to-transparent w-[200%] animate-[slide_3s_infinite]" />
          </div>

          {/* Buddy chip */}
          <div className="relative w-12 h-12 rounded-full border-2 border-white shadow-pogo-low bg-[#a3e635] flex items-center justify-center overflow-hidden">
            <PokemonSprite id={1} name="Buddy" className="w-[110%] h-[110%] object-contain" />
            <div className="absolute -top-1 -right-1 w-5 h-5 bg-white rounded-full flex items-center justify-center shadow border border-slate-200">
              <svg viewBox="0 0 24 24" width="12" height="12" fill={COLORS.red} aria-hidden="true"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" /></svg>
            </div>
          </div>
        </div>

        {/* Central main button, raised above the bar */}
        <motion.button
          onClick={() => setFanOpen((v) => !v)}
          whileTap={{ rotate: [0, -12, 10, -6, 0], scale: 0.94 }}
          transition={{ duration: 0.45 }}
          className="absolute left-1/2 -translate-x-1/2 -top-7 w-[84px] h-[84px] rounded-full bg-white shadow-pogo-high border-4 border-white flex items-center justify-center pointer-events-auto"
          style={{ boxShadow: '0 6px 18px rgba(11,42,58,0.4)' }}
          aria-label="Open menu"
        >
          <motion.div animate={{ rotate: fanOpen ? 45 : 0 }} transition={{ type: 'spring', damping: 14, stiffness: 220 }}>
            <PokeBallIcon />
          </motion.div>
        </motion.button>
      </div>
    </>
  );
};

export default BottomNav;
