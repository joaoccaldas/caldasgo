// Real Pokémon GO CP Multiplier and XP tables (levels 1-50), sourced from the live GAME_MASTER.
export const CP_MULTIPLIER: number[] = [0.094,0.16639787,0.21573247,0.25572005,0.29024988,0.3210876,0.34921268,0.3752356,0.39956728,0.4225,0.44310755,0.4627984,0.48168495,0.49985844,0.51739395,0.5343543,0.5507927,0.5667545,0.5822789,0.5974,0.6121573,0.6265671,0.64065295,0.65443563,0.667934,0.6811649,0.69414365,0.7068842,0.7193991,0.7317,0.7377695,0.74378943,0.74976104,0.7556855,0.76156384,0.76739717,0.7731865,0.77893275,0.784637,0.7903,0.7953,0.8003,0.8053,0.8103,0.8153,0.8203,0.8253,0.8303,0.8353,0.8403];

// Cumulative XP required to reach each trainer level (index 0 = level 1).
export const XP_FOR_LEVEL: number[] = [0,2500,5500,9000,13000,18000,24000,31000,39000,48000,58000,70000,84000,100000,118000,139000,163500,191500,223000,258000,300000,349000,405000,468000,538000,621000,717000,826000,948000,1083000,1241000,1422000,1626000,1853000,2103000,2393000,2723000,3093000,3503000,3953000,4473000,5063000,5723000,6453000,7253000,8153000,9153000,10253000,11453000,12753000];

export const MAX_LEVEL = CP_MULTIPLIER.length;

/** Returns the trainer level (1-50) reached for a given total XP. */
export function levelForXp(totalXp: number): number {
  let level = 1;
  for (let i = MAX_LEVEL - 1; i >= 0; i--) {
    if (totalXp >= XP_FOR_LEVEL[i]) {
      level = i + 1;
      break;
    }
  }
  return level;
}

/** XP thresholds for the current and next level, for rendering a progress bar. */
export function xpProgress(totalXp: number) {
  const level = levelForXp(totalXp);
  const current = XP_FOR_LEVEL[level - 1];
  const next = level < MAX_LEVEL ? XP_FOR_LEVEL[level] : current;
  const span = Math.max(1, next - current);
  const progress = level >= MAX_LEVEL ? 1 : Math.min(1, (totalXp - current) / span);
  return { level, current, next, progress };
}

/** Real Pokémon GO CP formula: CP = max(10, floor(Atk * sqrt(Def) * sqrt(Sta) * CPM^2 / 10)). */
export function calculateCP(
  baseStats: { attack: number; defense: number; stamina: number },
  level: number,
  ivs: { attack: number; defense: number; stamina: number },
): number {
  const cpm = CP_MULTIPLIER[Math.min(Math.max(level, 1), MAX_LEVEL) - 1];
  const atk = baseStats.attack + ivs.attack;
  const def = baseStats.defense + ivs.defense;
  const sta = baseStats.stamina + ivs.stamina;
  const cp = (atk * Math.sqrt(def) * Math.sqrt(sta) * cpm * cpm) / 10;
  return Math.max(10, Math.floor(cp));
}
