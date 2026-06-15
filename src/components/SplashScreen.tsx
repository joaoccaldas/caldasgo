import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { getPogoSprite } from '../data/pokemonDatabase';

interface SplashScreenProps {
  onEnter: () => void;
}

const FLOATERS = [25, 1, 4, 7, 133, 143];

const SplashScreen: React.FC<SplashScreenProps> = ({ onEnter }) => {
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setReady(true), 1900);
    return () => clearTimeout(timer);
  }, []);

  return (
    <motion.div
      initial={{ opacity: 1 }}
      exit={{ opacity: 0, scale: 1.02 }}
      transition={{ duration: 0.35 }}
      className="absolute inset-0 z-[1000] overflow-hidden bg-[#dff5fb] text-[#173f4b]"
    >
      <div className="absolute inset-x-0 top-0 h-[56%] bg-[radial-gradient(circle_at_50%_10%,rgba(255,255,255,0.95),rgba(214,242,249,0.72)_45%,rgba(146,218,226,0.58)_100%)]" />
      <div className="absolute inset-x-0 bottom-0 h-[49%] bg-[linear-gradient(180deg,#8bd39a_0%,#68bd7e_48%,#3f9869_100%)]" />
      <div className="absolute left-[-18%] right-[-18%] bottom-[25%] h-36 rounded-[50%] bg-[#b9e7ac] blur-[1px]" />
      <div className="absolute left-[-16%] right-[-16%] bottom-[16%] h-32 rounded-[50%] bg-[#79c98b]" />

      <svg className="absolute inset-x-0 bottom-[13%] h-40 w-full opacity-45" viewBox="0 0 390 160" preserveAspectRatio="none" aria-hidden="true">
        <path d="M0 112 C45 90 83 102 121 82 C163 59 206 76 250 58 C299 38 340 59 390 43" fill="none" stroke="rgba(255,255,255,.72)" strokeWidth="3" />
        <path d="M0 140 C52 112 100 132 147 106 C191 84 232 101 281 78 C329 57 357 70 390 61" fill="none" stroke="rgba(255,255,255,.48)" strokeWidth="2" />
      </svg>

      {FLOATERS.map((id, index) => (
        <motion.img
          key={id}
          src={getPogoSprite(id)}
          alt=""
          className="absolute h-16 w-16 object-contain drop-shadow-[0_7px_8px_rgba(18,71,72,.22)] sm:h-20 sm:w-20"
          style={{
            left: `${6 + index * 17}%`,
            top: `${15 + (index % 3) * 12}%`,
            opacity: index === 0 || index === 4 ? 0.32 : 0.2,
          }}
          animate={{ y: [-5, 7, -5], rotate: [-2, 2, -2] }}
          transition={{ duration: 4.5 + index * 0.35, repeat: Infinity, ease: 'easeInOut' }}
          onError={(event) => { event.currentTarget.style.display = 'none'; }}
        />
      ))}

      <div className="absolute inset-0 flex flex-col px-6 pb-[max(28px,env(safe-area-inset-bottom))] pt-[max(22px,env(safe-area-inset-top))]">
        <div className="flex items-center justify-between text-[10px] font-black uppercase tracking-[0.22em] text-[#2c6b73]/80">
          <span>Location adventure</span>
          <span>v1.0</span>
        </div>

        <div className="flex flex-1 flex-col items-center justify-center -translate-y-3">
          <motion.div
            initial={{ y: 18, opacity: 0, scale: 0.88 }}
            animate={{ y: 0, opacity: 1, scale: 1 }}
            transition={{ type: 'spring', stiffness: 160, damping: 17 }}
            className="relative flex flex-col items-center"
          >
            <div className="relative mb-4 h-[104px] w-[104px] rounded-full border-[7px] border-white bg-white shadow-[0_16px_38px_rgba(17,77,84,.23)]">
              <div className="absolute inset-[5px] overflow-hidden rounded-full border-[5px] border-[#183f4b] bg-white">
                <div className="absolute inset-x-0 top-0 h-1/2 bg-[#ef4f52]" />
                <div className="absolute inset-x-0 top-1/2 h-[6px] -translate-y-1/2 bg-[#183f4b]" />
                <div className="absolute left-1/2 top-1/2 h-9 w-9 -translate-x-1/2 -translate-y-1/2 rounded-full border-[5px] border-[#183f4b] bg-white shadow-inner" />
              </div>
              <motion.div
                className="absolute inset-[-10px] rounded-full border-2 border-white/55"
                animate={{ scale: [1, 1.13, 1], opacity: [0.55, 0, 0.55] }}
                transition={{ duration: 2.1, repeat: Infinity }}
              />
            </div>

            <div className="relative text-center">
              <p className="mb-1 text-[11px] font-black uppercase tracking-[0.36em] text-[#28788a]">Explore your world</p>
              <h1 className="text-[54px] font-black leading-none tracking-[-0.075em] drop-shadow-[0_4px_0_rgba(255,255,255,.85)] sm:text-[62px]">
                <span className="text-[#f4bf3e] [text-shadow:0_3px_0_#775612,0_5px_12px_rgba(27,72,75,.18)]">Caldas</span>
                <span className="ml-1 text-white [text-shadow:0_3px_0_#247489,0_5px_12px_rgba(27,72,75,.18)]">GO</span>
              </h1>
              <div className="mx-auto mt-3 h-1 w-28 rounded-full bg-gradient-to-r from-transparent via-white to-transparent opacity-85" />
            </div>
          </motion.div>
        </div>

        <div className="mx-auto flex w-full max-w-sm flex-col items-center gap-4">
          {ready ? (
            <motion.button
              initial={{ y: 12, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              whileTap={{ scale: 0.97, y: 2 }}
              onClick={onEnter}
              className="relative h-14 w-full overflow-hidden rounded-full border-2 border-white/90 bg-gradient-to-r from-[#43c9b3] via-[#26b7b6] to-[#228fae] text-base font-black uppercase tracking-[0.19em] text-white shadow-[0_8px_18px_rgba(26,102,110,.32),inset_0_1px_0_rgba(255,255,255,.45)]"
            >
              <span className="relative z-10">Enter CaldasGO</span>
              <span className="absolute inset-x-5 top-1 h-px bg-white/55" />
            </motion.button>
          ) : (
            <div className="w-full rounded-2xl bg-white/75 px-5 py-4 shadow-[0_10px_24px_rgba(31,104,102,.16)] backdrop-blur-md">
              <div className="mb-2 flex items-center justify-between text-[10px] font-black uppercase tracking-[0.18em] text-[#31737b]">
                <span>Preparing adventure</span>
                <span>Loading</span>
              </div>
              <div className="h-2 overflow-hidden rounded-full bg-[#c7e5df]">
                <motion.div
                  className="h-full rounded-full bg-gradient-to-r from-[#54d3b5] to-[#249eb2]"
                  initial={{ width: '4%' }}
                  animate={{ width: '100%' }}
                  transition={{ duration: 1.75, ease: 'easeInOut' }}
                />
              </div>
            </div>
          )}

          <p className="text-center text-[9px] font-bold uppercase leading-relaxed tracking-[0.13em] text-white/85 drop-shadow-sm">
            Unofficial educational programming project
          </p>
        </div>
      </div>
    </motion.div>
  );
};

export default SplashScreen;
