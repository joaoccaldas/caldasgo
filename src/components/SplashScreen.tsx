import { useEffect } from 'react';
import { motion } from 'framer-motion';
import { getPogoSprite } from '../data/pokemonDatabase';

interface SplashScreenProps {
  onEnter: () => void;
}

const SplashScreen: React.FC<SplashScreenProps> = ({ onEnter }) => {
  useEffect(() => {
    const timer = window.setTimeout(onEnter, 2600);
    return () => window.clearTimeout(timer);
  }, [onEnter]);

  return (
    <motion.div
      initial={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.28 }}
      className="absolute inset-0 z-[1000] overflow-hidden bg-[#9bd9df] text-white"
      aria-label="Loading CaldasGO"
    >
      <div className="absolute inset-0 bg-[linear-gradient(180deg,#76cadf_0%,#bce9e5_34%,#8dce95_35%,#60aa70_100%)]" />
      <div className="absolute inset-x-[-22%] bottom-[23%] h-[39%] rounded-[50%] bg-[#bfe8a7]" />
      <div className="absolute inset-x-[-30%] bottom-[8%] h-[36%] rounded-[50%] bg-[#78bd7c]" />
      <div className="absolute inset-x-[-12%] bottom-[-12%] h-[38%] rounded-[50%] bg-[#3f8e67]" />

      <svg className="absolute inset-0 h-full w-full" viewBox="0 0 390 844" preserveAspectRatio="none" aria-hidden="true">
        <path d="M-20 613C88 520 151 570 214 481c69-98 122-35 202-116" fill="none" stroke="rgba(244,244,221,.9)" strokeWidth="44" strokeLinecap="round" />
        <path d="M-20 613C88 520 151 570 214 481c69-98 122-35 202-116" fill="none" stroke="rgba(255,255,255,.82)" strokeWidth="4" strokeDasharray="12 18" />
        <circle cx="320" cy="118" r="52" fill="rgba(255,244,166,.78)" />
        <circle cx="320" cy="118" r="69" fill="none" stroke="rgba(255,255,255,.32)" strokeWidth="3" />
      </svg>

      <motion.img
        src={getPogoSprite(130)}
        alt=""
        className="absolute left-1/2 top-[13%] h-56 w-56 -translate-x-1/2 object-contain drop-shadow-[0_18px_20px_rgba(18,70,78,.26)]"
        initial={{ y: 18, opacity: 0, scale: 0.88 }}
        animate={{ y: [0, -7, 0], opacity: 1, scale: 1 }}
        transition={{ opacity: { duration: 0.5 }, scale: { duration: 0.6 }, y: { duration: 3.2, repeat: Infinity, ease: 'easeInOut' } }}
      />

      <motion.img
        src={getPogoSprite(129)}
        alt=""
        className="absolute bottom-[27%] left-[13%] h-24 w-24 object-contain drop-shadow-[0_9px_10px_rgba(29,81,69,.22)]"
        animate={{ rotate: [-5, 4, -5], y: [0, -4, 0] }}
        transition={{ duration: 2.8, repeat: Infinity, ease: 'easeInOut' }}
      />

      <motion.img
        src={getPogoSprite(150)}
        alt=""
        className="absolute bottom-[31%] right-[8%] h-28 w-28 object-contain opacity-90 drop-shadow-[0_12px_15px_rgba(36,58,85,.24)]"
        animate={{ y: [0, -8, 0] }}
        transition={{ duration: 3.6, repeat: Infinity, ease: 'easeInOut' }}
      />

      <div className="absolute inset-x-0 top-[max(22px,env(safe-area-inset-top))] flex justify-center">
        <div className="text-center">
          <p className="text-[10px] font-black uppercase tracking-[0.36em] text-white/82">Explore together</p>
          <h1 className="mt-1 text-[46px] font-black leading-none tracking-[-0.07em] [text-shadow:0_3px_0_#235f72,0_7px_18px_rgba(22,76,88,.24)]">
            <span className="text-[#f5c948]">Caldas</span><span className="text-white">GO</span>
          </h1>
        </div>
      </div>

      <div className="absolute inset-x-7 bottom-[max(28px,env(safe-area-inset-bottom))]">
        <div className="mx-auto max-w-sm">
          <div className="mb-2 flex items-center justify-between text-[9px] font-black uppercase tracking-[0.18em] text-white/88">
            <span>Loading adventure</span>
            <span>Connecting</span>
          </div>
          <div className="h-[7px] overflow-hidden rounded-full border border-white/75 bg-[#264e55]/30 shadow-[0_2px_7px_rgba(25,64,69,.18)]">
            <motion.div
              className="h-full rounded-full bg-white shadow-[0_0_9px_rgba(255,255,255,.75)]"
              initial={{ width: '3%' }}
              animate={{ width: '100%' }}
              transition={{ duration: 2.45, ease: [0.25, 0.8, 0.25, 1] }}
            />
          </div>
          <p className="mt-4 text-center text-[8px] font-bold uppercase tracking-[0.12em] text-white/72">Unofficial educational project</p>
        </div>
      </div>
    </motion.div>
  );
};

export default SplashScreen;
