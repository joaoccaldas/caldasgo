import React from 'react';
import { COLORS } from '../theme';

interface HUDProps {
  playerLevel: number;
  xpProgress: number; // 0-1 progress toward next level
  stardust: number;
}

/** Glowing four-point sparkle, GO's Stardust currency icon. */
const StardustIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg viewBox="0 0 24 24" className={className} aria-hidden="true">
    <path d="M12 1.5l2.6 7.9 7.9 2.6-7.9 2.6L12 22.5l-2.6-7.9-7.9-2.6 7.9-2.6z" fill={COLORS.cyan} stroke="#0ea5a0" strokeWidth="0.6" strokeLinejoin="round" />
  </svg>
);

const HUD: React.FC<HUDProps> = ({ playerLevel, xpProgress, stardust }) => {
  return (
    <>
      {/* Top Left: Avatar Profile with circular Level Ring (authentic PoGo) */}
      <div className="absolute top-12 left-4 z-[400] flex flex-col items-center pointer-events-auto">
        <div className="relative w-[72px] h-[72px]">
          {/* Circular XP progress ring */}
          <svg className="absolute inset-0 w-full h-full -rotate-90" viewBox="0 0 72 72">
            {/* Track */}
            <circle cx="36" cy="36" r="33" fill="none" stroke="rgba(15,23,42,0.55)" strokeWidth="5" />
            {/* Progress */}
            <circle
              cx="36"
              cy="36"
              r="33"
              fill="none"
              stroke="#fcd34d"
              strokeWidth="5"
              strokeLinecap="round"
              strokeDasharray={2 * Math.PI * 33}
              strokeDashoffset={2 * Math.PI * 33 * (1 - Math.min(1, Math.max(0, xpProgress)))}
              style={{ filter: 'drop-shadow(0 0 3px rgba(252,211,77,0.8))', transition: 'stroke-dashoffset 0.4s ease' }}
            />
          </svg>
          {/* Authentic Trainer Avatar Image */}
          <div className="absolute inset-[5px] rounded-full border-[3px] border-white shadow-[0_2px_10px_rgba(0,0,0,0.5)] overflow-hidden bg-sky-300">
            <img
              src="https://cdn.jsdelivr.net/gh/PokeMiners/pogo_assets@master/Images/Menu%20Icons/ic_defaultMaleAvatar.png"
              alt="Trainer Profile"
              className="w-14 h-14 rounded-full border-4 border-white shadow bg-white object-cover object-top p-1"
            />
          </div>
          {/* Level Badge */}
          <div className="absolute -bottom-1.5 left-1/2 -translate-x-1/2 bg-pogo-blue text-white text-xs font-display font-extrabold px-2.5 py-[1px] rounded-pogo-pill border border-white shadow-md z-10 whitespace-nowrap tracking-wide">
            {playerLevel}
          </div>
        </div>
      </div>

      {/* Top Right: Compass & Weather */}
      <div className="absolute top-12 right-4 z-[400] flex flex-col gap-3 pointer-events-auto items-end">
        {/* Compass */}
        <div className="w-12 h-12 bg-white/30 backdrop-blur rounded-full shadow-pogo-mid flex items-center justify-center border border-white/50 cursor-pointer hover:bg-white/40 transition-colors overflow-hidden">
          <img
            src="https://cdn.jsdelivr.net/gh/PokeMiners/pogo_assets@master/Images/Menu%20Icons/btn_compass_fixed.png"
            alt="Compass"
            className="w-[65%] h-[65%] object-contain opacity-90 drop-shadow-md"
          />
        </div>
        
        {/* Weather */}
        <div className="w-12 h-12 bg-white/30 backdrop-blur rounded-full shadow-pogo-mid flex items-center justify-center border border-white/50 cursor-pointer hover:bg-white/40 transition-colors overflow-hidden mt-1">
          <img
            src="https://cdn.jsdelivr.net/gh/PokeMiners/pogo_assets@master/Images/Weather/weatherIcon_large_clearDay.png"
            alt="Clear weather"
            className="w-[85%] h-[85%] object-contain"
          />
        </div>
      </div>

      {/* Bottom Right: Field Research (Binoculars) */}
      <div className="absolute bottom-[90px] right-4 z-[400] flex flex-col items-end pointer-events-auto">
        <div className="w-16 h-16 relative flex items-center justify-center cursor-pointer hover:scale-105 transition-transform">
           {/* Authentic orange gradient ring */}
           <div className="absolute inset-0 rounded-full border-[3px] border-orange-500 shadow-[0_0_8px_rgba(249,115,22,0.8)]" style={{ background: 'linear-gradient(135deg, rgba(255,255,255,0.9), rgba(255,255,255,0.7))' }}></div>
           <img
             src="https://cdn.jsdelivr.net/gh/PokeMiners/pogo_assets@master/Images/Menu%20Icons/btn_research.png"
             alt="Field Research"
             className="w-[60%] h-[60%] object-contain relative z-10 drop-shadow-sm"
           />
        </div>
      </div>

      {/* Top Center: Stardust currency pill (Moved here for better authenticity/balance) */}
      <div className="absolute top-12 left-1/2 -translate-x-1/2 z-[400] flex flex-col pointer-events-auto">
        <div className="bg-pogo-glass backdrop-blur-md rounded-pogo-pill shadow-[0_2px_8px_rgba(11,42,58,0.25)] border border-pogo-glass-border flex items-center gap-1 pl-1.5 pr-3 h-8">
          <StardustIcon className="w-[18px] h-[18px]" />
          <span className="font-display font-extrabold text-[13px] text-pogo-navy tracking-wide leading-none pt-[1px]">{stardust.toLocaleString()}</span>
        </div>
      </div>

    </>
  );
};

export default HUD;
