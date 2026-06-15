import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { getPogoSprite } from '../data/pokemonDatabase';

interface SplashScreenProps {
  onEnter: () => void;
}

// A few iconic real Pokémon sprites that drift across the loading screen.
const FLOATERS = [25, 1, 4, 7, 150, 144];

const SplashScreen: React.FC<SplashScreenProps> = ({ onEnter }) => {
  const [ready, setReady] = useState(false);

  // Mirror the real game's brief boot loader before the map is playable.
  useEffect(() => {
    const t = setTimeout(() => setReady(true), 1800);
    return () => clearTimeout(t);
  }, []);

  return (
    <motion.div
      initial={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="absolute inset-0 z-[1000] flex flex-col items-center justify-between py-20 overflow-hidden"
      style={{ background: 'radial-gradient(circle at 50% 35%, #1b6e7e 0%, #0b2a3a 70%)' }}
    >
      {/* Drifting real Pokémon sprites */}
      {FLOATERS.map((id, i) => (
        <motion.img
          key={id}
          src={getPogoSprite(id)}
          alt=""
          className="absolute w-24 h-24 object-contain opacity-20 pointer-events-none"
          style={{ left: `${10 + i * 15}%`, top: `${15 + (i % 3) * 25}%` }}
          animate={{ y: [-12, 12], rotate: [-4, 4] }}
          transition={{ repeat: Infinity, duration: 4 + i, repeatType: 'mirror', ease: 'easeInOut' }}
          onError={(e) => { e.currentTarget.style.display = 'none'; }}
        />
      ))}

      {/* Wordmark */}
      <div className="flex-1 flex flex-col items-center justify-center z-10">
        <motion.div
          initial={{ scale: 0.6, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: 'spring', damping: 12 }}
          className="relative"
        >
          {/* Poké Ball mark — gently bobs while loading */}
          <motion.div
            animate={{ y: [-6, 6], rotate: [-3, 3] }}
            transition={{ repeat: Infinity, duration: 2.4, repeatType: 'mirror', ease: 'easeInOut' }}
            className="w-24 h-24 mx-auto mb-5 rounded-full bg-white border-[6px] border-slate-900 shadow-2xl relative overflow-hidden"
          >
            <div className="absolute top-0 left-0 right-0 h-1/2 bg-[#ee1c25]" />
            <div className="absolute top-1/2 left-0 right-0 h-[6px] -translate-y-1/2 bg-slate-900" />
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-8 h-8 bg-white rounded-full border-[5px] border-slate-900" />
          </motion.div>
          <h1 className="text-6xl font-display font-extrabold tracking-tight text-center">
            <span className="text-pogo-gold drop-shadow-[0_3px_0_rgba(11,42,58,0.9)]">Caldas</span>
            <span className="text-white drop-shadow-[0_3px_0_rgba(11,42,58,0.9)]">GO</span>
          </h1>
        </motion.div>
      </div>

      {/* Loader / Play button */}
      <div className="z-10 flex flex-col items-center gap-4 w-full px-12">
        {ready ? (
          <motion.button
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            whileTap={{ scale: 0.95 }}
            onClick={onEnter}
            className="px-14 py-3.5 rounded-pogo-pill bg-pogo-gold text-pogo-navy font-display font-extrabold text-xl tracking-widest shadow-[0_6px_0_#c99526] active:translate-y-1 active:shadow-[0_3px_0_#c99526] transition-all"
          >
            PLAY
          </motion.button>
        ) : (
          <>
            <div className="w-full max-w-xs h-2 rounded-full bg-white/20 overflow-hidden">
              <motion.div
                className="h-full bg-[#2dd4bf] rounded-full"
                initial={{ width: '5%' }}
                animate={{ width: '100%' }}
                transition={{ duration: 1.6, ease: 'easeInOut' }}
              />
            </div>
            <span className="text-white/70 font-bold text-xs tracking-widest uppercase">Loading…</span>
          </>
        )}
      </div>
    </motion.div>
  );
};

export default SplashScreen;
