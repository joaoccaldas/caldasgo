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
  <svg viewBox="0 0 24 24" className="w-7 h-7" aria-hidden="true">
    <rect x="3" y="3" width="18" height="18" rx="5" fill="#ff5b6e" />
    <circle cx="9" cy="8.5" r="2.6" fill="#fff" />
    <circle cx="9" cy="8.5" r="1.2" fill="#3b82f6" />
    <rect x="13.5" y="6.5" width="6" height="2" rx="1" fill="#fff" />
    <rect x="6" y="13.5" width="12" height="2" rx="1" fill="#fff" />
    <rect x="6" y="17" width="12" height="2" rx="1" fill="#fff" />
  </svg>
);

/** Filled backpack / item bag glyph. */
const BagFillIcon = () => (
  <svg viewBox="0 0 24 24" className="w-7 h-7" aria-hidden="true">
    <rect x="4" y="8" width="16" height="13" rx="4" fill="#f59e0b" />
    <path d="M8 8V6a4 4 0 0 1 8 0v2" stroke="#f59e0b" strokeWidth="2.4" fill="none" strokeLinecap="round" />
    <rect x="9" y="11" width="6" height="3.5" rx="1.5" fill="#fff" />
  </svg>
);

/** Filled shopping bag glyph for the Shop shortcut. */
const ShopFillIcon = () => (
  <svg viewBox="0 0 24 24" className="w-7 h-7" aria-hidden="true">
    <path d="M5 8h14l-1.2 11.2a2 2 0 0 1-2 1.8H8.2a2 2 0 0 1-2-1.8z" fill="#8b5cf6" />
    <path d="M8.5 9V6.5a3.5 3.5 0 0 1 7 0V9" stroke="#8b5cf6" strokeWidth="2.2" fill="none" strokeLinecap="round" />
  </svg>
);

/** Filled shield-and-star glyph for the Battle League shortcut. */
const BattleFillIcon = () => (
  <svg viewBox="0 0 24 24" className="w-7 h-7" aria-hidden="true">
    <path d="M12 2l8 3v6c0 5-3.5 8.5-8 11-4.5-2.5-8-6-8-11V5z" fill="#3b82f6" />
    <path d="M12 7.5l1.8 3.6 4 .5-2.9 2.8.7 4-3.6-1.9-3.6 1.9.7-4-2.9-2.8 4-.5z" fill="#fcd34d" />
  </svg>
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
