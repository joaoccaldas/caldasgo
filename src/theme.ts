/**
 * Centralized visual design tokens for CaldasGO's Pokémon GO–inspired UI.
 *
 * Tokens that map to Tailwind utilities (colors, radii, shadows, fonts) are
 * declared as CSS custom properties in `src/index.css` under `@theme` —
 * those produce classes like `bg-pogo-blue`, `rounded-pogo-lg`,
 * `shadow-pogo-mid`, `font-display`. This file holds the same values for
 * places that need raw strings (inline `style=`, gradients, SVG fills,
 * dynamic per-type colors) so every screen stays in sync with one source.
 */
import { TYPE_COLORS } from './data/pokemonDatabase';

/** Per-Pokémon-type badge/accent colors (GO's official type palette). */
export { TYPE_COLORS };

/** Core brand palette — shared across map, HUD, sheets and cards. */
export const COLORS = {
  navy: '#0b2a3a',
  teal: '#1b6e7e',
  tealDark: '#12515e',
  cyan: '#2dd4bf',
  gold: '#f6c243',
  mapGradient: 'linear-gradient(180deg, #bdf0e6 0%, #7fd0e8 100%)',
  blue: '#3b82f6',
  purple: '#8b5cf6',
  red: '#ff5b6e',
  glass: 'rgba(255, 255, 255, 0.92)',
  glassBorder: 'rgba(255, 255, 255, 0.6)',
} as const;

/** Corner-radius scale — GO favors big pill / rounded-rect shapes. */
export const RADIUS = {
  sm: '0.75rem',
  md: '1.25rem',
  lg: '1.75rem',
  xl: '2.5rem',
  pill: '999px',
} as const;

/** Soft, saturated elevation shadows used in place of flat borders. */
export const SHADOW = {
  low: '0 2px 8px rgba(11, 42, 58, 0.18)',
  mid: '0 4px 14px rgba(11, 42, 58, 0.28)',
  high: '0 8px 24px rgba(11, 42, 58, 0.35)',
  glow: (color: string) => `0 0 14px ${color}`,
} as const;

/** Fonts — Nunito for the friendly chunky default, Baloo 2 for huge numerals. */
export const FONTS = {
  sans: "'Nunito', sans-serif",
  display: "'Baloo 2', 'Nunito', sans-serif",
  condensed: "'Inter', sans-serif",
} as const;

/** Builds a radial backdrop tinted with a Pokémon's primary type color. */
export const typeBackdrop = (type: keyof typeof TYPE_COLORS) =>
  `radial-gradient(circle at 50% 35%, ${TYPE_COLORS[type]}55 0%, ${TYPE_COLORS[type]}1a 55%, transparent 80%)`;
