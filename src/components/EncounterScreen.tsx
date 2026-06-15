import { useEffect, useMemo, useState } from 'react';
import { AnimatePresence, motion, type PanInfo } from 'framer-motion';
import type { OwnedPokemon, SpawnedPokemon } from '../types';
import PokemonSprite from './PokemonSprite';
import { useInventory } from '../hooks/useInventory';

const CATCH_XP = 100;
const NEW_SPECIES_XP = 500;
const ITEM_SPRITE_BASE = 'https://cdn.jsdelivr.net/gh/PokeAPI/sprites@master/sprites/items/';

type ThrowGrade = 'Nice' | 'Great' | 'Excellent' | null;
type CatchPhase = 'idle' | 'flying' | 'impact' | 'shaking' | 'breakout' | 'caught';

interface EncounterScreenProps {
  spawn: SpawnedPokemon;
  onClose: () => void;
  onCaught: (pokemon: OwnedPokemon, xpGained: number) => void;
  catchPokemon: (spawn: SpawnedPokemon) => Promise<{ pokemon: OwnedPokemon; isNewSpecies: boolean }>;
  gainXp: (amount: number) => Promise<number>;
}

const gradeFromRing = (scale: number): ThrowGrade => {
  if (scale <= 0.37) return 'Excellent';
  if (scale <= 0.57) return 'Great';
  if (scale <= 0.8) return 'Nice';
  return null;
};

