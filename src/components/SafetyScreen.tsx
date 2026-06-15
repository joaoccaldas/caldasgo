import { motion } from 'framer-motion';

interface SafetyScreenProps {
  onAccept: () => void;
}

const SafetyArtwork = () => (
  <svg viewBox="0 0 390 520" className="h-full w-full" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
    <defs>
      <linearGradient id="safety-sky" x1="0" y1="0" x2="0" y2="1"><stop stopColor="#8ed4e3" /><stop offset="1" stopColor="#d7f0df" /></linearGradient>
      <linearGradient id="safety-field" x1="0" y1="0" x2="0" y2="1"><stop stopColor="#91cf90" /><stop offset="1" stopColor="#4f9d6c" /></linearGradient>
      <linearGradient id="safety-shirt" x1="0" y1="0" x2="1" y2="1"><stop stopColor="#35a6b6" /><stop offset="1" stopColor="#1d687b" /></linearGradient>
    </defs>
    <rect width="390" height="520" fill="url(#safety-sky)" />
    <circle cx="315" cy="90" r="46" fill="#fff5ac" opacity=".76" />
    <path d="M0 260c58-44 118-28 168-58 62-38 127-17 222-75v393H0Z" fill="#b8e3a1" />
    <path d="M0 331c68-47 130-18 197-63 70-48 125-23 193-57v309H0Z" fill="url(#safety-field)" />
    <path d="M128 520c26-85 43-152 69-236 29 85 54 159 76 236Z" fill="#e8e5d0" opacity=".96" />
    <path d="M196 292v228" stroke="#fff" strokeWidth="5" strokeDasharray="16 18" opacity=".85" />

    <g transform="translate(112 165)">
      <ellipse cx="80" cy="220" rx="60" ry="13" fill="#20494c" opacity=".18" />
      <circle cx="80" cy="42" r="28" fill="#c98b64" />
      <path d="M52 37c2-30 54-37 60-4l-3 13c-18-8-37-7-57 3Z" fill="#d94357" />
      <path d="M50 44c-16 4-23 12-22 20 13 2 29-2 42-11Z" fill="#a92742" />
      <path d="M53 77c12-9 44-9 55 1l16 74H40Z" fill="url(#safety-shirt)" />
      <path d="M51 93h58l-8 45H58Z" fill="#f7f8f4" opacity=".9" />
      <path d="M41 92 17 151" stroke="#1d687b" strokeWidth="18" strokeLinecap="round" />
      <path d="M119 91 148 135" stroke="#1d687b" strokeWidth="18" strokeLinecap="round" />
      <circle cx="17" cy="151" r="10" fill="#c98b64" />
      <circle cx="149" cy="136" r="10" fill="#c98b64" />
      <rect x="138" y="105" width="25" height="41" rx="5" fill="#fff" stroke="#244c55" strokeWidth="4" transform="rotate(10 150 125)" />
      <path d="M46 149h32l-8 72H37Z" fill="#263b58" />
      <path d="M82 149h34l9 72H91Z" fill="#263b58" />
      <path d="M35 214h37l-5 17H29Z" fill="#f2f5f6" />
      <path d="M91 214h39l8 17H93Z" fill="#f2f5f6" />
    </g>

    <g transform="translate(300 315)">
      <path d="M0 74 34 0l35 74Z" fill="#f49a3f" stroke="#2a5960" strokeWidth="5" strokeLinejoin="round" />
      <path d="M14 43h41" stroke="#fff4d5" strokeWidth="7" />
      <rect x="-9" y="72" width="88" height="11" rx="5" fill="#2a5960" />
    </g>
  </svg>
);

const SafetyScreen: React.FC<SafetyScreenProps> = ({ onAccept }) => (
  <motion.div
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    exit={{ opacity: 0 }}
    transition={{ duration: 0.24 }}
    className="absolute inset-0 z-[950] overflow-hidden bg-[#78c6c8] text-white"
  >
    <div className="absolute inset-0"><SafetyArtwork /></div>
    <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(15,64,72,.03)_0%,rgba(18,59,63,.08)_48%,rgba(13,48,53,.72)_79%,rgba(12,44,50,.92)_100%)]" />

    <div className="relative flex h-full flex-col px-6 pb-[max(28px,env(safe-area-inset-bottom))] pt-[max(18px,env(safe-area-inset-top))]">
      <div className="flex items-center justify-center">
        <span className="rounded-full border border-white/35 bg-[#143f48]/35 px-3 py-1.5 text-[9px] font-black uppercase tracking-[0.2em] backdrop-blur-sm">Play safely</span>
      </div>

      <div className="mt-auto text-center">
        <motion.div initial={{ y: 14, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.08 }}>
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full border-2 border-white/75 bg-white/16 backdrop-blur-sm">
            <svg viewBox="0 0 24 24" className="h-7 w-7" fill="none" stroke="currentColor" strokeWidth="2.1" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 3 3.5 7.2v5.3c0 4.6 3.4 7.8 8.5 9.5 5.1-1.7 8.5-4.9 8.5-9.5V7.2L12 3Z" />
              <path d="m8.5 12.3 2.2 2.2 4.8-5" />
            </svg>
          </div>
          <h1 className="mx-auto mt-4 max-w-[340px] text-[28px] font-black leading-[1.06] tracking-[-0.035em] [text-shadow:0_3px_12px_rgba(0,0,0,.22)]">Remember to be alert at all times</h1>
          <p className="mx-auto mt-3 max-w-[325px] text-[13px] font-bold leading-5 text-white/82">Stay aware of your surroundings and never play while driving or enter dangerous or restricted areas.</p>
        </motion.div>

        <motion.button
          type="button"
          whileTap={{ scale: 0.97 }}
          onClick={onAccept}
          className="mt-6 h-14 w-full max-w-sm rounded-full border-2 border-white bg-white text-sm font-black uppercase tracking-[0.18em] text-[#2b7474] shadow-[0_8px_22px_rgba(10,43,48,.3)]"
        >
          I understand
        </motion.button>
        <p className="mt-3 text-[8px] font-bold uppercase tracking-[0.13em] text-white/58">Respect private property and local rules</p>
      </div>
    </div>
  </motion.div>
);

export default SafetyScreen;
