import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

interface SplashScreenProps {
  onEnter: () => void;
}

const SplashScreen: React.FC<SplashScreenProps> = ({ onEnter }) => {
  const [progress, setProgress] = useState(0);

  // Auto-fill the progress bar over 2.5 seconds, then enter the game.
  useEffect(() => {
    const duration = 2500;
    const interval = 50;
    let elapsed = 0;

    const timer = setInterval(() => {
      elapsed += interval;
      const percent = Math.min((elapsed / duration) * 100, 100);
      setProgress(percent);

      if (elapsed >= duration) {
        clearInterval(timer);
        // Small delay at 100% before transitioning
        setTimeout(onEnter, 300);
      }
    }, interval);

    return () => clearInterval(timer);
  }, [onEnter]);

  return (
    <motion.div
      initial={{ opacity: 1 }}
      exit={{ opacity: 0, transition: { duration: 0.5 } }}
      className="absolute inset-0 z-[1000] flex flex-col justify-end overflow-hidden bg-slate-900"
    >
      {/* Background Image */}
      <div 
        className="absolute inset-0 bg-cover bg-center z-0 opacity-40 scale-110"
        style={{ 
          backgroundImage: 'url("https://cdn.jsdelivr.net/gh/PokeMiners/pogo_assets@master/Images/Loading%20Screens/Season%20of%20Hidden%20Gems.png")',
          filter: 'blur(4px)'
        }}
      />

      {/* Fallback gradient if image fails to load quickly */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent pointer-events-none" />

      {/* Bottom Loading Area */}
      <div className="w-full px-8 pb-10 flex flex-col items-center gap-3 relative z-10">
        
        {/* Warning Message */}
        <div className="bg-white/95 px-6 py-2 rounded shadow-lg border border-slate-200 mb-4 flex items-center gap-3 w-full max-w-sm">
           <svg viewBox="0 0 24 24" width="28" height="28" fill="#e3352f" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="shrink-0"><path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>
           <p className="text-slate-800 font-bold text-[11px] leading-tight flex-1">
             Remember to be alert at all times. Stay aware of your surroundings.
           </p>
        </div>

        {/* Progress Bar Container */}
        <div className="w-full max-w-sm h-2.5 rounded-full bg-[#113f67] border-2 border-[#09223b] overflow-hidden shadow-lg relative">
          {/* Authentic blue fill */}
          <div
            className="h-full bg-[#35b5e6] rounded-full transition-all duration-75 ease-linear relative"
            style={{ width: `${progress}%` }}
          >
             {/* Small shine effect on the bar */}
             <div className="absolute top-0 left-0 right-0 h-1/2 bg-white/20 rounded-t-full"></div>
          </div>
        </div>

        {/* Disclaimer Text */}
        <div className="mt-2 flex flex-col items-center gap-1 opacity-70">
          <p className="text-white font-bold text-[8px] uppercase tracking-wider text-center">
            ©2024 Niantic, Inc. ©2024 Pokémon. ©1995-2024 Nintendo / Creatures Inc. / GAME FREAK inc.
          </p>
        </div>
      </div>
    </motion.div>
  );
};

export default SplashScreen;