const EncounterScreen: React.FC<EncounterScreenProps> = ({ spawn, onClose, onCaught, catchPokemon, gainXp }) => {
  const { inventory, consumeItem } = useInventory();
  const [phase, setPhase] = useState<CatchPhase>('idle');
  const [ringScale, setRingScale] = useState(1);
  const [berryActive, setBerryActive] = useState(false);
  const [message, setMessage] = useState('');
  const [throwGrade, setThrowGrade] = useState<ThrowGrade>(null);
  const [throwX, setThrowX] = useState(0);
  const [arEnabled, setArEnabled] = useState(false);
  const [showBallTray, setShowBallTray] = useState(false);
  const [caughtResult, setCaughtResult] = useState<{ pokemon: OwnedPokemon; xp: number; isNew: boolean } | null>(null);

  const busy = phase !== 'idle';
  const ringColor = useMemo(() => ringScale < 0.42 ? '#ec5656' : ringScale < 0.7 ? '#efc83f' : '#5dcc7b', [ringScale]);

  useEffect(() => {
    if (busy) return;
    const interval = window.setInterval(() => {
      setRingScale((previous) => previous <= 0.28 ? 1 : previous - 0.025);
    }, 55);
    return () => window.clearInterval(interval);
  }, [busy]);

  useEffect(() => {
    if (!message || phase === 'caught') return;
    const timer = window.setTimeout(() => setMessage(''), 1800);
    return () => window.clearTimeout(timer);
  }, [message, phase]);

  const useBerry = async () => {
    if (berryActive || busy) return;
    if (!(await consumeItem('razzBerries', 1))) {
      setMessage('No Razz Berries left');
      return;
    }
    setBerryActive(true);
    setMessage(`${spawn.species.name} ate the Berry!`);
  };

  const resolveCatch = async (grade: ThrowGrade) => {
    setPhase('shaking');
    await new Promise((resolve) => window.setTimeout(resolve, 1850));

    const gradeBonus = grade === 'Excellent' ? 0.24 : grade === 'Great' ? 0.16 : grade === 'Nice' ? 0.08 : 0;
    const berryBonus = berryActive ? 0.22 : 0;
    const success = Math.random() < Math.min(0.94, 0.48 + gradeBonus + berryBonus);

    if (!success) {
      setPhase('breakout');
      setMessage(`${spawn.species.name} broke free!`);
      setBerryActive(false);
      await new Promise((resolve) => window.setTimeout(resolve, 760));
      setPhase('idle');
      setThrowGrade(null);
      return;
    }

    const { pokemon, isNewSpecies } = await catchPokemon(spawn);
    const gradeXp = grade === 'Excellent' ? 1000 : grade === 'Great' ? 200 : grade === 'Nice' ? 20 : 0;
    const xp = CATCH_XP + gradeXp + (isNewSpecies ? NEW_SPECIES_XP : 0);
    await gainXp(xp);
    setCaughtResult({ pokemon, xp, isNew: isNewSpecies });
    setPhase('caught');
    setMessage('Gotcha!');
  };

  const throwBall = async (info: PanInfo) => {
    if (busy) return;
    const upwardForce = Math.max(-info.offset.y, -info.velocity.y * 0.11);
    if (upwardForce < 74) {
      setMessage('Swipe upward to throw');
      return;
    }
    if (!(await consumeItem('pokeballs', 1))) {
      setMessage('Out of Poké Balls');
      return;
    }

    const grade = gradeFromRing(ringScale);
    setThrowGrade(grade);
    setThrowX(Math.max(-96, Math.min(96, info.offset.x + info.velocity.x * 0.035)));
    setShowBallTray(false);
    setPhase('flying');
    await new Promise((resolve) => window.setTimeout(resolve, 620));
    setPhase('impact');
    if (grade) setMessage(`${grade}!`);
    await new Promise((resolve) => window.setTimeout(resolve, 260));
    await resolveCatch(grade);
  };

  const finishCatch = () => {
    if (caughtResult) onCaught(caughtResult.pokemon, caughtResult.xp);
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="absolute inset-0 z-[900] overflow-hidden bg-[#8ecbd7] text-white">
      <div className={`absolute inset-0 transition duration-500 ${arEnabled ? 'bg-[linear-gradient(180deg,#7a9faf_0%,#b7ccd1_44%,#8fa58f_45%,#718a72_100%)]' : 'bg-[linear-gradient(180deg,#77cbe2_0%,#d9f0eb_43%,#90cc81_44%,#5da46d_100%)]'}`} />
      <div className="absolute inset-x-[-28%] bottom-[14%] h-[37%] rounded-[50%] bg-[#82c478]" />
      <div className="absolute inset-x-[-34%] bottom-[-13%] h-[42%] rounded-[50%] bg-[#4f9866]" />
      <svg viewBox="0 0 390 844" preserveAspectRatio="none" className="absolute inset-0 h-full w-full opacity-70"><path d="M-20 720c100-116 172-85 232-171 65-94 118-43 208-133" fill="none" stroke="rgba(245,241,209,.72)" strokeWidth="54" strokeLinecap="round" /><path d="M-20 720c100-116 172-85 232-171 65-94 118-43 208-133" fill="none" stroke="rgba(255,255,255,.78)" strokeWidth="4" strokeDasharray="12 18" /></svg>
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_36%,rgba(255,255,255,.25),transparent_43%)]" />

      <header className="relative z-30 flex items-center justify-between px-4 pt-[max(18px,env(safe-area-inset-top))]">
        <button type="button" onClick={onClose} disabled={busy} className="flex h-11 w-11 items-center justify-center rounded-full bg-[#263f4d]/48 text-white shadow-md ring-1 ring-white/35 backdrop-blur disabled:opacity-35" aria-label="Leave encounter"><svg viewBox="0 0 24 24" className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth="2.2"><path d="M9 5H5v14h4M14 8l4 4-4 4M18 12H9" /></svg></button>
        <button type="button" onClick={() => setArEnabled(!arEnabled)} disabled={busy} className={`rounded-full px-4 py-2 text-xs font-black uppercase tracking-[0.12em] shadow-md ring-1 ring-white/35 backdrop-blur ${arEnabled ? 'bg-white text-[#496f6f]' : 'bg-[#263f4d]/48 text-white'}`}>AR {arEnabled ? 'On' : 'Off'}</button>
      </header>

      <main className="relative z-10 flex h-[calc(100%-64px)] flex-col items-center">
        <div className="relative mt-3 h-[390px] w-full max-w-[430px]">
          <div className="absolute inset-x-0 top-2 flex flex-col items-center">
            <svg viewBox="0 0 280 140" className="h-32 w-72 opacity-68"><path d="M20 130A120 120 0 0 1 260 130" fill="none" stroke="white" strokeWidth="4" /><circle cx="140" cy="10" r="5" fill="white" /></svg>
            <div className="absolute top-5 rounded-full bg-[#254554]/60 px-5 py-1.5 shadow-md ring-1 ring-white/25 backdrop-blur"><span className="text-xs font-black text-white/70">CP </span><span className="text-xl font-black">{spawn.cp}</span></div>
          </div>

          {berryActive && <motion.div initial={{ scale: 0 }} animate={{ scale: [0, 1.2, 1] }} className="absolute right-[22%] top-[42%] z-20"><img src={`${ITEM_SPRITE_BASE}razz-berry.png`} alt="Berry active" className="h-9 w-9 drop-shadow-lg" /></motion.div>}

          <AnimatePresence mode="wait">
            {(phase === 'idle' || phase === 'flying') && <motion.div key="creature" initial={{ scale: .72, opacity: 0 }} animate={{ scale: 1, opacity: 1, x: phase === 'flying' ? [0, -8, 6, 0] : 0 }} exit={{ scale: .2, opacity: 0 }} className="absolute inset-x-0 bottom-3 flex h-72 items-end justify-center">
              <div className="absolute bottom-3 h-12 w-48 rounded-[50%] bg-black/24 blur-md" />
              <motion.div animate={phase === 'idle' ? { y: [0, -9, 0], rotate: [0, .8, 0, -.8, 0] } : { scale: [1, .92, 0] }} transition={phase === 'idle' ? { duration: 3.2, repeat: Infinity, ease: 'easeInOut' } : { duration: .64 }} className="relative h-64 w-[82%]"><PokemonSprite id={spawn.speciesId} name={spawn.species.name} variant="artwork" className="h-full w-full object-contain drop-shadow-[0_20px_22px_rgba(29,66,69,.3)]" /></motion.div>
              {phase === 'idle' && <div className="pointer-events-none absolute bottom-28 flex h-48 w-48 items-center justify-center"><div className="absolute inset-0 rounded-full border-[4px] border-white/62" /><div className="absolute rounded-full border-[5px] transition-[width,height] duration-75" style={{ width: `${ringScale * 100}%`, height: `${ringScale * 100}%`, borderColor: ringColor }} /></div>}
            </motion.div>}
          </AnimatePresence>

          {(phase === 'flying' || phase === 'impact') && <motion.div initial={{ x: 0, y: 380, scale: 1, rotate: 0 }} animate={{ x: throwX, y: phase === 'impact' ? 218 : 70, scale: phase === 'impact' ? .55 : .7, rotate: 720 }} transition={{ duration: phase === 'impact' ? .18 : .62, ease: [0.22, .8, .28, 1] }} className="absolute left-1/2 top-0 z-40 -ml-8"><div className="relative h-16 w-16 overflow-hidden rounded-full border-[4px] border-[#172b3b] bg-[#ee4d4f] shadow-xl"><div className="absolute inset-x-0 bottom-0 h-1/2 border-t-[4px] border-[#172b3b] bg-white" /><div className="absolute left-1/2 top-1/2 h-6 w-6 -translate-x-1/2 -translate-y-1/2 rounded-full border-[4px] border-[#172b3b] bg-white" /></div></motion.div>}

          {(phase === 'shaking' || phase === 'caught' || phase === 'breakout') && <motion.div initial={{ y: 100, scale: .55 }} animate={phase === 'shaking' ? { y: 250, scale: .72, rotate: [0, 0, 17, -17, 0, 17, -17, 0] } : phase === 'breakout' ? { y: 220, scale: [1, 1.45, 0], opacity: [1, 1, 0] } : { y: 250, scale: .72, rotate: 0 }} transition={{ duration: phase === 'shaking' ? 1.75 : .62, times: phase === 'shaking' ? [0, .2, .32, .44, .58, .7, .82, 1] : undefined }} className="absolute left-1/2 top-0 z-40 -ml-8"><div className="relative h-16 w-16 overflow-hidden rounded-full border-[4px] border-[#172b3b] bg-[#ee4d4f] shadow-[0_12px_22px_rgba(22,46,56,.38)]"><div className="absolute inset-x-0 bottom-0 h-1/2 border-t-[4px] border-[#172b3b] bg-white" /><div className="absolute left-1/2 top-1/2 h-6 w-6 -translate-x-1/2 -translate-y-1/2 rounded-full border-[4px] border-[#172b3b] bg-white"><div className={`absolute inset-1 rounded-full ${phase === 'caught' ? 'bg-[#f2ce43]' : 'bg-white'}`} /></div></div>{phase === 'caught' && <motion.div initial={{ scale: 0, opacity: 0 }} animate={{ scale: [0, 1.2, 1], opacity: 1 }} className="absolute left-1/2 top-1/2 -ml-20 -mt-20 h-40 w-40 rounded-full border-[3px] border-[#f3dc65]/70" />}</motion.div>}
        </div>

        <div className="relative z-30 mt-auto w-full pb-[max(20px,env(safe-area-inset-bottom))]">
          <AnimatePresence>{message && <motion.div initial={{ opacity: 0, y: 12, scale: .9 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0 }} className="mx-auto mb-6 w-fit max-w-[82%] rounded-full bg-[#253e4c]/82 px-5 py-2.5 text-center text-sm font-black shadow-lg ring-1 ring-white/22 backdrop-blur">{message}</motion.div>}</AnimatePresence>

          {phase === 'idle' && <div className="relative h-32">
            <button type="button" onClick={() => void useBerry()} disabled={berryActive || inventory.razzBerries === 0} className="absolute bottom-5 left-6 flex h-14 w-14 items-center justify-center rounded-full bg-white/92 shadow-lg ring-2 ring-white disabled:grayscale disabled:opacity-45"><img src={`${ITEM_SPRITE_BASE}razz-berry.png`} alt="Use Razz Berry" className="h-11 w-11 object-contain" /><span className="absolute -right-1 -top-1 rounded-full bg-[#2e4c59] px-1.5 py-0.5 text-[9px] font-black text-white">{inventory.razzBerries}</span></button>

            <div className="absolute bottom-1 left-1/2 -translate-x-1/2">
              <motion.div drag dragSnapToOrigin dragConstraints={{ left: -150, right: 150, top: -430, bottom: 20 }} dragElastic={.22} onDragEnd={(_event, info) => void throwBall(info)} whileDrag={{ scale: 1.08 }} className="relative h-[88px] w-[88px] touch-none cursor-grab active:cursor-grabbing">
                <motion.div animate={{ rotate: [0, 0] }} className="relative h-full w-full overflow-hidden rounded-full border-[5px] border-[#172b3b] bg-[#ee4d4f] shadow-[0_11px_25px_rgba(23,55,63,.42)]"><div className="absolute inset-x-0 bottom-0 h-1/2 border-t-[5px] border-[#172b3b] bg-white" /><div className="absolute left-1/2 top-1/2 h-9 w-9 -translate-x-1/2 -translate-y-1/2 rounded-full border-[5px] border-[#172b3b] bg-white"><div className="absolute inset-1.5 rounded-full border border-[#c7d2d6]" /></div><div className="absolute right-3 top-2 h-3 w-7 rotate-[-28deg] rounded-full bg-white/35" /></motion.div>
              </motion.div>
              <button type="button" onClick={() => setShowBallTray(!showBallTray)} className="mx-auto mt-1 block rounded-full bg-[#294654]/74 px-3 py-0.5 text-[10px] font-black text-white ring-1 ring-white/20">{inventory.pokeballs}</button>
            </div>

            <button type="button" onClick={() => setMessage('Snapshot saved')} className="absolute bottom-5 right-6 flex h-14 w-14 items-center justify-center rounded-full bg-white/92 text-[#49636d] shadow-lg ring-2 ring-white"><svg viewBox="0 0 24 24" className="h-7 w-7" fill="none" stroke="currentColor" strokeWidth="2"><path d="M4 7h3l2-3h6l2 3h3v12H4z" /><circle cx="12" cy="13" r="4" /></svg></button>
          </div>}

          <AnimatePresence>{showBallTray && phase === 'idle' && <motion.div initial={{ y: 120, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: 120, opacity: 0 }} className="absolute inset-x-4 bottom-28 rounded-[26px] bg-white/94 p-4 text-[#3f5963] shadow-2xl ring-1 ring-white backdrop-blur"><div className="mx-auto mb-3 h-1.5 w-10 rounded-full bg-[#d6dfe2]" /><div className="flex items-center justify-between rounded-2xl bg-[#f1f5f5] px-4 py-3"><div className="flex items-center gap-3"><img src={`${ITEM_SPRITE_BASE}poke-ball.png`} alt="Poké Ball" className="h-11 w-11" /><div><p className="font-black">Poké Ball</p><p className="text-xs font-bold text-[#85979e]">Standard catch ball</p></div></div><span className="text-lg font-black">×{inventory.pokeballs}</span></div></motion.div>}</AnimatePresence>

          {phase === 'caught' && caughtResult && <motion.div initial={{ y: 120, opacity: 0 }} animate={{ y: 0, opacity: 1 }} className="mx-4 rounded-[28px] bg-white/96 p-5 text-[#3d5962] shadow-2xl ring-1 ring-white backdrop-blur"><p className="text-center text-[10px] font-black uppercase tracking-[0.16em] text-[#789097]">{caughtResult.isNew ? 'New Pokédex entry' : 'Pokémon caught'}</p><h2 className="mt-1 text-center text-2xl font-black">{spawn.species.name}</h2><div className="mt-4 grid grid-cols-3 divide-x divide-[#e0e7e8] rounded-2xl bg-[#f1f6f5] py-3 text-center"><div><p className="font-black">{throwGrade ?? 'Catch'}</p><p className="text-[9px] font-bold uppercase text-[#8b9ca1]">Throw</p></div><div><p className="font-black">+{caughtResult.xp}</p><p className="text-[9px] font-bold uppercase text-[#8b9ca1]">XP</p></div><div><p className="font-black">3</p><p className="text-[9px] font-bold uppercase text-[#8b9ca1]">Candy</p></div></div><button type="button" onClick={finishCatch} className="mt-4 h-12 w-full rounded-full bg-gradient-to-r from-[#4cc4a9] to-[#299bab] text-sm font-black uppercase tracking-[0.15em] text-white shadow-lg">Continue</button></motion.div>}
        </div>
      </main>
    </motion.div>
  );
};

export default EncounterScreen;
