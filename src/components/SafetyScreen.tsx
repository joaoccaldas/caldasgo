import { motion } from 'framer-motion';

interface SafetyScreenProps {
  onAccept: () => void;
}

const SafetyIllustration = () => (
  <svg viewBox="0 0 280 190" className="h-auto w-full" aria-hidden="true">
    <defs>
      <linearGradient id="safetySky" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stopColor="#dff8fb" />
        <stop offset="100%" stopColor="#a4e2db" />
      </linearGradient>
      <linearGradient id="safetyGround" x1="0" y1="0" x2="1" y2="0">
        <stop offset="0%" stopColor="#84cb8d" />
        <stop offset="100%" stopColor="#55b77e" />
      </linearGradient>
    </defs>
    <rect width="280" height="190" rx="28" fill="url(#safetySky)" />
    <path d="M0 139 C48 115 87 135 131 113 C176 91 220 114 280 88 V190 H0Z" fill="#b6e8a4" />
    <path d="M0 157 C52 130 99 153 145 129 C189 106 233 127 280 110 V190 H0Z" fill="url(#safetyGround)" />
    <path d="M112 190 C126 159 138 134 147 106 C157 128 169 159 183 190Z" fill="#e8e7d4" opacity="0.9" />
    <path d="M147 111 V190" stroke="#fff" strokeWidth="4" strokeDasharray="10 11" opacity="0.9" />
    <g transform="translate(77 61)">
      <circle cx="21" cy="20" r="11" fill="#244d58" />
      <path d="M13 36 C20 29 31 31 36 39 L43 68 H30 L26 50 L19 70 H7 L14 48 L4 57 L0 49Z" fill="#244d58" />
      <path d="M30 37 L50 29" stroke="#244d58" strokeWidth="7" strokeLinecap="round" />
      <rect x="48" y="19" width="17" height="25" rx="4" fill="#fff" stroke="#244d58" strokeWidth="4" transform="rotate(11 56 31)" />
      <circle cx="57" cy="37" r="1.5" fill="#45b9b1" />
    </g>
    <g transform="translate(191 105)">
      <path d="M0 44 L18 0 L36 44Z" fill="#f39a3e" stroke="#244d58" strokeWidth="4" strokeLinejoin="round" />
      <path d="M8 25 H28" stroke="#fff3d2" strokeWidth="5" />
      <rect x="-6" y="42" width="48" height="8" rx="4" fill="#244d58" />
    </g>
    <g opacity="0.82">
      <circle cx="231" cy="45" r="20" fill="#fff7b2" />
      <path d="M231 14 V4 M231 86 V76 M200 45 H190 M272 45 H262 M209 23 L202 16 M260 74 L253 67 M209 67 L202 74 M260 16 L253 23" stroke="#fff" strokeWidth="4" strokeLinecap="round" />
    </g>
  </svg>
);

const SafetyScreen: React.FC<SafetyScreenProps> = ({ onAccept }) => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, scale: 1.015 }}
      transition={{ duration: 0.28 }}
      className="absolute inset-0 z-[950] overflow-hidden bg-[linear-gradient(160deg,#9ee0c9_0%,#5bb6aa_48%,#287d8f_100%)]"
    >
      <div className="absolute -left-24 top-12 h-64 w-64 rounded-full border border-white/20" />
      <div className="absolute -left-10 top-28 h-44 w-44 rounded-full border border-white/15" />
      <div className="absolute -right-28 bottom-20 h-80 w-80 rounded-full border border-white/20" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(255,255,255,.28),transparent_52%)]" />

      <div className="relative flex h-full w-full flex-col px-5 pb-[max(24px,env(safe-area-inset-bottom))] pt-[max(20px,env(safe-area-inset-top))]">
        <div className="flex items-center justify-between text-[10px] font-black uppercase tracking-[0.19em] text-white/75">
          <span>CaldasGO safety</span>
          <span>Step 1 of 1</span>
        </div>

        <div className="flex flex-1 items-center justify-center py-5">
          <motion.section
            initial={{ y: 24, opacity: 0, scale: 0.96 }}
            animate={{ y: 0, opacity: 1, scale: 1 }}
            transition={{ type: 'spring', stiffness: 155, damping: 18 }}
            className="w-full max-w-[390px] overflow-hidden rounded-[30px] border border-white/80 bg-[#fbfdfb] shadow-[0_24px_60px_rgba(16,73,78,.28)]"
          >
            <div className="p-3 pb-0">
              <SafetyIllustration />
            </div>

            <div className="px-7 pb-8 pt-5 text-center">
              <div className="mx-auto mb-3 flex h-10 w-10 items-center justify-center rounded-full bg-[#e9f7ef] text-[#25977d] ring-1 ring-[#ccebdc]">
                <svg viewBox="0 0 24 24" className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <path d="M12 3 3.5 7.2v5.3c0 4.6 3.4 7.8 8.5 9.5 5.1-1.7 8.5-4.9 8.5-9.5V7.2L12 3Z" />
                  <path d="m8.5 12.3 2.2 2.2 4.8-5" />
                </svg>
              </div>

              <h2 className="text-[26px] font-black leading-[1.08] tracking-[-0.035em] text-[#274e52]">
                Remember to be alert at all times
              </h2>
              <p className="mx-auto mt-3 max-w-[300px] text-[14px] font-medium leading-6 text-[#668184]">
                Stay aware of your surroundings. Do not play while driving, enter restricted areas, or put yourself in danger.
              </p>

              <div className="mt-5 rounded-2xl bg-[#eef8f3] px-4 py-3 text-left ring-1 ring-[#d9eee4]">
                <div className="flex items-start gap-3">
                  <div className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-white text-[#258e91] shadow-sm">
                    <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                      <path d="M20 10c0 5-8 11-8 11S4 15 4 10a8 8 0 1 1 16 0Z" />
                      <circle cx="12" cy="10" r="2.5" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-[11px] font-black uppercase tracking-[0.12em] text-[#2e686c]">Location use</p>
                    <p className="mt-0.5 text-xs leading-5 text-[#6b8587]">Your device location is used only to position the local game map.</p>
                  </div>
                </div>
              </div>

              <motion.button
                whileTap={{ scale: 0.98, y: 1 }}
                onClick={onAccept}
                className="mt-6 h-14 w-full rounded-full border-2 border-white bg-gradient-to-r from-[#69d39d] via-[#34c1aa] to-[#239cab] text-base font-black uppercase tracking-[0.2em] text-white shadow-[0_8px_18px_rgba(39,151,142,.28),inset_0_1px_0_rgba(255,255,255,.4)]"
              >
                I understand
              </motion.button>
              <p className="mt-3 text-[9px] font-bold uppercase tracking-[0.12em] text-[#9bb0af]">Play safely and respect private property</p>
            </div>
          </motion.section>
        </div>
      </div>
    </motion.div>
  );
};

export default SafetyScreen;
