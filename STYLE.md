# CaldasGO Visual Style Guide

This document tracks the design tokens and asset sources used to make
CaldasGO match modern Pokémon GO (2026) as closely as possible. It is
updated as each phase of the visual overhaul lands.

## Design tokens

Tokens live in two places that stay in sync:

- **`src/index.css`** (`@theme` block) — CSS custom properties that
  generate Tailwind utilities (`bg-pogo-*`, `rounded-pogo-*`,
  `shadow-pogo-*`, `font-display`, etc.)
- **`src/theme.ts`** — the same values as JS constants for inline
  styles, gradients and per-type SVG fills (`COLORS`, `RADIUS`,
  `SHADOW`, `FONTS`, `TYPE_COLORS`, `typeBackdrop()`).

### Palette

| Token | Value | Use |
|---|---|---|
| `pogo-navy` | `#0b2a3a` | Headers, dark text on light surfaces |
| `pogo-teal` / `pogo-teal-dark` | `#1b6e7e` / `#12515e` | Screen header gradients |
| `pogo-cyan` | `#2dd4bf` | Stardust currency, XP accents |
| `pogo-gold` | `#f6c243` | XP ring, Power Up button |
| `pogo-blue` | `#3b82f6` | Level badge, interactive POIs |
| `pogo-purple` | `#8b5cf6` | Shop / secondary interactive accents |
| `pogo-red` | `#ff5b6e` | Notification dots, Pokédex accent |
| `pogo-glass` / `pogo-glass-border` | `rgba(255,255,255,.92)` / `.6` | White glassmorphism cards, HUD chips, nav bar |
| `pogo-map-start` → `pogo-map-end` | `#bdf0e6` → `#7fd0e8` | Teal-to-blue overworld gradient |

`TYPE_COLORS` (in `src/data/pokemonDatabase.ts`, re-exported from
`theme.ts`) holds the official GO color for all 18 Pokémon types, used
for every type badge, move icon and detail-sheet backdrop.

### Shape & elevation

- Radius scale: `radius-pogo-sm` (0.75rem) → `radius-pogo-xl` (2.5rem),
  plus `radius-pogo-pill` for fully-rounded chips/buttons — GO's big
  pill/rounded-rect language.
- Shadow scale: `shadow-pogo-low/mid/high` — soft, navy-tinted shadows
  instead of flat borders, used for elevation on cards, chips and the
  bottom nav.

### Typography

- **Nunito** (400–900) — default `font-sans`. Rounded, chunky,
  friendly — replaces Lato everywhere via the `--font-sans` variable,
  so every existing `font-sans`/`font-black` usage re-themes for free.
- **Baloo 2** (700–800) — `font-display`. Reserved for big numerals:
  trainer level badge, Stardust counter, CP banners (rolling out across
  detail/encounter screens in later phases).
- **Inter** (400–700) — `font-condensed`. Available for dense body
  copy / move lists where Nunito reads too round.

Fonts are loaded via Google Fonts in `index.html`.

### Motion

- `prefers-reduced-motion: reduce` is honored globally (animations and
  transitions collapse to ~0ms) — see `src/index.css`.
- Spring-based fan/arc reveals (`type: 'spring', damping, stiffness`)
  for menus, matching GO's bouncy "ball burst" feel.
- Ball "wobble" (`whileTap={{ rotate: [...] }}`) on the main nav button.

## Components

### `BottomNav` (`src/components/BottomNav.tsx`)

Persistent GO-style bottom navigation, replacing the old full-screen
radial menu:

- Glass bar pinned to the bottom (`rounded-pogo-xl`, `shadow-pogo-high`)
  with a Nearby radar chip (left) and Buddy chip (right) always visible.
- Large central Poké Ball button overflows above the bar; tapping it
  fans out **Pokédex / Items / Pokémon / Shop / Battle** in a 150° arc
  with filled, full-color icons in white glass circles, plus the red
  notification dot on Battle.
- Custom filled SVG icon set (`PokeBallIcon`, `PokedexFillIcon`,
  `BagFillIcon`, `ShopFillIcon`, `BattleFillIcon`) — original artwork,
  no external icon library needed.

### `HUD` (`src/components/HUD.tsx`)

Top bar only: avatar + circular XP ring + level pill (top-left), and a
Stardust currency pill + weather badge (top-right). The bottom row
(Buddy/Poké Ball/Radar) moved into `BottomNav`.

## Asset sources

- Pokémon sprites/artwork: PokeAPI (`cdn.jsdelivr.net/gh/PokeAPI/sprites`)
  and PokeMiners GO asset dumps (`cdn.jsdelivr.net/gh/PokeMiners/pogo_assets`).
- Map tiles: CARTO Voyager (no labels), CSS-filtered toward GO's
  teal/green palette.
- Icons: original SVGs authored for this project (no Niantic/Pokémon GO
  trademarked logo assets are embedded).

## Roadmap (remaining phases)

1. ~~Design tokens, typography, iconography, bottom navigation~~ ✅
2. Map world: vector-style teal-blue terrain, styled PokéStop/Gym
   markers, weather/day-night overlay.
3. Animated, depth-shaded Pokémon sprites with idle bob + contact shadows.
4. Catch encounter screen: GO-fidelity rings, ball carousel, AR/camera controls.
5. Pokédex card restyle: white cards, type accents, registered glow.
6. Pokémon detail sheet: IV appraisal bars, high-contrast Power Up bar, move/buddy rows.
7. Motion polish pass across all screens + reduced-motion audit.
