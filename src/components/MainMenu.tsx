import React from 'react';
import { motion } from 'framer-motion';
import { Settings, Ticket, ShoppingBag, Backpack, Camera, Megaphone, X } from 'lucide-react';

interface MainMenuProps {
  onClose: () => void;
  onOpenPokedex: () => void;
  onOpenInventory: () => void;
  onOpenStorage: () => void;
}

const TEAL = '#1f6f6b';

// Pokédex device outline (real menu uses the red Pokédex device icon).
const PokedexIcon = () => (
  <svg viewBox="0 0 24 24" className="w-8 h-8" fill="none" stroke={TEAL} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <rect x="5" y="3" width="14" height="18" rx="2" />
    <circle cx="9" cy="8" r="2.2" />
    <path d="M14 7h3M14 10h3M8 14h8M8 17h8" />
  </svg>
);

// GO Battle League triangle.
const BattleIcon = () => (
  <svg viewBox="0 0 24 24" className="w-8 h-8" fill="none" stroke={TEAL} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="M4 6h16l-8 13z" />
    <circle cx="12" cy="10.5" r="1.6" fill={TEAL} stroke="none" />
  </svg>
);

// Pikachu-head silhouette outline for the Pokémon button.
const PokemonIcon = () => (
  <svg viewBox="0 0 24 24" className="w-8 h-8" fill="none" stroke={TEAL} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="M7 3l3 6M17 3l-3 6" />
    <path d="M6 13a6 6 0 0 1 12 0c0 4-3 7-6 7s-6-3-6-7z" />
    <circle cx="9.5" cy="13.5" r="0.8" fill={TEAL} stroke="none" />
    <circle cx="14.5" cy="13.5" r="0.8" fill={TEAL} stroke="none" />
  </svg>
);

interface MenuButtonProps {
  label: string;
  icon: React.ReactNode;
  onClick?: () => void;
  notify?: boolean;
  delay: number;
}

const MenuButton: React.FC<MenuButtonProps> = ({ label, icon, onClick, notify, delay }) => (
  <motion.button
    initial={{ scale: 0 }}
    animate={{ scale: 1 }}
    transition={{ delay, type: 'spring', damping: 14 }}
    onClick={onClick}
    className="flex flex-col items-center gap-2"
  >
    <span className="text-[#1f6f6b] font-black text-sm tracking-wide">{label}</span>
    <div className="relative w-[72px] h-[72px] rounded-full bg-white flex items-center justify-center shadow-[0_4px_10px_rgba(0,0,0,0.12)] ring-2 ring-[#cdeccd]">
      {icon}
      {notify && <span className="absolute -top-0.5 -right-0.5 w-3.5 h-3.5 rounded-full bg-[#ff5b6e] border-2 border-white" />}
    </div>
  </motion.button>
);

const MainMenu: React.FC<MainMenuProps> = ({ onClose, onOpenPokedex, onOpenInventory, onOpenStorage }) => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.2 }}
      className="absolute inset-0 z-[600] flex flex-col"
      style={{ background: 'linear-gradient(135deg, #f2faea 0%, #d6f0bd 45%, #a9e08a 100%)' }}
    >
      {/* Top-right: Settings / Events */}
      <div className="absolute top-12 right-5 flex flex-col gap-4 items-end">
        <button className="flex items-center gap-2.5">
          <span className="text-[#1f6f6b] font-black text-sm tracking-wide">SETTINGS</span>
          <Settings className="w-7 h-7" stroke={TEAL} strokeWidth={1.8} />
        </button>
        <button className="flex items-center gap-2.5">
          <span className="text-[#1f6f6b] font-black text-sm tracking-wide">EVENTS</span>
          <Ticket className="w-7 h-7" stroke={TEAL} strokeWidth={1.8} />
        </button>
      </div>

      {/* Main 5-button cluster */}
      <div className="flex-1 flex flex-col justify-end pb-28">
        <div className="relative h-[300px]">
          {/* Top row */}
          <div className="absolute left-10 top-0">
            <MenuButton label="POKÉDEX" icon={<PokedexIcon />} onClick={onOpenPokedex} delay={0.1} />
          </div>
          <div className="absolute right-10 top-0">
            <MenuButton label="BATTLE" icon={<BattleIcon />} notify delay={0.15} />
          </div>
          {/* Center: Shop */}
          <div className="absolute left-1/2 -translate-x-1/2 top-[110px]">
            <MenuButton label="SHOP" icon={<ShoppingBag className="w-8 h-8" stroke={TEAL} strokeWidth={1.8} />} delay={0.2} />
          </div>
          {/* Bottom row */}
          <div className="absolute left-10 top-[215px]">
            <MenuButton label="POKÉMON" icon={<PokemonIcon />} onClick={onOpenStorage} delay={0.25} />
          </div>
          <div className="absolute right-10 top-[215px]">
            <MenuButton label="ITEMS" icon={<Backpack className="w-8 h-8" stroke={TEAL} strokeWidth={1.8} />} onClick={onOpenInventory} delay={0.3} />
          </div>
        </div>
      </div>

      {/* Bottom row: camera / close / megaphone */}
      <div className="absolute bottom-10 left-0 right-0 flex items-center justify-center gap-14">
        <button className="relative">
          <Camera className="w-8 h-8" stroke={TEAL} strokeWidth={1.8} />
          <span className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-[#ff5b6e]" />
        </button>
        <motion.button
          whileTap={{ scale: 0.9 }}
          onClick={onClose}
          className="w-14 h-14 rounded-full bg-white/70 ring-2 ring-[#bfe0bf] flex items-center justify-center shadow-md"
        >
          <X className="w-7 h-7" stroke={TEAL} strokeWidth={2.2} />
        </motion.button>
        <button className="relative">
          <Megaphone className="w-8 h-8" stroke={TEAL} strokeWidth={1.8} />
          <span className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-[#ff5b6e]" />
        </button>
      </div>
    </motion.div>
  );
};

export default MainMenu;
