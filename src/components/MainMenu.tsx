import React from 'react';
import { motion } from 'framer-motion';
import { Settings, Ticket, ShoppingBag, Backpack, X } from 'lucide-react';

interface MainMenuProps {
  onClose: () => void;
  onOpenPokedex: () => void;
  onOpenInventory: () => void;
  onOpenStorage: () => void;
}

const TEAL = '#1f6f6b';

// Pokédex device outline (real menu uses the red Pokédex device icon).
const PokedexIcon = () => (
  <svg viewBox="0 0 24 24" className="w-7 h-7" fill="none" stroke={TEAL} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <rect x="5" y="3" width="14" height="18" rx="2" />
    <circle cx="9" cy="8" r="2.2" />
    <path d="M14 7h3M14 10h3M8 14h8M8 17h8" />
  </svg>
);

// GO Battle League triangle.
const BattleIcon = () => (
  <svg viewBox="0 0 24 24" className="w-7 h-7" fill="none" stroke={TEAL} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="M4 6h16l-8 13z" />
    <circle cx="12" cy="10.5" r="1.6" fill={TEAL} stroke="none" />
  </svg>
);

// Pikachu-head silhouette outline for the Pokémon button.
const PokemonIcon = () => (
  <svg viewBox="0 0 24 24" className="w-7 h-7" fill="none" stroke={TEAL} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="M7 3l3 6M17 3l-3 6" />
    <path d="M6 13a6 6 0 0 1 12 0c0 4-3 7-6 7s-6-3-6-7z" />
    <circle cx="9.5" cy="13.5" r="0.8" fill={TEAL} stroke="none" />
    <circle cx="14.5" cy="13.5" r="0.8" fill={TEAL} stroke="none" />
  </svg>
);

// Positions of the radial buttons relative to the central close button,
// laid out along a 150° arc (radius 115px) matching Pokémon GO's "ball burst" menu.
const ARC_BUTTONS: { label: string; icon: React.ReactNode; key: 'pokedex' | 'pokemon' | 'shop' | 'items' | 'battle'; notify?: boolean; x: number; y: number }[] = [
  { label: 'POKÉDEX', icon: <PokedexIcon />, key: 'pokedex', x: -111, y: 29.8 },
  { label: 'POKÉMON', icon: <PokemonIcon />, key: 'pokemon', x: -70, y: 91.2 },
  { label: 'SHOP', icon: <ShoppingBag className="w-7 h-7" stroke={TEAL} strokeWidth={1.8} />, key: 'shop', x: 0, y: 115 },
  { label: 'ITEMS', icon: <Backpack className="w-7 h-7" stroke={TEAL} strokeWidth={1.8} />, key: 'items', x: 70, y: 91.2 },
  { label: 'BATTLE', icon: <BattleIcon />, key: 'battle', notify: true, x: 111, y: 29.8 },
];

interface ArcButtonProps {
  label: string;
  icon: React.ReactNode;
  onClick?: () => void;
  notify?: boolean;
  delay: number;
  x: number;
  y: number;
}

const ArcButton: React.FC<ArcButtonProps> = ({ label, icon, onClick, notify, delay, x, y }) => (
  <motion.div
    initial={{ scale: 0, opacity: 0 }}
    animate={{ scale: 1, opacity: 1 }}
    transition={{ delay, type: 'spring', damping: 13, stiffness: 220 }}
    className="absolute flex flex-col items-center gap-1.5"
    style={{ left: `calc(50% + ${x}px)`, bottom: `calc(66px + ${y}px)`, transform: 'translate(-50%, 50%)' }}
  >
    <button
      onClick={onClick}
      className="relative w-[68px] h-[68px] rounded-full bg-white flex items-center justify-center shadow-[0_4px_14px_rgba(0,0,0,0.35)] active:scale-95 transition-transform"
    >
      {icon}
      {notify && <span className="absolute -top-0.5 -right-0.5 w-3.5 h-3.5 rounded-full bg-[#ff5b6e] border-2 border-white" />}
    </button>
    <span className="text-white font-black text-[11px] tracking-wide drop-shadow-[0_1px_3px_rgba(0,0,0,0.6)]">{label}</span>
  </motion.div>
);

const MainMenu: React.FC<MainMenuProps> = ({ onClose, onOpenPokedex, onOpenInventory, onOpenStorage }) => {
  const handlers: Record<string, (() => void) | undefined> = {
    pokedex: onOpenPokedex,
    pokemon: onOpenStorage,
    items: onOpenInventory,
    shop: undefined,
    battle: undefined,
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.2 }}
      className="absolute inset-0 z-[600] bg-black/45"
      onClick={onClose}
    >
      {/* Top-right: Settings / Events */}
      <div className="absolute top-12 right-5 flex flex-col gap-4 items-center" onClick={(e) => e.stopPropagation()}>
        <button className="w-12 h-12 rounded-full bg-white shadow-md flex items-center justify-center active:scale-95 transition-transform">
          <Settings className="w-6 h-6" stroke={TEAL} strokeWidth={1.8} />
        </button>
        <button className="w-12 h-12 rounded-full bg-white shadow-md flex items-center justify-center active:scale-95 transition-transform">
          <Ticket className="w-6 h-6" stroke={TEAL} strokeWidth={1.8} />
        </button>
      </div>

      {/* Radial "ball burst" menu */}
      <div onClick={(e) => e.stopPropagation()}>
        {ARC_BUTTONS.map((btn, i) => (
          <ArcButton
            key={btn.key}
            label={btn.label}
            icon={btn.icon}
            notify={btn.notify}
            onClick={handlers[btn.key]}
            delay={0.04 * i}
            x={btn.x}
            y={btn.y}
          />
        ))}
      </div>

      {/* Center: Pokéball morphs into the close button, in the same spot as the HUD button */}
      <motion.button
        initial={{ scale: 0.6, rotate: -90 }}
        animate={{ scale: 1, rotate: 0 }}
        whileTap={{ scale: 0.92 }}
        onClick={onClose}
        className="absolute left-1/2 -translate-x-1/2 bottom-8 translate-y-2 w-[84px] h-[84px] rounded-full bg-white shadow-xl flex items-center justify-center"
      >
        <X className="w-9 h-9" stroke={TEAL} strokeWidth={2.5} />
      </motion.button>
    </motion.div>
  );
};

export default MainMenu;
