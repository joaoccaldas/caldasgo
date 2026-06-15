import type { ButtonHTMLAttributes, ReactNode } from 'react';
import { motion } from 'framer-motion';

interface CircleActionProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  icon: ReactNode;
  label?: string;
  badge?: boolean;
  size?: 'sm' | 'md' | 'lg';
  tone?: 'light' | 'teal' | 'gold';
}

const sizeClass = {
  sm: 'h-11 w-11',
  md: 'h-14 w-14',
  lg: 'h-[72px] w-[72px]',
};

const toneClass = {
  light: 'border-white/90 bg-white/92 text-[#2e7373] ring-[#cfe4dc]',
  teal: 'border-white/85 bg-gradient-to-br from-[#5bc9b4] to-[#2e99aa] text-white ring-[#4ab5ab]/35',
  gold: 'border-white/90 bg-gradient-to-br from-[#f4d157] to-[#e6a934] text-[#73591b] ring-[#f9e7a3]',
};

export const CircleAction = ({ icon, label, badge, size = 'md', tone = 'light', className = '', ...props }: CircleActionProps) => (
  <div className="flex flex-col items-center gap-1.5">
    <motion.button
      type="button"
      whileTap={{ scale: 0.92 }}
      className={`relative flex items-center justify-center rounded-full border-2 shadow-[var(--pogo-shadow-sm)] ring-1 ${sizeClass[size]} ${toneClass[tone]} ${className}`}
      {...props}
    >
      {icon}
      {badge && <span className="absolute right-0 top-0 h-3.5 w-3.5 rounded-full border-[3px] border-white bg-[#ef6070]" />}
    </motion.button>
    {label && <span className="text-[10px] font-black uppercase tracking-[0.1em] text-[#2f6f6d] [text-shadow:0_1px_0_rgba(255,255,255,.75)]">{label}</span>}
  </div>
);

export const BottomCloseButton = ({ onClick, label = 'Close' }: { onClick: () => void; label?: string }) => (
  <motion.button
    type="button"
    whileTap={{ scale: 0.9 }}
    onClick={onClick}
    aria-label={label}
    className="flex h-16 w-16 items-center justify-center rounded-full border-2 border-white bg-white/94 text-[#347170] shadow-[var(--pogo-shadow-md)] ring-1 ring-[#c9dfd8]"
  >
    <svg viewBox="0 0 24 24" className="h-8 w-8" fill="none" stroke="currentColor" strokeWidth="2.25" strokeLinecap="round">
      <path d="M18 6 6 18M6 6l12 12" />
    </svg>
  </motion.button>
);

export const BackCircle = ({ onClick, label = 'Back' }: { onClick: () => void; label?: string }) => (
  <motion.button
    type="button"
    whileTap={{ scale: 0.92 }}
    onClick={onClick}
    aria-label={label}
    className="flex h-11 w-11 items-center justify-center rounded-full border border-white/85 bg-white/88 text-[#397473] shadow-[var(--pogo-shadow-sm)] backdrop-blur"
  >
    <svg viewBox="0 0 24 24" className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth="2.35" strokeLinecap="round" strokeLinejoin="round">
      <path d="m15 18-6-6 6-6" />
    </svg>
  </motion.button>
);

export const NativePanel = ({ children, className = '' }: { children: ReactNode; className?: string }) => (
  <section className={`rounded-[var(--pogo-radius-card)] border border-white/85 bg-white/88 shadow-[var(--pogo-shadow-md)] ${className}`}>
    {children}
  </section>
);

export const NativePill = ({ children, active = false, onClick }: { children: ReactNode; active?: boolean; onClick?: () => void }) => {
  const className = `rounded-full px-4 py-2 text-[10px] font-black uppercase tracking-[0.11em] transition-colors ${active ? 'bg-[#2f9d9f] text-white shadow-sm' : 'bg-white/72 text-[#648783] ring-1 ring-white/85'}`;
  return onClick ? <button type="button" onClick={onClick} className={className}>{children}</button> : <span className={className}>{children}</span>;
};
