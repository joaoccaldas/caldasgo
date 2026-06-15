import { motion } from 'framer-motion';

interface SafetyScreenProps {
  onAccept: () => void;
}

/** The "Stay Aware of Your Surroundings" gate the real game shows right after loading. */
const SafetyScreen: React.FC<SafetyScreenProps> = ({ onAccept }) => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="absolute inset-0 z-[950] flex items-center justify-center px-8"
      style={{ background: 'linear-gradient(160deg, #6bbf9b 0%, #2f8a8f 100%)' }}
    >
      <motion.div
        initial={{ scale: 0.9, y: 20 }}
        animate={{ scale: 1, y: 0 }}
        className="w-full max-w-sm bg-[#fbfdfb] rounded-3xl shadow-2xl px-7 py-9 flex flex-col items-center"
      >
        {/* Warning triangle: walking person + traffic cone */}
        <svg viewBox="0 0 120 110" className="w-44 h-40 mb-6">
          <path d="M60 8 L114 100 H6 Z" fill="#f9e26b" stroke="#1f3b3b" strokeWidth="5" strokeLinejoin="round" />
          {/* walker */}
          <g fill="#1f3b3b">
            <circle cx="48" cy="46" r="6" />
            <rect x="44" y="40" width="12" height="7" rx="2" transform="rotate(-8 50 43)" />
            <path d="M46 53 q5 -4 10 0 l2 14 -4 1 -3 -10 -3 11 -4 -1z" />
            <rect x="40" y="56" width="10" height="4" rx="2" transform="rotate(20 45 58)" />
            <rect x="55" y="55" width="9" height="4" rx="2" transform="rotate(-10 59 57)" />
          </g>
          <rect x="45" y="86" width="34" height="3" fill="#1f3b3b" />
          {/* cone */}
          <path d="M78 88 L84 70 L90 88 Z" fill="#1f3b3b" />
          <rect x="80" y="78" width="8" height="2.5" fill="#f9e26b" />
        </svg>

        <h2 className="text-2xl font-display font-extrabold text-[#33524f] text-center mb-3 tracking-tight">
          Stay Aware of Your Surroundings
        </h2>
        <p className="text-[#6a8483] text-center font-medium leading-relaxed mb-8 px-2">
          Do not enter dangerous areas while playing Pokémon GO.
        </p>

        <motion.button
          whileTap={{ scale: 0.96 }}
          onClick={onAccept}
          className="w-full max-w-[220px] py-3.5 rounded-pogo-pill text-white font-display font-extrabold text-lg tracking-widest shadow-pogo-high"
          style={{ background: 'linear-gradient(to right, #8fd99a 0%, #2bb9b0 60%, #1ba7a0 100%)' }}
        >
          OK
        </motion.button>
      </motion.div>
    </motion.div>
  );
};

export default SafetyScreen;
